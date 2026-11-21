<?php
/* Kegzo API config. Secrets live OUTSIDE public_html so git deploys never touch them:
   /home/<user>/domains/<domain>/kegzo_private/secrets.php  (see SECRETS-TEMPLATE.php)
   If the file is missing the site still works; sign-up and contact return a friendly error. */
declare(strict_types=1);
const KZ_PRIVATE_DIR = __DIR__ . '/../../kegzo_private';
$kzSecrets = KZ_PRIVATE_DIR . '/secrets.php';
if (is_file($kzSecrets)) { require $kzSecrets; }
define('KZ_READY', defined('MAIL_FROM') && defined('CONTACT_TO'));
if (!defined('SITE_URL')) define('SITE_URL', 'https://kegzo.com');
if (!defined('DB_PATH')) define('DB_PATH', KZ_PRIVATE_DIR . '/kegzo.sqlite');
if (!defined('MAIL_FROM_NAME')) define('MAIL_FROM_NAME', 'Kegzo');
if (!defined('HASH_SALT')) define('HASH_SALT', 'change-me');

function kz_db(): PDO {
  static $db = null; if ($db) return $db;
  $dir = dirname(DB_PATH); if (!is_dir($dir)) @mkdir($dir, 0750, true);
  $db = new PDO('sqlite:' . DB_PATH, null, null, [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC]);
  $db->exec('PRAGMA journal_mode=WAL');
  $db->exec('CREATE TABLE IF NOT EXISTS leads(id INTEGER PRIMARY KEY, email TEXT UNIQUE NOT NULL, state TEXT NOT NULL DEFAULT \'pending\', token TEXT, src TEXT, created TEXT NOT NULL, verified TEXT, unsub INTEGER NOT NULL DEFAULT 0)');
  $db->exec('CREATE TABLE IF NOT EXISTS contacts(id INTEGER PRIMARY KEY, name TEXT, email TEXT, message TEXT, created TEXT NOT NULL, mailed INTEGER NOT NULL DEFAULT 0)');
  $db->exec('CREATE TABLE IF NOT EXISTS hits(day TEXT NOT NULL, ev TEXT NOT NULL, n INTEGER NOT NULL DEFAULT 0, PRIMARY KEY(day, ev))');
  $db->exec('CREATE TABLE IF NOT EXISTS rate(k TEXT NOT NULL, ts INTEGER NOT NULL)');
  return $db;
}
function kz_json(array $a, int $code = 200): void { http_response_code($code); header('Content-Type: application/json; charset=utf-8'); header('Cache-Control: no-store'); echo json_encode($a); exit; }
function kz_iphash(): string { return hash('sha256', ($_SERVER['REMOTE_ADDR'] ?? '') . HASH_SALT); }
/* simple rate limit: max $max events per $win seconds per key; stores only a salted hash, never the IP */
function kz_rate(string $bucket, int $max, int $win): bool {
  $db = kz_db(); $k = $bucket . ':' . kz_iphash(); $now = time();
  $db->prepare('DELETE FROM rate WHERE ts < ?')->execute([$now - 86400]);
  $st = $db->prepare('SELECT COUNT(*) FROM rate WHERE k = ? AND ts > ?'); $st->execute([$k, $now - $win]);
  if ((int)$st->fetchColumn() >= $max) return false;
  $db->prepare('INSERT INTO rate(k, ts) VALUES(?, ?)')->execute([$k, $now]); return true;
}
function kz_clean_header(string $s): string { return trim(str_replace(["\r", "\n", '%0a', '%0d'], '', $s)); }
/* SMTP over SSL (like the numerology app). Used when SMTP_HOST/SMTP_USER/SMTP_PASS are set in secrets.php; otherwise falls back to PHP mail(). */
function kz_smtp(string $to, string $subject, string $text, string $replyTo = ''): bool {
  $host = SMTP_HOST; $port = defined('SMTP_PORT') ? (int)SMTP_PORT : 465;
  $ctx = stream_context_create(['ssl' => ['verify_peer' => !defined('SMTP_INSECURE'), 'verify_peer_name' => !defined('SMTP_INSECURE'), 'allow_self_signed' => defined('SMTP_INSECURE')]]);
  $fp = @stream_socket_client('ssl://' . $host . ':' . $port, $en, $es, 15, STREAM_CLIENT_CONNECT, $ctx);
  if (!$fp) return false;
  stream_set_timeout($fp, 15);
  $read = function () use ($fp) { $d = ''; while (($l = fgets($fp, 515)) !== false) { $d .= $l; if (strlen($l) < 4 || $l[3] === ' ') break; } return $d; };
  $cmd = function (string $c, array $ok) use ($fp, $read) { if ($c !== '') fwrite($fp, $c . "\r\n"); $r = $read(); return in_array((int)substr($r, 0, 3), $ok, true); };
  $from = kz_clean_header(MAIL_FROM); $to = kz_clean_header($to);
  $ok = $cmd('', [220]) && $cmd('EHLO kegzo.com', [250]) && $cmd('AUTH LOGIN', [334]) && $cmd(base64_encode(SMTP_USER), [334]) && $cmd(base64_encode(SMTP_PASS), [235])
     && $cmd('MAIL FROM:<' . $from . '>', [250]) && $cmd('RCPT TO:<' . $to . '>', [250, 251]) && $cmd('DATA', [354]);
  if ($ok) {
    $h = 'Date: ' . date('r') . "\r\nFrom: " . kz_clean_header(MAIL_FROM_NAME) . ' <' . $from . ">\r\nTo: <" . $to . ">\r\nSubject: =?UTF-8?B?" . base64_encode($subject) . "?=\r\nMessage-ID: <" . bin2hex(random_bytes(12)) . '@kegzo.com>' . "\r\n";
    if ($replyTo && filter_var($replyTo, FILTER_VALIDATE_EMAIL)) $h .= 'Reply-To: ' . kz_clean_header($replyTo) . "\r\n";
    $h .= "MIME-Version: 1.0\r\nContent-Type: text/plain; charset=UTF-8\r\nContent-Transfer-Encoding: 8bit\r\n";
    $body = preg_replace('/^\./m', '..', str_replace(["\r\n", "\r"], "\n", $text)); $body = str_replace("\n", "\r\n", $body);
    $ok = $cmd($h . "\r\n" . $body . "\r\n.", [250]);
  }
  @fwrite($fp, "QUIT\r\n"); fclose($fp); return $ok;
}
function kz_mail(string $to, string $subject, string $text, string $replyTo = ''): bool {
  if (!KZ_READY) return false;
  if (defined('SMTP_HOST') && defined('SMTP_USER') && defined('SMTP_PASS')) return kz_smtp($to, $subject, $text, $replyTo);
  $h = 'From: ' . kz_clean_header(MAIL_FROM_NAME) . ' <' . kz_clean_header(MAIL_FROM) . ">\r\n";
  if ($replyTo && filter_var($replyTo, FILTER_VALIDATE_EMAIL)) $h .= 'Reply-To: ' . kz_clean_header($replyTo) . "\r\n";
  $h .= "MIME-Version: 1.0\r\nContent-Type: text/plain; charset=UTF-8\r\n";
  return @mail(kz_clean_header($to), '=?UTF-8?B?' . base64_encode($subject) . '?=', $text, $h, '-f' . kz_clean_header(MAIL_FROM));
}
const KZ_DISPOSABLE = ['mailinator.com','guerrillamail.com','10minutemail.com','tempmail.com','temp-mail.org','yopmail.com','trashmail.com','sharklasers.com','getnada.com','dispostable.com','maildrop.cc','throwawaymail.com'];
