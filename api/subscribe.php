<?php
/* POST email -> pending lead + one-click verification email. A verified email signs a new device in. */
require __DIR__ . '/config.php';
if ($_SERVER['REQUEST_METHOD'] !== 'POST') kz_json(['ok' => false, 'error' => 'Method not allowed'], 405);
if (!KZ_READY) kz_json(['ok' => false, 'error' => 'Sign-up is not switched on yet. Please try again later.'], 503);
if (!empty($_POST['website'])) kz_json(['ok' => true, 'state' => 'pending']); /* honeypot: pretend success */
if ((int)($_POST['t'] ?? 0) < 1500) kz_json(['ok' => false, 'error' => 'Please try again.'], 400);
$email = strtolower(trim((string)($_POST['email'] ?? '')));
if (!filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($email) > 200) kz_json(['ok' => false, 'error' => 'Please enter a valid email address.'], 400);
if (in_array(substr(strrchr($email, '@'), 1), KZ_DISPOSABLE, true)) kz_json(['ok' => false, 'error' => 'Please use a permanent email address.'], 400);
try {
  if (!kz_rate('sub', 6, 3600)) kz_json(['ok' => false, 'error' => 'Too many attempts. Please try again in an hour.'], 429);
  $db = kz_db();
  $st = $db->prepare('SELECT * FROM leads WHERE email = ?'); $st->execute([$email]); $row = $st->fetch();
  if ($row && $row['state'] === 'verified') kz_json(['ok' => true, 'state' => 'verified']);
  $token = bin2hex(random_bytes(24));
  if ($row) $db->prepare('UPDATE leads SET token = ? WHERE id = ?')->execute([$token, $row['id']]);
  else $db->prepare("INSERT INTO leads(email, state, token, src, created) VALUES(?, 'pending', ?, ?, ?)")->execute([$email, $token, substr((string)($_POST['src'] ?? ''), 0, 20), gmdate('c')]);
  $link = SITE_URL . '/api/verify.php?t=' . $token;
  $body = "Hi,\n\nTap the link below to confirm your email and switch on progress saving in Kegzo:\n\n$link\n\nIf you didn't ask for this, you can ignore this email.\n\nKegzo\n" . SITE_URL . "\n";
  $html = kz_email_html('Confirm your email', "You're one tap away from saving your Kegzo progress. Confirm your email and your level, streak and charts will follow you to any device.", 'Confirm my email', $link, "Didn't ask for this? You can safely ignore this email.");
  kz_mail($email, 'Confirm your email for Kegzo', $body, '', $html);
  /* tell the owner about every new sign-up */
  if (!$row && defined('CONTACT_TO')) {
    $tot = (int)$db->query('SELECT COUNT(*) FROM leads')->fetchColumn();
    $txt = "New Kegzo sign-up (waiting for them to confirm).\n\nEmail: $email\nWhen: " . gmdate('D j M Y, H:i') . " (UTC)\nTotal sign-ups: $tot\n\nSee all subscribers: " . SITE_URL . "/api/admin.php\n";
    kz_mail(CONTACT_TO, 'New Kegzo sign-up: ' . $email, $txt, '', kz_email_html('New sign-up 🎉', "Email: $email\nWhen: " . gmdate('D j M Y, H:i') . " (UTC)\nStatus: waiting for them to confirm\nTotal sign-ups: $tot", 'View all subscribers', SITE_URL . '/api/admin.php'));
  }
  kz_json(['ok' => true, 'state' => 'pending']);
} catch (Throwable $e) { kz_json(['ok' => false, 'error' => 'Something went wrong. Please try again.'], 500); }
