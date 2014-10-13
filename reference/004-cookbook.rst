
Cookbook
========

Add a Platform.sh user 
----------------------


https://docs.platform.sh/using-platform/005-user-administration.html
There are two configuration icons on the Platform UI - one for the project and one for the environment. The project configuration icon is next to the project name, in the upper left corner of the project page.

Hover over the project configuration icon. The description appears. 
Click the icon. The access control page appears. 
Click the Add user button. A form appears. 
Fill in the fields. 
Save your work. An invitation is sent to the new user. 




Cancel your Platform.sh account
-------------------------------



Upgrade your Platform.sh account
--------------------------------


Increase your Platform.sh disk space
------------------------------------


Troubleshoot a 400 error 
------------------------


Tell the Platform.sh helpdesk about your problem
------------------------------------------------


branch an environment using the platform CLI
--------------------------------------------

The platform environment:branch branchname command will create a new environment branched from your currently-checked-out Platform environment. It is equivalent to doing git checkout -b branchname. 

Once you have run the environment:branch command, you can commit and push code to that branch on Platform.sh and an environment separate from your master environment will be built based on that code.


Delete an environment (or branch) in Platform.sh 
------------------------------------------------

- deactivate the environment, eg `staging`
- go into your git repository and issue: 'git push origin :staging'
#796
This is the process for deleting a child environment.

The CLI way: 

- Use commands like this. 
platform environment:deactivate --project=4tig4vb5dj123 --environment=myenv
platform environment:delete --project=4tig4vb5dj123 --environment=myenv


The Web UI way: 

Delete environment code
- Select the environment
- deactivate the environment (Configure > Deactivate this environment)
These steps remove the various components (app, database and so on) but does not touch the environment configuration. This config is used to rebuild the child environment based on its parent. 

If you will not rebuild this child environment again, you can delete this configuration.

Delete environment configuration
- go into your git repository 
- Push an empty ref to the child environment you wish to delete. Command is git push origin :(environment) eg. 'git push origin :staging'


reset the master environment
----------------------------

 You can do this easily by going to your Platform.sh repository and executing this:

# git remote add platform-d7 git@github.com:platformsh/platform-drupal.git
# git fetch --all
# git push -f origin platform-d7/master:refs/heads/master
# git reset --hard origin/master

This will destroy your git history.

You can use platform drush to clean the database.


install from your local repository to the master environment
------------------------------------------------------------

Open a CLI.
go to your Git project folder.
Add your Platform.sh project as a remote.
git remote add YourRemoteName YourProjectID@git.eu.platform.sh:YourProjectID.git
Force push your code. 
git push -f YourRemoteName YourBranch
git reset --hard YourRemoteName/master


install from a remote repository to the master environment
----------------------------------------------------------

Reset the master enviroment by replacing the current code with the contents of a git repo. 

This example uses the Platform.sh Drupal 7 minimal repository on Github.

go to your Platform.sh repository 
execute this
git remote add platform-d7 git@github.com:platformsh/platform-drupal.git
git fetch --all
git push -f origin platform-d7/master:refs/heads/master
git reset --hard origin/master

This will destroy your git history.

You can use platform drush to clean the database.



Set up environment variables in Platform.sh 
-------------------------------------------





Use Google Chrome web browser to find an API command
----------------------------------------------------

Open chrome.
Open the developer tools pane. View > Developer > Developer tools 
Record application commands. Network > Preserve log

curl 'https://eu.platform.sh/api/projects/123fqz6qoo123/environments/master/branch' 
-H 'Authorization: Bearer c9ac3232ff632109a1256bca570089fc5d42d02b' 
-H 'Origin: https://eu.platform.sh' 
-H 'Accept-Encoding: gzip,deflate' 
-H 'Accept-Language: en-US,en;q=0.8' 
-H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/37.0.2062.94 Safari/537.36' 
-H 'Content-Type: application/json;charset=UTF-8' 
-H 'Accept: application/json, text/plain, */*' 
-H 'Referer: https://eu.platform.sh/projects/123fqz6qoo123/environments/master' 
-H 'Cookie: __mauuid=a8e72ace-b946-4d99-a96d-8517f054b0f9; _ga=GA1.2.636361333.1410253391' 
-H 'Connection: keep-alive' --data-binary '{"name":"anothertest","title":"anothertest"}' --compressed



Create a space for files that is not served to the public
---------------------------------------------------------

You have files in Platform.sh that you want to keep private. 
All customers have a folder called /app/private. If you are using Drupal you can see by going to "Administration » Configuration » Media" that we set it automatically (unless you provide your own $conf['file_private_path'] in settings.php).

Create a space for files that is not web mounted

You have files in git but you don't want them to be web mountable. 

Take a look at document_root setting in the documentation. For example, let say your git repository looks like this.
.
├── drupal_root
└── important_files

What you need to do is to add and commit a file named .platform.app.yaml in the root of your repository containing something like this:

(!!! THIS FORMAT MAY BE OUT OF DATE)

# The toolstack used to build the application.
toolstack: "php:drupal"

# The configuration of HTTP access to the app.
web:
    # The public directory of the app, relative to its root.
    document_root: "/drupal_root"
    # The front-controller script to send non-static requests to.
    passthru: "/index.php"

# The mounts that will be performed when the package is deployed.
mounts:
    "/public/sites/default/files": "shared:files/files"
    "/tmp": "shared:files/tmp"
    "/private": "shared:files/private"

# Scheduled execution.
crons:
    drupal:
        spec: "*/20 * * * *"
        cmd: "cd public ; drush core-cron"


schedule scripts in a crontab
-----------------------------

See https://github.com/platformsh/platform-drupal/blob/master/.platform.app.yaml#L41 

# The configuration of scheduled execution.
crons:
    drupal:
        spec: "*/20 * * * *"
        cmd: "cd public ; drush core-cron"



edit the .platform.app.yaml configuration file
----------------------------------------------

https://github.com/platformsh/platform-drupal/blob/master/.platform.app.yaml




upload an SSL certificate
-------------------------

AKA x.509 certificate, server certificate

SSL certs can now be uploaded with the latest version of the Platform CLI client (https://github.com/platformsh/platformsh-cli). They are added as part of the domain:add command, as shown here:

platform domain:add example.com --cert="/etc/ssl/certs/example.crt" --key="/etc/ssl/private/example.key" --chain="/etc/ssl/certs/gd_intermediate.crt"

The paths shown are the local shell paths to your certificate+key+chain files. This command will upload the cert and companion files as part of adding the domain to your platform project. Any of your routes which point to https://example.com would then serve that certificate rather than the *.us.platform.sh wildcard.


Add dedicated IP addresses to Enterprise
----------------------------------------

Modify your enterprise hosting plan to include dedicated IP addresses. The cost starts at 600 Euros a month.


Set up domain routing in Platform.sh 
------------------------------------


Add many working FQDNs for one site
-----------------------------------

change on our routes.yaml file (and drupal config or some other stuff?) so that both 
master-1235zxhj2u123.eu.platform.sh and newsite.com are valid working 
routes.

If you want the default URL to also serve your site, add another upstream to your routes.yaml file (you can also do that directly via the Platform UI).

http://master-1235zxhj2u123.eu.platform.sh/:
  cache:
    enabled: null
  created_at: 2014-08-29 16:16:49.760281
  rewrite:
    type: null
  ssi:
    enabled: null
  type: upstream
  updated_at: 2014-08-29 16:16:49.760419
  upstream: php:php
http://www.{default}/:
  to: https://www.{default}/
  type: redirect
http://{default}/:
  to: https://www.{default}/
  type: redirect
https://{default}/:
  cache:
    enabled: true
  rewrite:
    type: drupal
  ssi:
    enabled: true
  type: upstream
  upstream: php:php


enable test environment mail 
----------------------------

Test environment mails can be enabled. By default, non-master environments of Platform.sh are not allowed to send emails. This is done to avoid accidentally sending our emails to actual consumers, when handling databases that are not properly sanitized.

However, you can change the setting through our API. In future we will expose this option in the UI, and add it to the CLI tool.

To enable mail sending from a test environment, you have to be comfortable with running a command like this. 
curl -H "Authorization: Bearer <your token>" -H "Content-Type: application/json" https://eu.platform.sh/api/projects/<your project ID>/environments/<your environment> -X PATCH -d '{"enable_smtp": true}'

You must customize those bits between the <angle brackets>.
You must also be able to find your access token, then replace that text "<your token>" with yours. The Platform.sh UI uses the access token a lot - if you know how to view a developer console, look for commands like this. 
https://eu.platform.sh/api/projects/adffqz6qoo123/subscribe?access_token=12316f38f0fd5f231da0f5ceca19c5f57a735123 
That really long string is my access token.


find your outgoing IP address
-----------------------------

find out your outgoing IP address 
SSH in into your environment 
curl ifconfig.me/ip

$ platform ssh --project 123fqz6qoo123 --environment mybranch

   ___ _      _    __ 
  | _ \ |__ _| |_ / _|___ _ _ _ __ 
  |  _/ / _` |  _|  _/ _ \ '_| '  \
  |_| |_\__,_|\__|_| \___/_| |_|_|_|

 Welcome to Platform.

 This is environment mybranch
 of project 123fqz6qoo123.

web@123fqz6qoo123-mybranch--php:~$ curl ifconfig.me/ip
54.76.137.67
web@wk5fqz6qoot4u-mybranch--php:~$ exit
logout
Connection to ssh.eu.platform.sh closed.
$ host 54.76.137.67
67.137.76.54.in-addr.arpa domain name pointer ec2-54-76-137-67.eu-west-1.compute.amazonaws.com.
$ 




troubleshoot ‘Permissions denied’ problems 
------------------------------------------

Permissions denied problems can happen for two reasons
* environment is inactive 
* ssh private key is not added into the ssh-agent

check using ssh-add -l

Can you check that your key is properly added to your SSH agent by running: ssh-add -l.

If not, then make sure you add it by running: ssh-add path-to-your-key

If it is however, can you paste the response to this command: ssh -v 123ag5hrzzl44-master@ssh.eu.platform.sh


check using ssh -v 

check using git push 
 





Use a make file that contains custom features that host on another git server
-----------------------------------------------------------------------------
How can I update these easily and have the changes be reflected in platform? 

Target a specific commit ID. Each time you update and push your features to Github, you can update the commit ID to pull the latest changes.



rebuild a container
-------------------
Rebuilding a Platform env can't be achieved except through pushing a commit; I frequently use something like a CHANGELOG.txt file that I can echo a line into for something to commit if I need a rebuild.


use extra drush flags
---------------------

eg. make use of the --working-copy drush make flag when running platform build? 

The platform build command should pass through the --working-copy option to Drush as of this writing (the 1.1.0 release supported this feature.)

Is there a way to set the default permissions of the files directory to make them group writeable locally. I changed the group of the builds directory to php-fpm's group with the intention of allowing it to make writes, but sites/default/files is not set to 775 after a build.

The files directory is locally created by symlinking your project folder's shared/files/ directory into builds/[buildDir]/sites/default/, which means it should absorb the permissions of the shared/files/ folder. 


speed up pushing hundreds of drupal modules
-------------------------------------------

Pushing hundreds of modules to update one remote feature is slow.

Unfortunately, because we don't support git submodules yet, your use case of working on a project that contains other remotely-version-controlled plugins is not very well supported for local development. The Platform team has started some preliminary work on supporting .gitmodules but we don't have any sort of ETA yet.



