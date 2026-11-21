<?php
/* Returns the confirmed email for a sign-in code, so the confirm link never carries the email in the address. */
require __DIR__ . '/config.php';
$t = preg_replace('/[^a-f0-9]/', '', (string)($_GET['t'] ?? ''));
if (!KZ_READY || strlen($t) !== 48) kz_json(['ok' => false], 400);
try {
  if (!kz_rate('who', 30, 3600)) kz_json(['ok' => false], 429);
  $st = kz_db()->prepare("SELECT email FROM leads WHERE token = ? AND state = 'verified'"); $st->execute([$t]); $e = $st->fetchColumn();
  kz_json($e ? ['ok' => true, 'email' => $e] : ['ok' => false]);
} catch (Throwable $e) { kz_json(['ok' => false], 500); }
