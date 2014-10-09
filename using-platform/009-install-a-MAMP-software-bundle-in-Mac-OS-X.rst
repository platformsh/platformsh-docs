
install a MAMP software bundle in Mac OS X
==========================================

`Platform.sh <https://platform.sh>`_  is designed to work with your local development environment. Developers often run a 
`LAMP <http://en.wikipedia.org/wiki/LAMP_(software_bundle)>`_ 
software bundle on their personal workstations. LAMP servers have been powering sites on the Internet for decades. 

You can use this procedure to set up your local development environment. This procedure installs the LAMP software bundle on `Apple OS X <https://www.apple.com/uk/osx/>`_ - it’s MAMP, not LAMP. 

Many free developer tools are available for Mac's OS X, but few are bundled with the OS. Assembling your MAMP software bundle takes sysadmin skills. As with all UNIX-like systems, system administration work on OS X makes heavy use of the CLI (Command Line Interface) and the system administrator account root. All the commands you need to type are displayed here in bold text. The command prompts and responses displayed by the system are included. 

After installing the MAMP software bundle and the Platform.sh software bundle, you can download one of your environments using the *platform get* command. 


check your OS X version
-----------------------

First, check your OS X version (Apple menu > About this Mac). 

I used this procedure on OS X Mavericks v10.9.5, which was bang up to date in October 2014. The older a howto article gets, the less accurate it becomes. Always check the dates on Internet Howtos and be prepared for some troubleshooting if it is years old. 


create a placeholder project folder
-----------------------------------

The *platform get* command puts a project’s web server resources into the folder *(project ID)/www*. I have not installed the platform tool yet, so I must create a placeholder folder by hand. That’s fine for testing my new Apache configuration. Later, when it is time to run platform get, I will replace this folder with the real thing. 

Apache needs to know what this new virtual server’s name is and where to find the code. You tell Apache by adding *ServerName* and *DocumentRoot* directives to one of its configuration files, named *httpd-vhosts.conf*. 
* Servername: *(project name)*
* DocumentRoot: *(home folder)/(project ID)/www*


find your project ID
--------------------

If you have not yet signed up for a Platform.sh project, that’s fine - use a temporary label for now, like myProjectID. You can change it later. 

If you do have a Platform.sh project, find the ID using the web UI. 
My project ID is *wmd3wn3iorp5c*. I can see that ID in a few places.

* the URL - *https://eu.platform.sh/projects/wmd3wn3iorp5c/environments/master*
* the git clone command - *git clone --branch master wmd3wn3iorp5c@git.eu.platform.sh:wmd3wn3iorp5c.git*
* the access information - *ssh wmd3wn3iorp5c-master@ssh.eu.platform.sh*


create a project folder
^^^^^^^^^^^^^^^^^^^^^^^

Decide where you are going to put your project’s folder, and what you want to call your virtual host. This is what I did. 

* I started a Platform.sh project called *myProject*. 
* My project ID is *wmd3wn3iorp5c*.
* I am going to work out of my home folder */Users/larg*. 
* The *platform get* command will put my site into the path *wmd3wn3iorp5c/www*. 

These are the values I need for my virtual server. 
Putting all that together, I end up with these values.

* Servername: **myproject**
* DocumentRoot: **/Users/larg/wmd3wn3iorp5c/www**

Create a placeholder directory. ::

 cd ~
 mkdir -p wmd3wn3iorp5c/www

Create a test file. This is used for PHP and Apache testing later. ::

 touch wmd3wn3iorp5c/www/hello.php
 echo "<html>
 <head>
   <title>PHP Test</title>
 </head>
 <body>
   <?php echo '<p>Hello World</p>'; ?> 
 </body>
 </html>" > wmd3wn3iorp5c/www/hello.php


install command-line developer tools
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Open a CLI. Applications > Utilities > Terminal

.. image:: /using-platform/images/cli-1.png

Use the command *xcode-select*. XCode is Apple’s IDE. Despite the command's name, you don't need to install the IDE. This command installs developer tools including *make*, *gcc* and *git*. ::

 xcode-select --install

A dialog window pops up. 
Choose *Install* (not *Get Xcode*). 
Agree to the license. Software downloads and installs.


install Homebrew
^^^^^^^^^^^^^^^^

`Homebrew <http://brew.sh/>`_ is a package manager for Mac OS X. It is written in ruby.

Check the ruby interpreter. ::

 ruby -v

Download and install Homebrew. ::

 ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"

Check Homebrew.  ::

 brew doctor

Update the library of Homebrew packages. You only need to run this occasionally. ::

 brew update



install MariaDB
---------------

`MariaDB <https://mariadb.com/>`_ is a drop-in replacement for `MySQL <http://www.mysql.com/>`_.
Check out MariaDB’s own install instructions for more details - 
`Building MariaDB on Mac OS X using Homebrew <https://mariadb.com/kb/en/mariadb/documentation/getting-started/compiling-mariadb-from-source/building-mariadb-on-mac-os-x-using-homebrew/>`_. 

install MariaDB using brew
^^^^^^^^^^^^^^^^^^^^^^^^^^

Check the version of MariaDB that will be installed by Homebrew. ::

 brew info mariadb

The *brew info* command prints something like this. ::

 mariadb: stable 10.0.13 (bottled)
 http://mariadb.org/
 Conflicts with: mysql, mysql-cluster, mysql-connector-c, percona-server
 Not installed

Install MariaDB. ::

 brew install mariadb

Create system tables. ::

 mysql_install_db

run MariaDB in the foreground
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Start the MariaDB service in the foreground, to make sure it works. In UNIX, *foreground* and *background* are methods of `job control <http://acms.ucsd.edu/info/jobctrl.html>`_. Running MariaDB in the foreground displays its activity log for you to read and check that all is OK. 

If you don’t want to see these console messages, run *mysql.server start* to run MariaDB in the background. ::

 cd /usr/local/Cellar/mariadb/10.0.13/
 bin/mysqld_safe --datadir=/usr/local/var/mysql &

Check it is running. 
If you use the same CLI window that you used to start MariaDB, press the carriage return key to get a command prompt. 
Lots of mysterious text is a good thing. ::

 ps -ef | grep mysql

secure your install
^^^^^^^^^^^^^^^^^^^

Generate a MariaDB root password and store it in your password manager. 

Run the secure script. This is a securiy hardening script  - it sets a password, removes the test database, removes remote root login to MariaDB, and so on. ::

 mysql_secure_installation

Type in your new root password and accept the defaults for each question. 

Stop the database (you can also run mysql.server stop). ::

 sudo kill `cat /usr/local/var/mysql/localhost.pid`

Check MariaDB has stopped by running the ``ps -ef | grep mysql`` command again. 

start the database service automatically
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Set MariaDB to run when you log into your workstation. Starting the database service manually every time you want to use it gets old fast. 
Your installation includes a preferences file called *homebrew.mxcl.mariadb.plist* which will work with the OS X 
`preferences system <https://developer.apple.com/library/mac/documentation/MacOSX/Conceptual/BPRuntimeConfig/Articles/UserPreferences.html>`_. 

Link the MariaDB preferences file to your own collection of preferences files. ::

 ln -sfv /usr/local/opt/mariadb/*.plist ~/Library/LaunchAgents

Start the database service.  ::

 launchctl load ~/Library/LaunchAgents/homebrew.mxcl.mariadb.plist

Log out and back in again, then check MariaDB is running. 


create a new user and database
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

You can prove MariaDB is working OK by creating a new user and empty database. These are  suitable for local development work - you can use these details later when building your local site. 

Choose an account and database name. 
* user: myuser
* password: mypassword
* database: mydatabase.
Add this account to your password manager. 

Use the MariaDB client. ::

 mysql -u root -p

Create a new database. Run this SQL command. ::

 create database mydb;

Create a new user. Give this account control over the new database. ::

 GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, DROP, INDEX, ALTER, CREATE TEMPORARY TABLES, LOCK TABLES ON mydb.* TO 'myuser'@'localhost' IDENTIFIED BY 'mypassword';

Stop using the MariaDB client. 

 quit

Check your work. Test your new account’s access. ::

 mysql -u myuser -p mydb


configure PHP
-------------

`PHP <http://php.net/>`_ is already installed in `OS X <https://www.apple.com/uk/osx/>`_ . A few changes make PHP bug hunting easier. 

Check PHP. ::

 php -v

Copy the default configuration file. ::

 sudo cp /etc/php.ini.default /etc/php.ini 

Edit the php.ini file. ::

 sudo vim /etc/php.ini

Display errors. Find this line.  ::

 display_errors = Off

Change it. ::

 display_errors = On

Display more errors. Find this line. ::

 error_reporting = E_ALL & ~E_DEPRECATED & ~E_STRICT

Change it. ::

 error_reporting = E_ALL | E_STRICT

Save your work. 

Help PHP talk to the new `MariaDB <https://mariadb.com/>`_ install. Point PHP at MariaDB’s socket. ::

 mkdir /var/mysql
 ln -s /tmp/mysql.sock /var/mysql/mysql.sock

Check your work. Feed your test file to PHP. ::

 php wmd3wn3iorp5c/www/hello.php 

The PHP code is replaced. ::

 <html>
  <head>
   <title>PHP Test</title>
  </head>
  <body>
  <p>Hello World</p> 
  </body>
 </html>

This proves PHP is working. 


configure Apache
----------------

Apache configuration work is done with a CLI. Testing is done with a web UI. 


edit Apache’s main configuration file
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Some settings need to be enabled, such as the PHP integration. None of these changes are used until Apache restarts.

Use a CLI. 

Check Apache is running. ::
 sudo apachectl start

Back up the Apache configuration file. ::

 sudo cp /etc/apache2/httpd.conf ~

Edit the Apache configuration file. ::

 sudo vim /etc/apache2/httpd.conf

Enable PHP. Find this line. ::

 #LoadModule php5_module libexec/apache2/libphp5.so

Remove the comment. ::

 LoadModule php5_module libexec/apache2/libphp5.so

Make testing easier. Allow everything, but only from your workstation. Find these lines. ::

 <Directory />
    Options FollowSymLinks
    AllowOverride None
    Order deny,allow
    Deny from all
 </Directory>

Change them. ::

 <Directory />
    Options All
    AllowOverride All
    Order deny,allow
    Deny from all
    Allow from 127.0.0.1
 </Directory>

Enable virtual hosts. Find this line. ::

 #Include /private/etc/apache2/extra/httpd-vhosts.conf

Remove the comment. ::

 Include /private/etc/apache2/extra/httpd-vhosts.conf

Set a few other values, including keepalive, server signature and host name lookup. Find this line. ::

 #Include /private/etc/apache2/extra/httpd-default.conf

Uncomment it. ::

 Include /private/etc/apache2/extra/httpd-default.conf

Save your work. ::

 :wq


add an Apache virtual server
^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Backup up Apache’s virtual host configuration file. ::

 sudo cp /private/etc/apache2/extra/httpd-vhosts.conf ~

Edit the file. ::

 sudo vim /private/etc/apache2/extra/httpd-vhosts.conf 

Add these lines to the end. ::

 # my local Platform.sh environment 
 <VirtualHost *:80>
    ServerName myproject
    DocumentRoot "/Users/larg/wmd3wn3iorp5c/www"
 </VirtualHost>

Save your work. 


add your virtual server name to the hosts file
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Your web browser takes the server name (your project name) and looks up its address.
The browser finds this address in the *hosts* file. 

Back up the hosts file. ::

 sudo cp /etc/hosts ~

Edit the hosts file. ::

 sudo vim /etc/hosts

Add the name of your virtual server to the bottom of the file. ::

 127.0.0.1 myproject

Save your work. 


check your work
^^^^^^^^^^^^^^^

Restart Apache. ::

 sudo apachectl restart

Check the Apache activity log. ::

 tail /var/log/apache2/error_log 

Normal shutdown and startup messages look like these. ::

 [Wed Oct 08 15:01:59 2014] [notice] caught SIGTERM, shutting down
 [Wed Oct 08 15:01:59 2014] [warn] Init: Session Cache is not configured [hint: SSLSessionCache]
 Warning: DocumentRoot [/usr/docs/dummy-host2.example.com] does not exist
 [Wed Oct 08 15:01:59 2014] [notice] Digest: generating secret for digest authentication ...
 [Wed Oct 08 15:01:59 2014] [notice] Digest: done
 [Wed Oct 08 15:01:59 2014] [notice] Apache/2.2.26 (Unix) DAV/2 PHP/5.4.30 mod_ssl/2.2.26 OpenSSL/0.9.8za configured -- resuming normal operations

Open a web browser. 

View the test file. http://myproject/hello.php 

.. image:: /using-platform/images/apache-2.png

This web page proves Apache and PHP are working. 


Your MAMP software bundle is ready. Next, install the Platform.sh software bundle on OS X.
