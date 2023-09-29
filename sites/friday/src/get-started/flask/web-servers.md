---
title: Switching from the Flask server to an alternative Web Server
sidebarTitle: Change web server
description: Steps for changing the web server on {{% vendor/name %}}.
---
{{< note theme="warning" >}}
Please note that the instructions on this page assume you have followed the
[Deploying Flask on Upsun](/get-started/flask/deploy/_index.md) guide. You may need to adjust the steps for your
specific Flask implementation.
{{< /note >}}

While lightweight and easy to use, Flask’s built-in server is not suitable for production as it doesn’t
scale well.

{{% vendor/name %}} [supports several different web servers](/languages/python/server/_index.md) for Python
that you can use instead. The specific web server you choose will depend on your application and specific requirements.

Let's look at how we can switch our project to use [gunicorn](https://gunicorn.org/) + PORT.

Reopen the `{{< vendor/configfile "app" >}}` file.

Locate the `web:commands:start` section where in the previous section
we added `flask run -p $PORT`. We now want to change it to `gunicorn -w 4 'autoapp:app'`

```yaml {configFile="app"}
    web:
      # Commands are run once after deployment to start the application process.
      commands:
        # The command to launch your app. If it terminates, it’s restarted immediately.
        # You can use the $PORT or the $SOCKET environment variable depending on the socket family of your upstream
        start: "gunicorn -w 4 'autoapp:app'"
```

Commit the changes and push them up to your environment:

```shell
git add {{< vendor/configfile "app" >}}
```
```shell
git commit -m "changes project to use gunicorn"
```
```shell
{{% vendor/cli %}} environment:push -y
```
## Conclusion
Now that you have your Flask application up and running on {{% vendor/name %}}, we'll explore the different options you
have for a more robust local development environment, adding a source control integration, and adding
various services to your project. But for now, go forth and Deploy (even on Fridays)!

{{< guide-buttons previous="Local Development" type="previous" >}}
