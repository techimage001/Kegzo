<?php
/* Kegzo API config. Secrets live OUTSIDE public_html so git deploys never touch them:
   /home/<user>/domains/<domain>/kegzo_private/secrets.php  (see SECRETS-TEMPLATE.php)
   If the file is missing the site still works; sign-up and contact return a friendly error. */
declare(strict_types=1);
const KZ_PRIVATE_DIR = __DIR__ . '/../../kegzo_private';
$kzSecrets = KZ_PRIVATE_DIR . '/secrets.php';
if (is_file($kzSecrets)) {
  $kzCfg = require $kzSecrets;
  /* also accepts the numerology-app style: return ['mail_from' => '...', 'smtp_pass' => '...', ...] */
  if (is_array($kzCfg)) {
    $kzMap = ['site_url'=>'SITE_URL','mail_from'=>'MAIL_FROM','from_email'=>'MAIL_FROM','mail_from_name'=>'MAIL_FROM_NAME','from_name'=>'MAIL_FROM_NAME','contact_to'=>'CONTACT_TO','notify_email'=>'CONTACT_TO','admin_password'=>'ADMIN_PASSWORD','hash_salt'=>'HASH_SALT','site_salt'=>'HASH_SALT','smtp_host'=>'SMTP_HOST','smtp_port'=>'SMTP_PORT','smtp_user'=>'SMTP_USER','smtp_pass'=>'SMTP_PASS','db_path'=>'DB_PATH'];
    foreach ($kzCfg as $k => $v) { $c = $kzMap[strtolower((string)$k)] ?? null; if ($c && !defined($c) && $v !== '' && $v !== null) define($c, $v); }
  }
}
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
function kz_smtp(string $to, string $subject, string $text, string $replyTo = '', string $html = ''): bool {
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
    $norm = fn($t) => str_replace("\n", "\r\n", str_replace(["\r\n", "\r"], "\n", $t));
    if ($html !== '') { $b = 'kz' . bin2hex(random_bytes(8));
      $h .= "MIME-Version: 1.0\r\nContent-Type: multipart/alternative; boundary=\"$b\"\r\n";
      $body = "--$b\r\nContent-Type: text/plain; charset=UTF-8\r\nContent-Transfer-Encoding: base64\r\n\r\n" . chunk_split(base64_encode($norm($text))) . "--$b\r\nContent-Type: text/html; charset=UTF-8\r\nContent-Transfer-Encoding: base64\r\n\r\n" . chunk_split(base64_encode($html)) . "--$b--";
    } else {
      $h .= "MIME-Version: 1.0\r\nContent-Type: text/plain; charset=UTF-8\r\nContent-Transfer-Encoding: 8bit\r\n";
      $body = preg_replace('/^\./m', '..', $norm($text));
    }
    $ok = $cmd($h . "\r\n" . $body . "\r\n.", [250]);
  }
  @fwrite($fp, "QUIT\r\n"); fclose($fp); return $ok;
}
function kz_mail(string $to, string $subject, string $text, string $replyTo = '', string $html = ''): bool {
  if (!KZ_READY) return false;
  if (defined('SMTP_HOST') && defined('SMTP_USER') && defined('SMTP_PASS')) return kz_smtp($to, $subject, $text, $replyTo, $html);
  $h = 'From: ' . kz_clean_header(MAIL_FROM_NAME) . ' <' . kz_clean_header(MAIL_FROM) . ">\r\n";
  if ($replyTo && filter_var($replyTo, FILTER_VALIDATE_EMAIL)) $h .= 'Reply-To: ' . kz_clean_header($replyTo) . "\r\n";
  $h .= "MIME-Version: 1.0\r\nContent-Type: text/plain; charset=UTF-8\r\n";
  return @mail(kz_clean_header($to), '=?UTF-8?B?' . base64_encode($subject) . '?=', $text, $h, '-f' . kz_clean_header(MAIL_FROM));
}
/* Branded HTML email (dark Kegzo look, works in Gmail/Outlook/Apple Mail). */
function kz_email_html(string $title, string $intro, string $btnText = '', string $btnUrl = '', string $outro = ''): string {
  $e = fn($x) => htmlspecialchars($x, ENT_QUOTES, 'UTF-8');
  $btn = $btnUrl ? '<tr><td style="padding:8px 32px 8px"><a href="' . $e($btnUrl) . '" style="display:inline-block;background:#FF6B4A;color:#2A0E07;font-weight:700;font-size:17px;text-decoration:none;padding:15px 30px;border-radius:999px">' . $e($btnText) . '</a></td></tr><tr><td style="padding:14px 32px 0;font-size:13px;line-height:1.5;color:#9C94C4">Button not working? Copy this link into your browser:<br><a href="' . $e($btnUrl) . '" style="color:#5BD6C9;word-break:break-all">' . $e($btnUrl) . '</a></td></tr>' : '';
  return '<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="dark light"></head><body style="margin:0;padding:0;background:#0E0B20"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0E0B20;padding:24px 12px"><tr><td align="center"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#1B1638;border-radius:20px;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#F4F1FF">'
   . '<tr><td style="padding:28px 32px 6px"><table role="presentation" cellpadding="0" cellspacing="0"><tr><td style="background:#FF6B4A;border-radius:10px;width:36px;height:36px;text-align:center;font-size:20px;line-height:36px;color:#2A0E07;font-weight:800">K</td><td style="padding-left:10px;font-size:22px;font-weight:800;color:#FFFFFF">Kegzo</td></tr></table></td></tr>'
   . '<tr><td style="padding:18px 32px 6px;font-size:24px;font-weight:800;line-height:1.25;color:#FFFFFF">' . $e($title) . '</td></tr>'
   . '<tr><td style="padding:6px 32px 18px;font-size:16px;line-height:1.6;color:#D6D0F2">' . nl2br($e($intro)) . '</td></tr>' . $btn
   . ($outro ? '<tr><td style="padding:22px 32px 0;font-size:14px;line-height:1.6;color:#9C94C4">' . nl2br($e($outro)) . '</td></tr>' : '')
   . '<tr><td style="padding:26px 32px 28px;font-size:12px;line-height:1.5;color:#7A72A8;border-top:1px solid #2E2756">Kegzo · Pelvic floor training, built like a game<br><a href="' . $e(SITE_URL) . '" style="color:#7A72A8">' . $e(preg_replace('#^https?://#', '', SITE_URL)) . '</a> · General fitness information, not medical advice.</td></tr>'
   . '</table></td></tr></table></body></html>';
}
const KZ_DISPOSABLE = ['mailinator.com','guerrillamail.com','10minutemail.com','tempmail.com','temp-mail.org','yopmail.com','trashmail.com','sharklasers.com','getnada.com','dispostable.com','maildrop.cc','throwawaymail.com'];
