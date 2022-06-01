---
title: "Transfer data to and from a Dedicated cluster"
weight: 13
sidebarTitle: "Sync to Dedicated"
---

## Get the SSH username and host

The SSH username and host are used to access your project via SSH.
Retrieve them either [in the management console](https://docs.platform.sh/administration/web/configure-environment.html#actions)
or [via the CLI](https://docs.platform.sh/development/ssh.html#get-ssh-connection-details).

## Back up Staging and Production files

Platform.sh automatically creates backups of the Staging and Production environments of a Dedicated cluster every six hours.
These are only useful to fully restore an environment and are managed by the support team.
You might want to make a manual backup yourself.

First, for your environment getthe [SSH username and host](#get-the-ssh-username-and-host).
Then create a manual backup of all files on the Staging or Production environment using rsync:

```bash
rsync -avzP <SSH_USERNAME>@<host>:pub/static/ pub/static/
```

That command copies all files from the `pub/static` directory in the environment to the `pub/static` directory,
relative to your local directory where you're running that command.

## Back up the Staging and Production database

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

From which you need the following values:

- `username`
- `password` (not needed if empty)
- `path`: the database name (`<DATABASE_NAME>` in the example command below)

You also need the [SSH username and host](#get-the-ssh-username-and-host) for your environment.

Now, adapt and run the following command on your local computer:

```bash
ssh <SSH_USERNAME>@<HOST> 'mysqldump --single-transaction -u <USERNAME> -p <PASSWORD> -h <DATABASE_NAME> | gzip' > database.gz
```

Which gives something similar to the following:

{{< codetabs >}}

---
title=Without a database password
file=none
highlight=bash
---

ssh 1.ent-1ab23cd4efghi-prod-a1bb2cd@ssh.eu-3.platform.sh 'mysqldump --single-transaction -u user -h database.internal main | gzip' > database.gz

<--->

---
title=With a database password
file=none
highlight=bash
---

ssh 1.ent-1ab23cd4efghi-prod-a1bb2cd@ssh.eu-3.platform.sh 'mysqldump --single-transaction -u user -p password -h database.internal main | gzip' > database.gz

{{< /codetabs >}}

## Synchronize files from Development to Staging/Production

To transfer data into either the staging or production environments,
you can either download it from your Platform.sh development environment to your local system first
or transfer it directly between environments using SSH-based tools (such as scp and rsync).

First, set up [SSH forwarding](./ssh/ssh-keys.md#forwarding-keys-by-default) by default for Platform.sh domains.

Then get the [SSH username and host](#get-the-ssh-username-and-host) for your environment.

Finally, run `platform ssh` with the production branch checked out to connect to the default development environment.
You can transfer files with rsync:

```bash
rsync -avzP pub/static/ <SSH_USERNAME>@<host>:pub/static/
```

Replace `pub/static` with the path to your files on system, such as `web/sites/default/files/`.
Note that rsync is very picky about trailing `/` characters.
Consult the rsync documentation for more that can be done with that command.

## Synchronize a database from Development to Staging/Production

The database can be copied directly from the development environment to staging or production,
but doing so requires noting the appropriate credentials first on both systems.

You also need the [SSH username and host](#get-the-ssh-username-and-host) for your environment.

First, log in to the production environment over SSH:

```bash
ssh <SSH_USERNAME>@<HOST>
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

From which you need the following values:

- `username`
- `password` (not needed if empty)
- `path`: the database name (`<DATABASE_NAME>` in the example command below)

You also need the [SSH username and host](#get-the-ssh-username-and-host) for your environment.

Now, in a separate terminal log in to the development instance using `platform ssh`.
Run the same `echo` command as above to get the credentials for the database on the development instance.
Again, we're only interested in the username, password, host, and "path"/database name.

With the credentials from both databases,
we can construct a command that exports data from the development server
and write it directly to the Dedicated cluster's server.

```bash
mysqldump -u <DEV_USER> -p <DEV_PASSWORD> -h <DEV_HOST> <DEV_DATABASE_NAME> --single-transaction | ssh -C <SSH_USERNAME>@<HOST> 'mysql -u <PROD_USER> -p <PROD_PASSWORD> -h <PROD_HOST> <PROD_DATABASE_NAME>'
```

That dumps all data from the database as a stream of queries
that get run on the production database without ever having to create an intermediary file.
The `-C` on the SSH command tells SSH to compress the connection to save time.

{{< note theme="warning" >}}

Be aware that this is a destructive operation that overwrites data.
Backup first.

{{< /note >}}
