<?php
/* Kegzo admin: usage counts, sign-ups and messages. Locked unless ADMIN_PASSWORD is set in secrets.php. */
require __DIR__ . '/config.php';
session_set_cookie_params(['httponly' => true, 'secure' => !empty($_SERVER['HTTPS']), 'samesite' => 'Strict']);
session_start();
header('X-Robots-Tag: noindex'); header('Cache-Control: no-store');
$h = fn($s) => htmlspecialchars((string)$s, ENT_QUOTES, 'UTF-8');
if (!defined('ADMIN_PASSWORD') || ADMIN_PASSWORD === '') { http_response_code(403); exit('Admin is locked. Set ADMIN_PASSWORD in kegzo_private/secrets.php.'); }
if (empty($_SESSION['csrf'])) $_SESSION['csrf'] = bin2hex(random_bytes(16));
if (isset($_POST['pw'])) { if (kz_rate('admin', 8, 900) && hash_equals(ADMIN_PASSWORD, (string)$_POST['pw'])) { session_regenerate_id(true); $_SESSION['ok'] = 1; } header('Location: admin.php'); exit; }
if (isset($_GET['logout'])) { session_destroy(); header('Location: admin.php'); exit; }
if (empty($_SESSION['ok'])) { ?><!DOCTYPE html><meta name="viewport" content="width=device-width,initial-scale=1"><title>Kegzo admin</title><style>body{font:16px system-ui;background:#14112A;color:#F4F1FF;display:grid;place-items:center;min-height:90vh}input,button{font:inherit;padding:12px;border-radius:10px;border:1px solid #383163;margin:4px 0;width:100%}button{background:#FF6B4A;border:0;font-weight:600}</style><form method="post"><h2>Kegzo admin</h2><input type="password" name="pw" placeholder="Password" autofocus><button>Sign in</button></form><?php exit; }
$db = kz_db(); $tok = $_SESSION['csrf'];
if ($_SERVER['REQUEST_METHOD'] === 'POST' && hash_equals($tok, (string)($_POST['csrf'] ?? ''))) {
  if (isset($_POST['del_lead'])) $db->prepare('DELETE FROM leads WHERE id = ?')->execute([(int)$_POST['del_lead']]);
  if (isset($_POST['del_contact'])) $db->prepare('DELETE FROM contacts WHERE id = ?')->execute([(int)$_POST['del_contact']]);
  header('Location: admin.php'); exit;
}
if (isset($_GET['csv'])) { header('Content-Type: text/csv; charset=utf-8'); header('Content-Disposition: attachment; filename="kegzo-verified-leads.csv"'); $o = fopen('php://output', 'w'); fputcsv($o, ['email', 'created', 'verified']);
  foreach ($db->query("SELECT email, created, verified FROM leads WHERE state = 'verified' AND unsub = 0 ORDER BY id") as $r) fputcsv($o, $r); exit; }
$hits = $db->query("SELECT day, ev, n FROM hits WHERE day >= date('now', '-30 day') ORDER BY day DESC")->fetchAll();
$days = []; foreach ($hits as $r) $days[$r['day']][$r['ev']] = $r['n'];
$evs = ['app_open','onboarded','session_start','session_done','test_done','signup'];
$leads = $db->query('SELECT * FROM leads ORDER BY id DESC LIMIT 500')->fetchAll();
$contacts = $db->query('SELECT * FROM contacts ORDER BY id DESC LIMIT 200')->fetchAll();
$nv = (int)$db->query("SELECT COUNT(*) FROM leads WHERE state='verified'")->fetchColumn(); $np = (int)$db->query("SELECT COUNT(*) FROM leads WHERE state='pending'")->fetchColumn();
?><!DOCTYPE html><meta name="viewport" content="width=device-width,initial-scale=1"><title>Kegzo admin</title>
<style>body{font:15px system-ui;background:#14112A;color:#F4F1FF;margin:0;padding:18px}table{border-collapse:collapse;width:100%;margin:8px 0 26px;font-size:14px}td,th{border-bottom:1px solid #383163;padding:7px;text-align:left}a{color:#5BD6C9}.wrap{overflow-x:auto}button{background:none;border:1px solid #383163;color:#FF8A80;border-radius:8px;padding:4px 8px}.k{display:inline-block;background:#1F1A3D;border-radius:12px;padding:10px 14px;margin:0 8px 8px 0}</style>
<h1>Kegzo admin</h1><p><a href="?csv=1">Export verified leads (CSV)</a> · <a href="?logout=1">Sign out</a></p>
<p><span class="k"><b><?= $nv ?></b> verified</span><span class="k"><b><?= $np ?></b> pending</span><span class="k"><b><?= count($contacts) ?></b> messages</span></p>
<h2>Usage, last 30 days</h2><div class="wrap"><table><tr><th>Day</th><?php foreach ($evs as $e) echo '<th>' . $h($e) . '</th>'; ?></tr><?php foreach ($days as $d => $row) { echo '<tr><td>' . $h($d) . '</td>'; foreach ($evs as $e) echo '<td>' . (int)($row[$e] ?? 0) . '</td>'; echo '</tr>'; } ?></table></div>
<h2>Sign-ups</h2><div class="wrap"><table><tr><th>Email</th><th>State</th><th>Created</th><th></th></tr><?php foreach ($leads as $l) { ?><tr><td><?= $h($l['email']) ?></td><td><?= $h($l['state']) ?></td><td><?= $h(substr($l['created'], 0, 10)) ?></td><td><form method="post" onsubmit="return confirm('Delete this email permanently?')"><input type="hidden" name="csrf" value="<?= $h($tok) ?>"><button name="del_lead" value="<?= (int)$l['id'] ?>">Delete</button></form></td></tr><?php } ?></table></div>
<h2>Messages</h2><div class="wrap"><table><tr><th>From</th><th>Message</th><th>Date</th><th></th></tr><?php foreach ($contacts as $c) { ?><tr><td><?= $h($c['name']) ?><br><a href="mailto:<?= $h($c['email']) ?>"><?= $h($c['email']) ?></a></td><td><?= nl2br($h($c['message'])) ?></td><td><?= $h(substr($c['created'], 0, 10)) ?></td><td><form method="post" onsubmit="return confirm('Delete this message?')"><input type="hidden" name="csrf" value="<?= $h($tok) ?>"><button name="del_contact" value="<?= (int)$c['id'] ?>">Delete</button></form></td></tr><?php } ?></table></div>
