<?php
/* No-JS contact form. Store first, then email, so a mail failure never loses a message.
   The recipient address lives only in secrets.php (CONTACT_TO). */
require __DIR__ . '/config.php';
$back = fn(string $q) => (header('Location: /contact.html?' . $q, true, 303) || true) && exit;
if ($_SERVER['REQUEST_METHOD'] !== 'POST') $back('error=method');
if (!empty($_POST['website'])) $back('sent=1');
$t = (int)($_POST['t'] ?? 0); if ($t > 0 && (int)(microtime(true) * 1000) - $t < 3000) $back('error=fast');
$name = trim(mb_substr((string)($_POST['name'] ?? ''), 0, 100));
$email = trim(mb_substr((string)($_POST['email'] ?? ''), 0, 200));
$msg = trim(mb_substr((string)($_POST['message'] ?? ''), 0, 4000));
if ($name === '' || $msg === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) $back('error=invalid');
if (!KZ_READY) $back('error=setup');
try {
  if (!kz_rate('contact', 5, 3600)) $back('error=limit');
  $db = kz_db(); $db->prepare('INSERT INTO contacts(name, email, message, created) VALUES(?, ?, ?, ?)')->execute([$name, $email, $msg, gmdate('c')]); $id = $db->lastInsertId();
  if (kz_mail(CONTACT_TO, 'Kegzo contact: ' . kz_clean_header($name), "From: $name <$email>\n\n$msg\n", $email)) $db->prepare('UPDATE contacts SET mailed = 1 WHERE id = ?')->execute([$id]);
  $back('sent=1');
} catch (Throwable $e) { $back('error=server'); }
