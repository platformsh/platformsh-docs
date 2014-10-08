
install a MAMP software bundle in Mac OS X
==========================================

`Platform.sh <https://platform.sh>`_  works with the development environment on your workstation. If you are starting from scratch with Os X, follow these instructions to set up a development environment. It's a manual process with many steps to work through - plenty of free developer tools are available for Mac OS X, but few are bundled with the OS. 

The `LAMP <http://en.wikipedia.org/wiki/LAMP_(software_bundle)>`_ software bundle has been powering sites on the Internet for decades. This procedure installs the same thing on Mac OS X - it’s MAMP, not LAMP. 

Assembling your MAMP software bundle takes sysadmin skills. As with all UNIX-like systems, system administration work on OS X makes heavy use of the CLI (Command Line Interface) and the system administrator account root. All the commands you need to type are displayed here in **``bold text``**. The command prompts and responses displayed by the system are included. 

After installing the MAMP software bundle and the Platform.sh software bundle, you can download one of your environments using the platform get command. 


check your OS X version
-----------------------

First, check your OS X version (Apple menu > About this Mac). 

I used this procedure on OS X Mavericks v10.9.5, which was bang up to date in October 2014. The older an article gets, the less accurate it becomes. 


Create a placeholder project folder
-----------------------------------

The *platform get* command puts a project’s web server resources into the folder *(project ID)/www*. I have not installed the platform tool yet, so I must create a placeholder folder by hand. That’s fine for testing my new Apache configuration. Later, when it is time to run platform get, I will replace this folder with the real thing. 

Apache needs to know what this new virtual server’s name is and where to find the code. You tell Apache by adding *ServerName* and *DocumentRoot* directives to one of its configuration files, named *httpd-vhosts.conf*. 
* Servername: *(project name)*
* DocumentRoot: *(home folder)/(project ID)/www*


Find your project ID
--------------------

If you have not yet signed up for a Platform.sh project, that’s fine - use a temporary label for now, like myProjectID. You can change it later. 

If you do have a Platform.sh project, find the ID using the web UI. 
My project ID is *wmd3wn3iorp5c*. I can see that ID in a few places: 
* the URL - *https://eu.platform.sh/projects/wmd3wn3iorp5c/environments/master*
* the git clone command - *git clone --branch master wmd3wn3iorp5c@git.eu.platform.sh:wmd3wn3iorp5c.git*
* the access information - *ssh wmd3wn3iorp5c-master@ssh.eu.platform.sh*


Create a project folder.
^^^^^^^^^^^^^^^^^^^^^^^^

Decide where you are going to put your project’s folder, and what you want to call your virtual host. This is what I did. 
* I started a Platform.sh project called *myProject*. 
* My project ID is *wmd3wn3iorp5c*.
* I am going to work out of my home folder */Users/larg*. 
* The *platform get* command will put my site into the path wmd3wn3iorp5c/www. These are the values I need for my virtual server. 
Putting all that together, I end up with these values.
Servername: myproject
DocumentRoot and Directory: /Users/larg/wmd3wn3iorp5c/www
