<?php
$path = parse_url($_SERVER['REQUEST_URI']);

$path = trim($path["path"], './');

if (strlen($path) && !strpos($path, '.html')) {
  $correct_path = $path . '.html';
  http_response_code(301);
  header('Location: /' . ltrim($correct_path, '/'));
  exit;
}

$resolved = realpath(__DIR__ . '/' . $path . "/index.html");
if ($resolved && strpos(__DIR__, $resolved) === 0) {
  header("Cache-Control: public, max-age=300");
  readfile($index);
} else { 
  http_response_code(404);
  readfile("index.html");
}
