---
title: "Build site locally"
weight: 3
toc: false
---


Now that you've opened tunnels into your services, you'll have access to all of your data in your environment. All that's left now is to actually build the site.

{{< asciinema src="videos/asciinema/build.cast" >}}

1. **Build the site**

    From the repository root, run the command

    ```bash
    platform build
    ```

    The Platform CLI will first ask you for the source directory and the build destination, then it will use your `.platform.app.yaml` file to execute the [build process locally](https://docs.platform.sh/gettingstarted/local.html#building-the-site-locally). This will create a `_www` directory in the project root that is a symlink to the currently active build, which is now located in `.platform/local/builds`.

2. **Verify**

    Move to the build destination (i.e. `cd _www`) and then run a local web server to verify the build.

{{< tabtest >}}
---
title=PHP
file=none
highlight=bash
markdownify=false
---

php -d variables_order=EGPCS -S localhost:8001

<--->
---
title=Python
file=none
highlight=bash
markdownify=false
---

python3 -m http.server 8000

<--->
---
title=Ruby
file=none
highlight=bash
markdownify=false
---

ruby -run -e httpd . -p 8000
{{< /tabtest >}}


  Applications written in Node.js, Go and Java can be configured to listen on a port locally, so it will only be necessary to execute the program directly.

3. **Cleanup**

    That's it! Now you can easily spin up a local build of your application and test new features with full access to all of the data in your services. When you are finished, shut down the web server and then close the tunnel to your services:

    ```bash
    platform tunnel:close
    ```

Now you know how to connect to your services on Platform.sh and perform a local build during development.

{{< guide-buttons next="I've built my application locally" >}}
