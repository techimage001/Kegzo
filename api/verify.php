<?php
require __DIR__ . '/config.php';
$t = preg_replace('/[^a-f0-9]/', '', (string)($_GET['t'] ?? ''));
$ok = false;
if (KZ_READY && strlen($t) === 48) {
  try { $st = kz_db()->prepare("UPDATE leads SET state = 'verified', verified = ?, token = NULL WHERE token = ?"); $st->execute([gmdate('c'), $t]); $ok = $st->rowCount() > 0; } catch (Throwable $e) {}
}
header('Location: ' . ($ok ? '/app.html#verified' : '/app.html#today'), true, 302); exit;
