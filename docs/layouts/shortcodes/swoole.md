## Install

Install the PHP extension for Swoole or Open Swoole during the build.

Take advantage of an [installation script](https://raw.githubusercontent.com/platformsh/snippets/main/src/install_swoole.sh).
You need to pass 2 parameters:

* Which Swoole project to use: `openswoole` or `swoole`
* Which version to install

{{ highlight ( readFile "snippets/swoole.yaml" ) "yaml" ".platform.app.yaml" }}
