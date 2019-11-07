# Transferring data to and from the cluster

## Backing up staging and production files

Platform.sh automatically creates a backup snapshot of the staging and production instances every six hours.  However, those are only useful for a full restore of the environment and can only be done by the Platform.sh team.  At times you'll want to make a manual backup yourself.

To create a manual ad-hoc backup of all files on the staging or production environment, simply use the standard `rsync` command.

```bash
rsync -avzP <USERNAME>@<CLUSTER_NAME>.ent.platform.sh:pub/static/ pub/static/ 
```

That will copy all files from the `pub/static` directory on the production instance to the `pub/static` directory, relative to your local directory where you're running that command.

## Backing up the staging and production database

To backup your database to your local system you'll need to get the database credentials to use.

First, login to the cluster and run the following command:

```bash
echo $PLATFORM_RELATIONSHIPS | base64 --decode | json_pp
```

Which should give a JSON output containing something like this:

```json
"database" : [
      {
         "path" : "main",
         "service" : "mysqldb",
         "rel" : "mysql",
         "host" : "database.internal",
         "ip" : "246.0.80.64",
         "scheme" : "mysql",
         "cluster" : "jyu7wavyy6n6q-master-7rqtwti",
         "username" : "user",
         "password" : "",
         "query" : {
            "is_master" : true
         },
         "port" : 3306
   }
]
```

The part you want is the user, password, and "path", which means the DB name.  Ignore the rest.

Now, run the following command on your local computer:

```
ssh <USERNAME>@<CLUSTER_NAME>.ent.platform.sh 'mysqldump --single-transaction -u <user> -p<pass> -h localhost <dbname> | gzip' > database.gz
```

That will run a mysqldump command on the server, compress it using gzip, and stream the output to a file named `database.gz` on your local computer.

(If you'd prefer, `bzip2` and `xz` are also available.)

## Synchronizing files from dev to staging/production

To transfer data into either the staging or production environments, you can either download it from your Platform.sh Development environment to your local system first or transfer it directly between environments using SSH based tools (e.g. SCP, Rsync).

First, set up [SSH forwarding](/support/ssh-agent.md#forwarding-keys-by-default) by default for Platform.sh domains.

Then run `platform ssh` with the `master` branch checked out to connect to the master dev environment.  Files are the easier data to transfer, and can be done with `rsync`.

```bash
rsync -avzP pub/static/ <USERNAME>@<CLUSTER_NAME>.ent.platform.sh:pub/static/
```

Replace `pub/static` with the path to your files on system, such as `web/sites/default/files/`.  Note that rsync is very picky about trailing `/` characters.  Consult the rsync documentation for more that can be done with that command.

## Synchronizing the database from development to staging/production

The database can be copied directly from the development environment to staging or production, but doing so requires noting the appropriate credentials first on both systems.

First, login to the production environment over SSH:

```bash
ssh <USERNAME>@<CLUSTER_NAME>.ent.platform.sh
```

Once there, you can look up database credentials by running:

```bash
echo $PLATFORM_RELATIONSHIPS | base64 --decode | json_pp
```

Which should give a JSON output containing something like this:

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

The part we want is the host, user, password, and the "path", which is the database name.  Ignore the rest.

Now, in a separate terminal login to the development instance using `platform ssh`.  Run the same `echo` command as above to get the credentials for the database on the development instance.  (The JSON will be slightly different but again we're only interested in the user, password, host, and "path"/database name).

With the credentials from both databases we can construct a command that will export data from the dev server and write it directly to the enterprise cluster's server.

```bash
mysqldump -u <dev_user> -p<dev_password> -h <dev_host> <dev_dbname> --single-transaction | ssh -C <USERNAME>@<CLUSTER_NAME>.ent.platform.sh 'mysql -u <prod_user> -p<prod_password> -h <prod_host> <prod_dbname>'
```

That will dump all data from the database as a stream of queries that will get run on the production database without ever having to create an intermediary file.  The `-C` on the SSH command tells SSH to compress the connection to save time.

(Be aware, this is a destructive operation that overwrites data.  Backup first.)
