<html>
<head>
  <link rel="stylesheet" type="text/css" href="/asciinema/asciinema-player.css" />
  <script src="/asciinema/asciinema-player.js"></script>
</head>
</html>

# Local Development

## Connect to services

Now that you have a local copy of your application code, it doesn't make sense to make changes to the project by pushing to Platform.sh each time to test them. Instead you can locally build your application using the CLI, even when its functionality depends on a number of services.

{% asciinema_local %}/asciinema/recordings/tunnel-open.cast{% endasciinema_local %}

1. **Open an SSH tunnel to connect to your services**

    The easiest way to build a project with services locally is on a local web server, keeping all other services on Platform.sh and connecting to them using an [SSH tunnel](/development/local/tethered.md#ssh-tunneling). You can consult the documentation if your are interested in other methods as well. 
    
    ```bash
    platform tunnel:open
    ```

2. **Export environment variables**

    Platform.sh utilizes a number of environment variables within the application container that store the credentials that are used to connect to individual services. In order to connect with them remotely using the SSH tunnel you will need to create the same local environment variables to mimic them. 
    
    ```bash
    export PLATFORM_RELATIONSHIPS="$(platform tunnel:info --encode)"
    ```
    
    In order to use these credentials to connect to your services, it is also necessary that those services are locally installed.
    
    Additionally, if your application also needs access to the `PORT` environment variable, you can mock the variable used in a Platform.sh environment with
    
    ```bash
    export=8888
    ```

3. **Verify**

    Lastly, you can visualize the open tunnels for your application with the command 
    
    ```bash
    platform tunnel:list
    ```
    
    and when you are finished with your local builds you can close the tunnel
    
    ```bash
    platform tunnel:close
    ```
    
Now that you have created an SSH tunnel to your services, all that's left to do is actually build your application locally.

<html>
<head>
<link rel="stylesheet" href="/styles/styles.css">
</head>
<body>

<br/><br/>

<center>

<a href="/gettingstarted/local-dev/step-1.html" class="buttongen small">Back</a>
<a href="/gettingstarted/local-dev/step-3.html" class="buttongen small">I have set up my free trial account</a>

</center>

<br/><br/>

</body>
</html>
