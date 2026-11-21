<?php
/* Serves the writer's listing when it exists, otherwise the static guides page. */
$f = __DIR__ . '/index.html';
if (!is_file($f)) { $f = __DIR__ . '/start.html'; }
header('Content-Type: text/html; charset=utf-8');
readfile($f);
