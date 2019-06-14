# Local development

## Build site locally

Now that you've opened tunnels into your services, you'll have access to all of your data in your environment. All that's left now is to actually build the site.

<asciinema-player src="/videos/asciinema/build.cast" preload=1 autoplay=1 loop=1></asciinema-player>

1. **Build the site**

    Make sure that you are in your repository root, then run the command

    ```bash
    platform build
    ```

    The Platform CLI will first ask you for the source directory and the build destination, then it will use your `.platform.app.yaml` file to execute the build process locally.

2. **Verify**

    Move to the build destination (i.e. `cd _www`) and then run a local web server to verify the build.

    {% codetabs name="PHP", type="php" -%}
    php -d variables_order=EGPCS -S localhost:8001
    {%- language name="Python", type="py" -%}
    python3 -m http.server 8000
    {%- endcodetabs %}

3. **Cleanup**

    That's it! Now you can easily spin up a local build of your application and test new features with full access to all of the data in your services. When you are finished, remember to shut down the web server and then close the tunnel to your services:

    ```bash
    platform tunnel:close
    ```

Now you know how to connect to your services on Platform.sh and perform a local build during development. Move onto the next step to find some helpful additional resources.

<div id = "buttons"></div>

<script>
$(document).ready(function(){
  var navNextText = "I have built my application locally";
  var navButtons = {type: "navigation", prev: getPathObj("prev"), next: getPathObj("next", navNextText), div: "buttons"};
  makeButton(navButtons);
});
</script>
