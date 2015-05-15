<?php
$path = parse_url($_SERVER['REQUEST_URI']);
$path = ltrim(rtrim($path["path"], '/'), '.'); //trim trailing slash and prefix dots
$index = getcwd() .$path ."/index.html";
if (file_exists($index)){
  readfile($index);
} else { 
  http_response_code(404);
  readfile("index.html");
}