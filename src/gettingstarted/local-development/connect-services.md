# Local development

## Connect to services

> **Note:** If your application does not contain any services, you do not need to open a tunnel and can proceed to the next step.

Now that you have a local copy of your application code, you can make changes to the project without pushing to Platform.sh each time to test them. Instead you can locally build your application using the CLI, even when its functionality depends on a number of services.

<asciinema-player src="/videos/asciinema/tunnel-open.cast" preload=1></asciinema-player>

1. **Open an SSH tunnel to connect to your services**

    Open local [SSH tunnels](/development/local/tethered.md#ssh-tunneling) to your environment's services.

    ```bash
    platform tunnel:open
    ```

2. **Export environment variables**

    Platform.sh utilizes environment variables called Relationships within the application container. These store the credentials needed to connect to individual services. In order to connect with them remotely using the SSH tunnel you will need to mimic the same environment variables locally.

    ```bash
    export PLATFORM_RELATIONSHIPS="$(platform tunnel:info --encode)"
    ```
    In order to use these credentials to connect to your services, it is also necessary that those services are locally installed.

    Additionally, if your application also needs access to the `PORT` environment variable, you can mock the variable used in a Platform.sh environment with

    ```bash
    export PORT=8888
    ```

3. **Verify**

    You can visualize the open tunnels for your application with the command

    ```bash
    platform tunnel:list
    ```

Now that you have created an SSH tunnel to your services, build your application locally.

<div id = "buttons"></div>

<script>
$(document).ready(function(){
  var navNextText = "I have opened an SSH tunnel into my services";
  var navButtons = {type: "navigation", prev: getPathObj("prev"), next: getPathObj("next", navNextText), div: "buttons"};
  makeButton(navButtons);
});
</script>
