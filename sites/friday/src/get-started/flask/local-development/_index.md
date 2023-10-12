---
title: Local Development
description: Steps for connecting a local development instance of Flask {{% vendor/name %}} infrastructure.
---

{{< note >}}
The instructions on this page assume you've followed the [Deploy Flask on {{% vendor/name %}}](/get-started/flask/deploy/_index.md) guide.
You may need to adjust the steps for your specific Flask implementation.
{{< /note >}}

Now that your Flask app is deployed on {{% vendor/name %}}, you need a local environment to be able to make quick changes.
You can use the built-in Flask development server.

To do so, follow these steps:

1. To allow your virtual environment to communicate with your database, run the following command:

   ```bash {location="Terminal"}
   {{% vendor/cli %}} tunnel:open -y
   ```
   
   An SSH tunnel to all the services for your app is open.</br>
   To verify it's open and working, run the following command:

   ```bash {location="Terminal"}
   {{% vendor/cli %}} tunnel:info
   ```

2. To instruct {{% vendor/name %}} to prepare everything your Flask development server needs to start,
   run the following commands:

   ```bash {location="Terminal"}
   npm install
   npm run build
   ```

3. To start your server, run the following command:

   ```bash {location="Terminal"}
   npm run start
   ```

   You can now view your local instance at `http://127.0.0.1:5000`.

   {{< note >}}
   You are now connected to your production database.
   Therefore, changes you make locally in the interface (such as adding a new user) are being added to production.</br>
   To make changes without affecting production, see how you can [set up a local development environment](/development/local/_index.md)
   that creates copies of your database.
   {{< /note >}}
