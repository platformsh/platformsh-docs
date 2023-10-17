---
title: Switch from the Flask server to another web server
sidebarTitle: Change web server
description: Steps for changing the web server on {{% vendor/name %}}.
---

{{< note >}}
The instructions on this page assume you've followed the [Deploy Flask on {{% vendor/name %}}](/get-started/flask/deploy/_index.md) guide.
You may need to adjust the steps for your specific Flask implementation.
{{< /note >}}

While lightweight and easy to use, Flask’s built-in server is not suitable for production as it doesn’t
scale well.</br>
{{% vendor/name %}} [supports several different web servers](/languages/python/server/_index.md) for Python
that you can use instead.
Choose your server depending on your app and specific requirements.

The following instructions allow you to switch to [Gunicorn](https://gunicorn.org/).
If you choose another web server, you may need to take different steps.

To switch to Gunicorn web server, follow these steps:

1. Open your `{{< vendor/configfile "app" >}}` file, and locate the section dedicated to the web server:

   ```yaml {configFile="app"}
   web:
     commands:
       start: "flask run -p $PORT"
     upstream:
       socket_family: tcp
   ```

   Change the `start` command:

   ```yaml {configFile="app"}
   web:
     # Commands are run once after deployment to start the application process.
     commands:
       # The command to launch your app. If it terminates, it’s restarted immediately.
       # You can use the $PORT or the $SOCKET environment variable depending on the socket family of your upstream
       start: "gunicorn -w 4 'autoapp:app'"
   ```

2. Commit your changes and push them to your environment. To do so, run the following commands:

   ```bash {location="Terminal"}
   git add {{< vendor/configfile "app" >}}
   git commit -m "Changes project to use Gunicorn"
   {{% vendor/cli %}} environment:push -y
   ```

## Next steps

- Set up a more robust [local development environment](/development/local/_index.md)
- [Add a source control integration](/integrations/_index.md)
- [Add various services](/add-services.md) to your project
