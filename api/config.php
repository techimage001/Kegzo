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
function kz_mail(string $to, string $subject, string $text, string $replyTo = ''): bool {
  if (!KZ_READY) return false;
  $h = 'From: ' . kz_clean_header(MAIL_FROM_NAME) . ' <' . kz_clean_header(MAIL_FROM) . ">\r\n";
  if ($replyTo && filter_var($replyTo, FILTER_VALIDATE_EMAIL)) $h .= 'Reply-To: ' . kz_clean_header($replyTo) . "\r\n";
  $h .= "MIME-Version: 1.0\r\nContent-Type: text/plain; charset=UTF-8\r\n";
  return @mail(kz_clean_header($to), '=?UTF-8?B?' . base64_encode($subject) . '?=', $text, $h, '-f' . kz_clean_header(MAIL_FROM));
}
const KZ_DISPOSABLE = ['mailinator.com','guerrillamail.com','10minutemail.com','tempmail.com','temp-mail.org','yopmail.com','trashmail.com','sharklasers.com','getnada.com','dispostable.com','maildrop.cc','throwawaymail.com'];
