<?php
# Mapping of old URLs as key, and new URLs as values.
$url_mapping = array(
  '/web-ui/configure-environment' => '/user_guide/overview/web-ui/configure-environment.html',
  '/overview/web-ui/configure-environment.html' => '/user_guide/overview/web-ui/configure-environment.html',
  '/web-ui/configure-project' => '/user_guide/overview/web-ui/configure-project.html',
  '/overview/web-ui/configure-project.html' => '/user_guide/overview/web-ui/configure-project.html',    
  '/overview/technical-requirements' => '/user_guide/using/use-SSH.html',
  '/using/use-SSH.html' => '/user_guide/using/use-SSH.html'
);
# Load HTML files until Platform.sh supports directory indexes.
$path = parse_url($_SERVER['REQUEST_URI']);
$path = ltrim(rtrim($path["path"], '/'), '.'); //trim trailing slash and prefix dots
$index = realpath(getcwd() .$path ."/index.html");
if (substr($index, 0, strlen(realpath(getcwd()))) === realpath(getcwd()) && file_exists($index)){
  header("Cache-Control: public, max-age=300");
  readfile($index);
} else { 
    $location = array_key_exists($path, $url_mapping) ? $url_mapping[$path] : '/';
    header('Location: ' . $location);
}
