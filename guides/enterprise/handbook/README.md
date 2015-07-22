# Developer Handbook


## Migrating and deploying code to Platform Enterprise

Deploying your code to Platform Enterprise is as simple as adding a Git remote repository:

```
# list all current git servers for the repository
git remote -v

# add a new git remote, for example we will call them prod and staging:
git remote add prod git@git.ent.platform.sh:prod.git
git remote add staging git@git.ent.platform.sh:staging.git
```
[See Pro Git book on Working with Remotes](http://git-scm.com/book/en/v2/Git-Basics-Working-with-Remotes)

## Settings.php

See [example](https://docs.platform.sh/toolstacks/php/drupal/customizing-settings-php.html)

## Customizing PHP

A custom php.ini is not supported on PE, for example the memory limit can be changed on the fly in your code by using `ini_set('memory_limit','1024M');`.

## Migrating mysql

MySQL data can be migrated by using `drush sql-sync` or by making a database dump and importing it on PE (`drush sql-cli < database.sql`) after the first `git push` to the repository if your app is using Drupal.

Alternatively the username and password to access the database can be found as an [environment variable](https://docs.platform.sh/reference/environment-variables.html):

```
echo $PLATFORM_RELATIONSHIPS |base64 --decode
```

## Migrating data

PE can be accessed by SSH, the easiest way is to use rsync (`rsync -azP source destination`).

Example:
```
rsync -avzP public/sites/default/files/ <user>@<cluster>.dev.ent.platform.sh:public/sites/default/files/
```

Rsync, which stands for "remote sync", is a remote and local file synchronization tool. It uses an algorithm that minimizes the amount of data copied by only moving the portions of files that have changed.

You can also combine drush with rsync and create aliases for easier and faster file synchronization. 
[More info](http://www.drushcommands.com/)

Using SFTP clients is also an option.

## Solr on Platform Enterprise

Take this from the `relationships`, like redis.
If not mentioned otherwise, Solr will be accessible at `http://localhost:8983/solr/core-name`.

You can access solr admin by creating SSH tunnel:
```
ssh -L 8888:localhost:8983 <user>@<cluster-name>.ent.platform.sh
```
and after that solr admin will be available at `http://localhost:8888/solr/`

## Redis on PE (Drupal)

The Redis setup PE is similar to [Platform Standard setup](https://docs.platform.sh/toolstacks/php/drupal/redis/). 
After adding the redis module download Predis: http://github.com/nrk/predis/archive/v0.8.7.tar.gz and unpack it to the libraries folder (`sites/all/libraries/predis/`).

Add to `settings.php` (check path to the redis module):

```
// Enable redis on platform environments.
if (!empty($relationships['redis'])) {
  $conf['redis_client_host'] = $relationships['redis'][0]['host'];
  $conf['redis_client_port'] = $relationships['redis'][0]['port'];
  $conf['redis_client_interface'] = 'PhpRedis';
  $conf['cache_backends'][]       = 'sites/all/modules/redis/redis.autoload.inc';
  $conf['cache_default_class']    = 'Redis_Cache';
  // The 'cache_form' bin must be assigned to non-volatile storage.
  $conf['cache_class_cache_form'] = 'DrupalDatabaseCache';
}
```

## Cron on PE

For setting up a cron job, please create a ticket or contact support through your [Platform.sh interface](https://marketplace.commerceguys.com/platform/support).

**Note**
All servers in our infrastructure are set to UTC time. If you need to run the cron jobs according to different time zone, please calculate adjustment in the schedule before you send us the  list of cron jobs.

## Sending e-mail

PE comes bundled with [Amazon SES](http://aws.amazon.com/ses/).

To be able to use Amazon SES for sending emails you have to verify your domain by adding verification code to the DNS zone (TXT and CNAME - used for DKIM).

For enabling this feature and for the needed verification codes, please create a ticket or contact support through your [Platform.sh interface](https://marketplace.commerceguys.com/platform/support).

Please note that both “from” and “return path” must be set to the domain that was verified.

If Amazon SES is not an option for you, the following alternatives are available:
- You can modify the application to use an account from an alternative mail server to send email (for example in Drupal you can use the SMTP module)
- You can forward us a username and password for an email account on your mail server which we would setup as an upstream mail server. We will also need the hostname and port number.

These two solution would limit sending emails from only one address. This also depends on the upstream email server setup which, in this case would be outside our infrastructure.

## Build and deploy hooks

Currently the build and deploy hooks on PE are handled by creating a ticket.

## SSL certificate

If your project is using CloudFront and you need an SSL cert on the origin (production or staging environment), please create a ticket or contact support through your [Platform.sh interface](https://marketplace.commerceguys.com/platform/support).

## SSH agent setup (key forwarding)

If you want to be able to copy/sync files server to server (Platform Standard to Platform Enterprise environments) configure your local SSH agent to forward keys. In `~/.ssh/config` add

```
Host *.ent.platform.sh
    ForwardAgent yes
```

This will forward your private key to Platform Enterprise and enable you to use SSH to connect directly from PE to PS.
