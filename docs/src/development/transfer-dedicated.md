---
title: "Transferring data to and from a Dedicated cluster"
weight: 13
sidebarTitle: "Syncing to Dedicated"
---

## Backing up staging and production files

Platform.sh automatically creates a backup of the staging and production instances on a Dedicated cluster every six hours.
However, those are only useful for a full restore of the environment and can only be done by the Platform.sh team.
At times, you'll want to make a manual backup yourself.

To create a manual ad-hoc backup of all files on the staging or production environment, use the standard `rsync` command.

```bash
rsync -avzP <USERNAME>@<CLUSTER_NAME>.ent.platform.sh:pub/static/ pub/static/
```

That will copy all files from the `pub/static` directory on the production instance to the `pub/static` directory,
relative to your local directory where you're running that command.

## Backing up the staging and production database

To backup your database to your local system, you need to get the database credentials to use.

First, login to the cluster and run the following command:

```bash
echo $PLATFORM_RELATIONSHIPS | base64 --decode | json_pp
```

Which gives a JSON output similar to:

```json
"database" : [
      {
         "path" : "main",
         "service" : "mysqldb",
         "rel" : "mysql",
         "host" : "database.internal",
         "ip" : "246.0.80.64",
         "scheme" : "mysql",
         "cluster" : "jyu7wavyy6n6q-main-7rqtwti",
         "username" : "user",
         "password" : "",
         "query" : {
            "is_master" : true
         },
         "port" : 3306
   }
]
```

You need the following values:
- `username`.
- `password`. If empty, remove the flag.
- "path", which is the name of the database (`main` in the example above).

Now, adapt and run the following command on your local computer:

```bash
ssh <USERNAME>@<CLUSTER_NAME>.ent.platform.sh 'mysqldump --single-transaction -u <USERNAME> -p<PASSWORD> -h database.internal <DBNAME> | gzip' > database.gz
```

That runs a `mysqldump` command on the server, compresses it using `gzip`,
and streams the output to a file named `database.gz` on your local computer.

(If you'd prefer, `bzip2` and `xz` are also available.)

Example with an empty database password:
```bash
ssh <USERNAME>@<CLUSTER_NAME>.ent.platform.sh 'mysqldump --single-transaction -u user -h database.internal main | gzip' > database.gz
```


## Synchronizing files from development to staging/production

To transfer data into either the staging or production environments,
you can either download it from your Platform.sh development environment to your local system first
or transfer it directly between environments using SSH-based tools (such as SCP, rsync).

First, set up [SSH forwarding](./ssh/ssh-keys.md#forwarding-keys-by-default) by default for Platform.sh domains.

Then run `platform ssh` with the production branch checked out to connect to the default development environment.
Files are the easier data to transfer, and can be done with `rsync`.

```bash
rsync -avzP pub/static/ <USERNAME>@<CLUSTER_NAME>.ent.platform.sh:pub/static/
```

Replace `pub/static` with the path to your files on system, such as `web/sites/default/files/`.
Note that rsync is very picky about trailing `/` characters.
Consult the rsync documentation for more that can be done with that command.

## Synchronizing the database from development to staging/production

The database can be copied directly from the development environment to staging or production,
but doing so requires noting the appropriate credentials first on both systems.

First, log in to the production environment over SSH:

```bash
ssh <USERNAME>@<CLUSTER_NAME>.ent.platform.sh
```

Once there, you can look up database credentials by running:

```bash
echo $PLATFORM_RELATIONSHIPS | base64 --decode | json_pp
```

Which gives a JSON output similar to:

```json
{
   "database" : [
      {
         "password" : "abc123",
         "username" : "projectname",
         "path" : "projectname",
         "port" : "3306",
         "scheme" : "mysql",
         "host" : "127.0.0.1",
         "query" : {
            "is_master" : true,
            "compression" : true
         }
      }
   ]
}
```

You need the following values:
- `username`.
- `password`. If empty, remove the flag.
- "path", which is the name of the database (`<DBNAME>`).

Now, in a separate terminal log in to the development instance using `platform ssh`.
Run the same `echo` command as above to get the credentials for the database on the development instance.
(The JSON will be slightly different but again we're only interested in the username, password, host, and "path"/database name).

With the credentials from both databases,
we can construct a command that will export data from the development server
and write it directly to the Dedicated cluster's server.

```bash
mysqldump -u <DEV_USER> -p<DEV_PASSWORD> -h <DEV_HOST> <DEV_DBNAME> --single-transaction | ssh -C <USERNAME>@<CLUSTER_NAME>.ent.platform.sh 'mysql -u <PROD_USER> -p<PROD_PASSWORD> -h <PROD_HOST> <PROD_DBNAME>'
```

That dumps all data from the database as a stream of queries
that get run on the production database without ever having to create an intermediary file.
The `-C` on the SSH command tells SSH to compress the connection to save time.

{{< note theme="warning" >}}

Be aware that this is a destructive operation that overwrites data.
Backup first.

{{< /note >}}
