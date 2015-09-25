<?php
function file_name($string){
  return str_replace(":","_",$string) .".md";
}

function create_md($namespace, $command){
  $dir ="commands/$namespace/";
  if (!is_dir($dir)) {mkdir($dir);};
  $md = shell_exec("platform help $command --format=md");
  file_put_contents($dir.file_name($command),$md);
}
function create_readme($namespace, $namespace_title){
  $dir ="commands/$namespace/";
  if (!is_dir($dir)) {mkdir($dir);};
  $md = "#$namespace_title";
  file_put_contents($dir."README.md",$md);
} 


$summary="";
$global_summary="";
$commands = json_decode(file_get_contents("commands.json"), true);
$namespaces=$commands["namespaces"];
if (!is_dir("commands")) {mkdir("commands");};

foreach($namespaces as $namespace){
  if ($namespace["id"]=='_global'){
    $namespace_title =  "Global commands" ;
    $global_summary .= "    * [$namespace_title](./reference/cli/commands/".$namespace["id"]."/README.md) \n";
    foreach($namespace["commands"] as $command){
      create_readme($namespace["id"], $namespace_title);
      create_md($namespace["id"], $command);
      $global_summary .= "      * [".$command."](./reference/cli/commands/".$namespace["id"]."/".file_name($command).")\n";
    }
  }
  else{
    $namespace_title = ucfirst($namespace["id"]);    
    $summary .= "    * [$namespace_title](./reference/cli/commands/".$namespace["id"]."/README.md) \n";
    foreach($namespace["commands"] as $command){
      create_readme($namespace["id"], $namespace_title);
      create_md($namespace["id"], $command);
      $summary .= "      * [".$command."](./reference/cli/commands/".$namespace["id"]."/".file_name($command).")\n";
    }
  }
}
file_put_contents("SUMMARY.md", $summary.$global_summary);
