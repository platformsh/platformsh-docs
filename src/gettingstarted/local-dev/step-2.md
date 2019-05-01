<html>
<head>
  <link rel="stylesheet" type="text/css" href="/asciinema/asciinema-player.css" />
  <script src="/asciinema/asciinema-player.js"></script>
</head>
</html>

# Local development

## Connect to services

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis sed lobortis purus. Cras ullamcorper pharetra mollis. Mauris porttitor ante vitae ullamcorper iaculis. Phasellus maximus cursus dui ac pretium. 

{% asciinema_local %}/asciinema/recordings/tunnel-open.cast{% endasciinema_local %}

1. **Open an SSH tunnel to connect to your services**

    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis sed lobortis purus. Cras ullamcorper pharetra mollis. Mauris porttitor ante vitae ullamcorper iaculis. Phasellus maximus cursus dui ac pretium. 
    
    ```bash
    platform tunnel:open
    ```

2. **Export environment variables**

    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis sed lobortis purus. Cras ullamcorper pharetra mollis. Mauris porttitor ante vitae ullamcorper iaculis. Phasellus maximus cursus dui ac pretium. 
    
    ```bash
    export PLATFORM_RELATIONSHIPS="$(platform tunnel:info --encode)"
    ```
    
    In order to use these credentials to connect to your services, it is also necessary that those services are locally installed.
    
    Additionally, if your application also needs access to the `PORT` environment variable, you can mock the variable used in a Platform.sh environment with
    
    ```bash
    export=8888
    ```

3. **Verify**

    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis sed lobortis purus. Cras ullamcorper pharetra mollis. Mauris porttitor ante vitae ullamcorper iaculis. Phasellus maximus cursus dui ac pretium. 
    
    ```bash
    platform tunnel:list
    ```
    
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis sed lobortis purus. Cras ullamcorper pharetra mollis. Mauris porttitor ante vitae ullamcorper iaculis. Phasellus maximus cursus dui ac pretium. 

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
