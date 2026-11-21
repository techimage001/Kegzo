<?php
require __DIR__ . '/config.php';
$t = preg_replace('/[^a-f0-9]/', '', (string)($_GET['t'] ?? ''));
$ok = false;
if (KZ_READY && strlen($t) === 48) {
  try {
    $db = kz_db();
    $q = $db->prepare('SELECT email, state FROM leads WHERE token = ?'); $q->execute([$t]); $lead = $q->fetch();
    $st = $db->prepare("UPDATE leads SET state = 'verified', verified = ?, token = NULL WHERE token = ?"); $st->execute([gmdate('c'), $t]); $ok = $st->rowCount() > 0;
    /* tell the owner about each newly confirmed sign-up */
    if ($ok && $lead && $lead['state'] !== 'verified' && defined('CONTACT_TO')) {
      $n = (int)$db->query("SELECT COUNT(*) FROM leads WHERE state = 'verified'")->fetchColumn();
      kz_mail(CONTACT_TO, 'New Kegzo sign-up: ' . $lead['email'], "Someone just joined Kegzo.\n\nEmail: " . $lead['email'] . "\nConfirmed: " . gmdate('D j M Y, H:i') . " (UTC)\nTotal confirmed members: $n\n\nSee everyone in your admin page:\n" . SITE_URL . "/api/admin.php\n");
    }
  } catch (Throwable $e) {}
}
header('Location: ' . ($ok ? '/app.html#verified' : '/app.html#today'), true, 302); exit;
