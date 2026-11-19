<?php
/* Anonymous daily usage counter. No cookies, no IP, no identifiers: just a count per event per day. */
require __DIR__ . '/config.php';
$ALLOWED = ['app_open','onboarded','session_start','session_done','test_start','test_done','signup'];
$in = json_decode((string)file_get_contents('php://input'), true);
$ev = is_array($in) ? (string)($in['e'] ?? '') : '';
if (!in_array($ev, $ALLOWED, true)) { http_response_code(204); exit; }
try { kz_db()->prepare('INSERT INTO hits(day, ev, n) VALUES(?, ?, 1) ON CONFLICT(day, ev) DO UPDATE SET n = n + 1')->execute([gmdate('Y-m-d'), $ev]); } catch (Throwable $e) {}
http_response_code(204);
