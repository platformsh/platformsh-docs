# Tethered Local

The simplest way to run a project locally is to use a local web server, but keep all other services on Platform.sh and connect to them over an SSH tunnel.  This approach requires very little setup, but depending on the speed of your connection and how I/O intensive your application is may not be performant enough to use regularly.  It will also require an active Internet connection, of course.

## Quick Start
In your application directory run ```platform tunnel:open &&  export PLATFORM_RELATIONSHIPS="$(platform tunnel:info --encode)"```. This will open an SSH tunnel to  your current platform.sh environment (based on your active git branch). 

You can now run your application locally (for example by running `php -S localhost:8001`). If it is configured to take its configuration from the Platform.sh environment you should be fine.  Just visit in your browser http://locahost:8001.

## Local web server

For the local web server the approach will vary depending on your language.

* For a self-serving language (Go or Node.js), simply run the program locally.
* For PHP, you may install your own copy of Nginx (or Apache) and PHP-FPM, or simply use the built-in PHP web server: `php -S localhost:8001` will start a basic web server capable of running PHP, serving the current directory, on port 8001.  See the [PHP manual](https://www.php.net/manual/en/features.commandline.webserver.php) for more information.
* For other languages it is recommended that you install your own copy of Nginx or Apache.
* A virtual machine or Docker image is also a viable option.

## SSH tunneling

Now that we have the code running, we need to connect it to our services.  To do so, open an SSH tunnel to the current project.

```bash
$ platform tunnel:open
SSH tunnel opened on port 30000 to relationship: redis
SSH tunnel opened on port 30001 to relationship: database
Logs are written to: ~/.platformsh/tunnels.log

List tunnels with: platform tunnels
View tunnel details with: platform tunnel:info
Close tunnels with: platform tunnel:close
```

> **note**
> The `platform tunnel:` commands require the pcntl and posix PHP extensions. Run `php -m | grep -E 'posix|pcntl'` to check if they're there.

Now you can connect to the remote database normally, as if it were local.

```
$ mysql --host=127.0.0.1 --port=30001 --user='user' --password='' --database='main'
```

The specific port that each service uses is not guaranteed, but is unlikely to change unless you add an additional service or connect to multiple projects at once.  In most cases it's safe to add a local-configuration file for your application that connects to, in this case, `localhost:30001` for the SQL database and `localhost:30000` for Redis.

Alternatively, you can read the relationship information directly from the Platform.sh CLI in your application using `platform tunnel:info --encode`, at the cost of that process call each time you do so.  The return value is a string encoded exactly the same way as the `PLATFORM_RELATIONSHIPS` environment variable on Platform.sh.

{% codetabs name="PHP", type="php" -%}
<?php
if ($relationships_encoded = shell_exec('platform tunnel:info --encode')) {
    $relationships = json_decode(base64_decode($relationships_encoded, TRUE), TRUE);
    // ...
}
{%- language name="Python", type="py" -%}
import json
import base64
import subprocess

encoded = subprocess.check_output(['platform', 'tunnel:info', '--encode'])
if (encoded):
    json.loads(base64.b64decode(relationships).decode('utf-8'))
    # ...
{%- endcodetabs %}



After the tunnel(s) are opened, you can confirm their presence:

```bash
platform tunnel:list
```

You can show more information about the open tunnel(s) with:

```bash
platform tunnel:info
```

and you can close tunnels with:

```bash
platform tunnel:close
```
