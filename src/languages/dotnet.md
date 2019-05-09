# .NET Core


Platform.sh supports deploying .NET Core applications.

## Supported versions

* 2.0
* 2.1
* 2.2

To specify a dotnet container, use the `type` property in your `.platform.app.yaml`.

```yaml
type: 'dotnet:2.2'
```

## Building the application

Dotnet containers do not come with a pre-defined build process that you may have seen on other container types. Instead, the process is defined by you, using the runtime and output directory variables passed to the build environment.

For simple applications, we recommend using `dotnet publish --self-contained`, while specifying the target runtime and output folders via said environment variables:

```yaml
hooks:
    build: |
        set -xe
        dotnet publish --self-contained --runtime "$DOTNET_DEFAULT_RUNTIME" --output "$PLATFORM_OUTPUT_DIR" -p:UseRazorBuildServer=false -p:UseSharedCompilation=false
```

When using a custom build hook, make sure to copy the `-p` toggles over, or builds will take much longer. Alternatively, when making multiple builds within one build hook, you might want to leave the servers enabled and call `dotnet build-server shutdown` at the end of your build hook.

## Running the application

Dotnet applications should be started using the `web.commands.start` directive in `.platform.app.yaml`. This ensures that the command starts at the right moment and stops gracefully when a re-deployment needs to be executed. Also, should the program terminate for any reason, it will be automatically restarted. Note that the start command _must_ run in the foreground.

Incoming requests are passed to the application using either a TCP (default) or UNIX socket. The application must use the [appropriate environment variable](/configuration/app/web.html#socket-family) to determine the URI to listen on. In case of a TCP socket (recommended due to [this](https://go.microsoft.com/fwlink/?linkid=874850)), the application must listen on `http://127.0.0.1`, using port defined by the `PORT` environment variable.


There will be an Nginx server sitting in front of your application. We recommend serving static content via Nginx, as this allows easy control of headers (including cache headers), and also has marginal performance benefits. Note that HTTPS is also terminated at the Ngnix proxy, so the `app.UseHttpsRedirection();` line (which is in `Startup.cs` by default) should be removed. To force HTTPS-only, please refer to the pages about [routes configuration](/configuration/routes/https.html#https).

The following example configures your environment to serve the static content folders commonly found in ASP.NET MVC templates using Nginx, while routing other traffic to the .NET application.

```yaml
web:
    locations:
        "/":
            root: "wwwroot"
            allow: true
            passthru: true
            rules:
                # Let's serve these common asset types with customs cache headers.
                \.(jpe?g|png|gif|svgz?|css|js|map|ico|bmp|eot|woff2?|otf|ttf)$:
                allow: true
                expires: 300s

    commands:
       start: |
          ./WebApplication1
```

If desired, you may also route all requests to the application unconditionally:

```yaml
web:
    locations:
        "/":
            allow: false
            passthru: true

    commands:
       start: |
          ./WebApplication1
```


## Project templates

Platform.sh offers a project templates for ASP.NET Core applications using the structure described above.  It can be used as a starting point or reference for building your own website or web application.

[ASP.NET Core Example Application](https://github.com/platformsh/platformsh-example-aspnetcore)


