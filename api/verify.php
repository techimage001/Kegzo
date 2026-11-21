<?php
require __DIR__ . '/config.php';
$t = preg_replace('/[^a-f0-9]/', '', (string)($_GET['t'] ?? ''));
$ok = false;
if (KZ_READY && strlen($t) === 48) {
  try {
    $db = kz_db();
    $q = $db->prepare('SELECT email, state FROM leads WHERE token = ?'); $q->execute([$t]); $lead = $q->fetch();
    /* keep the token so tapping the link again (or on another device) still signs in */
    $st = $db->prepare("UPDATE leads SET state = 'verified', verified = COALESCE(verified, ?) WHERE token = ?"); $st->execute([gmdate('c'), $t]); $ok = $st->rowCount() > 0;
    /* tell the owner about each newly confirmed sign-up */
    if ($ok && $lead && $lead['state'] !== 'verified' && defined('CONTACT_TO')) {
      $n = (int)$db->query("SELECT COUNT(*) FROM leads WHERE state = 'verified'")->fetchColumn();
      $txt = "A Kegzo sign-up just confirmed their email.\n\nEmail: " . $lead['email'] . "\nConfirmed: " . gmdate('D j M Y, H:i') . " (UTC)\nTotal confirmed members: $n\n\nSee all subscribers: " . SITE_URL . "/api/admin.php\n";
      kz_mail(CONTACT_TO, 'Confirmed: ' . $lead['email'] . ' joined Kegzo', $txt, '', kz_email_html('New member confirmed ✅', "Email: " . $lead['email'] . "\nConfirmed: " . gmdate('D j M Y, H:i') . " (UTC)\nTotal confirmed members: $n", 'View all subscribers', SITE_URL . '/api/admin.php'));
    }
  } catch (Throwable $e) {}
}
$em = ($ok && !empty($lead['email'])) ? rtrim(strtr(base64_encode($lead['email']), '+/', '-_'), '=') : '';
header('Location: ' . ($ok ? '/app.html#verified' . ($em ? '=' . $em : '') : '/app.html#today'), true, 302); exit;
