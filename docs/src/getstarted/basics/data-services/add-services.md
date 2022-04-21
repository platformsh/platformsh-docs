---
title: "Add services"
weight: 2
description: |
  Add Platform.sh managed services to your environments.
---

## Cleanup

Before going forward, run the following commands to cleanup your project and **deactivate** your active development environments:

```bash
$ git checkout main
$ git pull platform main
$ platform environment:deactivate data-child -y --delete-branch
$ platform environment:deactivate data -y --delete-branch
```

Unlike before, the following commands both **deactivate** the environment and **delete** the remote branches for `data` and `data-child`.
Now, there should only be two environments on your project: **Main** (active, production) and **updates** (inactive, development).

## Add a service

Run the command below to create a new development environment:

```bash
platform environment:branch add-db
```

To add services to an environment, you will need to add another file specifically meant to configure them. 
Run the following command:

```bash
touch .platform/services.yaml
```

Open that file in your editor, and paste the following:

```yaml
db:
   type: mariadb:10.4
   disk: 2048
```

In this file, you've configured a new **service container** named `db`.
This container is a MariaDB database, and it's version is `10.4`.
Just like with your runtime language, you will notice that this version does not include patch versions you may be used to seeing (like `10.4.x`).

This is because Platform.sh provides **managed services**, which have the following features:

1. **Simple configuration.** Like creating staging environments, learning to provision and maintain services outside of Platform.sh takes a considerable amount of time to keep secure. The YAML abstraction above is short and simple, and does not require you to understand how to provision a database yourself.
1. **Sane defaults.** Provisioning a database - or runtime, or any other service - comes with its own extensive configuration. Keeping those services secure and functioning properly in a deployed environment means understanding the complexities of that whole other set of configuration. Most of that configuration, however, remains consistent for most use cases. Because of that, those defaults are set behind-the-scenes by Platform.sh so you don't need to. If you do need to configure more advanced features, more attributes are available to set them.
1. **Patch versions.** Services are configured in your `services.yaml` file to the minor version, and sometimes only the major version. Platform.sh maintains service containers continuously, monitoring their upstreams for security patch updates. When a patch is released, service container versions are updated by Platform.sh and applied to individual projects between deployments automatically. 

## Expose service

One more piece of configuration you will need to add is a `relationship`, which provides access to a service container (`db`) from an application container (`app`).
By default, containers on Platform.sh exist in isolation, and without a `relationship` defined service containers are inaccessible.

In `.platform.app.yaml`, add the following line:

```yaml
relationships:
   database: "db:mysql"
```

In the above there is a single relationship defined to the database container you just configured. 
It shows the service's name (`db`) and the **endpoint name**, which in this case is `mysql`. 
The last piece is naming the relationship: `database`. 

The name of the relationship is important, because it is through this name that the database service can be accessed within applications.

## Services at runtime

Commit and push these changes to the new environment:

```bash
$ git add .
$ git commit -m "Add a database."
$ git push platform add-db
```

As the activity completes, notice that the log now includes a new container in the **cluster** of containers that make up the environment:

```bash
Redeploying environment add-db
  Preparing deployment
  Closing services app and router
  Opening application app and its relationships
  Opening environment
  Environment configuration
    app (type: LANGUAGE:VERSION, size: S)
    db (type: mariadb:10.4, size: S, disk: 2048)
```

There will also be a new `db` icon shown in the **Apps & Services** graph in the bottom left-hand corner of the page.
When the push activity has completed on the **add-db** environment, SSH into the application container:

```bash
platform ssh -e add-db
```

With a relationship defined, Platform.sh provides connection credentials for the new database container within an environment variable called `PLATFORM_RELATIONSHIPS`.
In your SSH session, run:

```bash
echo $PLATFORM_RELATIONSHIPS | base64 --decode | jq
```

`PLATFORM_RELATIONSHIPS` is a base64-encoded JSON object.
Decoding that variable and piping through the JSON pre-installed tool (jq) gives the following:

```json
{
  "database": [
    {
      "username": "user",
      "scheme": "mysql",
      "service": "db",
      "fragment": null,
      "ip": "169.254.196.237",
      "hostname": "u2dapcb6prp3ezpqz6mtlp3hbu.db.service._.us-3.platformsh.site",
      "public": false,
      "cluster": "cbvgw7mkrf7bu-add-db-gagrtoi",
      "host": "database.internal",
      "rel": "mysql",
      "query": {
        "is_master": true
      },
      "path": "main",
      "password": "",
      "type": "mariadb:10.4",
      "port": 3306,
      "host_mapped": false
    }
  ]
}
```

You can quickly test these credentials with the following command, which will open a MySQL session within the app container:

```bash
mysql -h database.internal -P 3306 -u user main
```

You will see that the name of the relationship becomes the top-level key within the `PLATFORM_RELATIONSHIPS` object, but also the host address:

```bash
$ DB_HOST=$(echo $PLATFORM_RELATIONSHIPS | base64 --decode | jq '.database[0].host')
$ echo $DB_HOST
database.internal
```

Like above, you can use environment variables to dynamically retrieve credentials from `PLATFORM_RELATIONSHIPS` using jq and connect to the database:

```bash
$ DB_HOST=$(echo $PLATFORM_RELATIONSHIPS | base64 --decode | jq -r '.database[0].host')
$ DB_PORT=$(echo $PLATFORM_RELATIONSHIPS | base64 --decode | jq -r '.database[0].port')
$ DB_USER=$(echo $PLATFORM_RELATIONSHIPS | base64 --decode | jq -r '.database[0].username')
$ DB_PATH=$(echo $PLATFORM_RELATIONSHIPS | base64 --decode | jq -r '.database[0].path')
$ mysql -h $DB_HOST -P $DB_PORT -u $DB_USER $DB_PATH
```

Exit the session with `ctrl+d`.

You will notice in the `PLATFORM_RELATIONSHIPS` object for `database` that there is no `password` present.
Some services contain passwords by default, but not all of them do.

Like stated previously, all containers are build and provisioned in isolation. 
If you define an application but do not configure a route directing traffic to that application, nothing on the outside world can access it.
In the same way, a service can only be accessed when a relationship is defined - this and authenticated SSH are the only paths to interact with a service container.

For example, there isn't a way to define a route, to a database, only a relationship.
Services are only accessible within the internal network of containers that makes up an environment when relationships are defined. 

Everything stays isolated otherwise, making your environments and data secure by default.

## Next steps

Now that you have added a service, and can connect to that service via environment variables, the next step is to use this knowledge to interact with the managed database directly from within your application. 

{{< guide-buttons next="Use the service" >}}
