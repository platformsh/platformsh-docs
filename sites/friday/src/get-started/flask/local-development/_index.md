---
title: Local Development
description: Steps for connecting a local development instance of Flask {{% vendor/name %}} infrastructure.
---
{{< note theme="warning" >}}
Please note that the instructions on this page assume you have followed the
[Deploying Flask on Upsun](/get-started/flask/deploy/_index.md) guide. You may need to adjust the steps for your
specific Flask implementation.
{{< /note >}}

Now that we have our Flask application working on {{% vendor/name %}} we'll need a local environment to be able to make
quick changes. Luckily Flask already has a development server we can take advantage of! And we can utilize
everything we set up previously with the Flask development server.

When we pushed our changes to {{% vendor/name %}} in the last section, it caused our database service to be redeployed
which closed our tunnel, so first we'll need to reopen it:

```shell
{{% vendor/cli %}} tunnel:open -y
```

You can verify the tunnel is open and working again by running the following command:

```shell
{{% vendor/cli %}} tunnel:info
```

Next we'll do the same steps we added to our build hook:

```shell
npm install
```
```shell
npm run build
```

Now we can run `npm start` which will run start up webpack watch and start up our Flask dev server:

```shell
npm run start
```

You can now view `http://127.0.0.1:5000` in your browser to see your local instance.
{{< note >}}
Please note that you are
connected to your production database so any changes you make locally in the interface (like adding a new
user) are being added to production. In a later guide will discuss setting up a local development environment
that creates copies of your database to run locally as well.
{{< /note >}}
