<?php
$url_mapping = array('/web-ui/configure-environment' => 'overview/web-ui/configure-environment.html');

$path = parse_url($_SERVER['REQUEST_URI']);
$path = ltrim(rtrim($path["path"], '/'), '.'); //trim trailing slash and prefix dots
$index = realpath(getcwd() .$path ."/index.html");
if (substr($index, 0, strlen(realpath(getcwd()))) === realpath(getcwd()) && file_exists($index)){
  header("Cache-Control: public, max-age=300");
  readfile($index);
} else { 
    header('Location: /' . array_key_exists($url_mapping, $path) ? $url_mapping[$path] : ''); 
}
