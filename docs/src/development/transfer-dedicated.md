---
title: "Transfer data to and from a Dedicated cluster"
weight: 13
sidebarTitle: "Sync to Dedicated"
---

Transferring data to and from a Dedicated cluster slightly differs from the grid and requires SSH access.
For SSH access, you need to get the SSH username and host of your dedicated cluster.

## Get the SSH username and host

The SSH username and host are used to access your project via SSH.
Retrieve them [via the CLI](../development/ssh/_index.md#get-ssh-connection-details).

## Back up Staging and Production files

Platform.sh automatically creates backups of the Staging and Production environments of a Dedicated cluster every six hours.
These are only useful to fully restore an environment and are managed by the support team.

You can make a manual backup yourself:

1. For your environment, get the [SSH username and host](#get-the-ssh-username-and-host).
1. Create a manual backup of all files on the Staging or Production environment using rsync:

   ```bash
   rsync -avzP <SSH_USERNAME>@<SSH_HOST>:pub/static/ pub/static/
   ```

   That command copies all files from the `pub/static` directory in the environment to the `pub/static` directory,
   relative to your local directory where you're running that command.

## Back up the Staging and Production database

To backup your database to your local system, you need to get the database credentials to use.

First, [login to the cluster through SSH](#get-the-ssh-username-and-host) and run the following command:

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

Then, for the environment you want to access, you need to get the [SSH username and host](#get-the-ssh-username-and-host).

Now, adapt and run the following command on your local computer:

```bash
ssh <SSH_USERNAME>@<SSH_HOST> 'mysqldump --single-transaction -u <USERNAME> -p <PASSWORD> -h <DATABASE_NAME> | gzip' > database.gz
```

The adapted version of the command could look similar to:

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
you can either:

- Transfer data directly between environments using SSH-based tools (such as scp and rsync).
- Download data from your development environment to your local system and from there to your production environment.

To transfer data directly between environments:

1. Set up [SSH forwarding as default for your domains](./ssh/ssh-keys.md#forwarding-keys-by-default).

2. For the environment you want to access, get the [SSH username and host](#get-the-ssh-username-and-host).

3. Run `platform ssh` with the production branch checked out to connect to the default development environment.

4. Transfer files with rsync:

   ```bash
   rsync -avzP pub/static/ <SSH_USERNAME>@<SSH_HOST>:pub/static/
   ```

   Replace `pub/static` with the path to your files on system, such as `web/sites/default/files/`.
   Note that rsync is very picky about trailing `/` characters.
   Consult the rsync documentation for more.

## Synchronize a database from Development to Staging/Production

The database can be copied directly from the development environment to staging or production,
but doing so requires noting the appropriate credentials first on both systems.

For the environment you want to access, you need to get the [SSH username and host](#get-the-ssh-username-and-host).

First, log in to the production environment over SSH:

```bash
ssh <SSH_USERNAME>@<SSH_HOST>
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

Then, for the environment you want to access, you need to get the [SSH username and host](#get-the-ssh-username-and-host).

Now, in a separate terminal log in to the development instance using `platform ssh`.
Run the same `echo` command as above to get the credentials for the database on the development instance.
Again, we're only interested in the username, password, host, and "path"/database name.

With the credentials from both databases,
we can construct a command that exports data from the development server
and write it directly to the Dedicated cluster's production server.

```bash
mysqldump -u <DEV_USER> -p <DEV_PASSWORD> -h <DEV_HOST> <DEV_DATABASE_NAME> --single-transaction | ssh -C <SSH_USERNAME>@<SSH_HOST> 'mysql -u <PROD_USER> -p <PROD_PASSWORD> -h <PROD_HOST> <PROD_DATABASE_NAME>'
```

That dumps all data from the database as a stream of queries
that get run on the production database without ever having to create an intermediary file.
The `-C` on the SSH command tells SSH to compress the connection to save time.

{{< note theme="warning" >}}

Be aware that this is a destructive operation that overwrites data.
Backup first.

{{< /note >}}
