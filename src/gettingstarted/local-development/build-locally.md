# Local development

## Build site locally

Now that you've opened tunnels into your services, you'll have access to all of your data in your environment. All that's left now is to actually build the site.

<asciinema-player src="/videos/asciinema/build.cast" preload=1></asciinema-player>

1. **Build the site**

    From the repository root, run the command

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

    Applications written in Node.js, Go and Java will automatically listen on a port locally, so it will only be necessary to execute the program directly.

3. **Cleanup**

    That's it! Now you can easily spin up a local build of your application and test new features with full access to all of the data in your services. When you are finished, shut down the web server and then close the tunnel to your services:

    ```bash
    platform tunnel:close
    ```

Now you know how to connect to your services on Platform.sh and perform a local build during development.

<div class="buttons">
  <a href="#" class="prev-link button-link">Back</a>
  <a href="#" class="next-link button-link">I have built my application locally</a>
</div>
