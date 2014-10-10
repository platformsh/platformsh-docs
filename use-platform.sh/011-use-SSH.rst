
.. _ssh_genkeypair:

Use SSH keys
============

One of the ways `Platform <https://platform.sh/>`_ keeps things secure is by using :ref:`SSH` behind the scenes. Users connect to their Platform :ref:`git` repo and to their Platform :term:`CLI` using SSH. 


Find your Public-Private Keypair
--------------------------------

If you use Linux, you already have keys. The private key is usually in a file named ``id_rsa`` and the public key in ``id_rsa.pub``, 

Search for a public key file. 
1. Open up a command prompt.
2. run the following commands. ::

    $ cd ~/.ssh
    $ ls -a
    id_rsa
    id_rsa.pub
    known_hosts
    authorized_keys

If you find a file named either ``id_rsa.pub`` or ``id_dsa.pub``, 
you can use it with Platform. 


Create a New Public-Private Keypair
-----------------------------------

If you found your SSH keypair, you can skip this step. If you don't have SSH keys, this step walks you through creating them. 

3. Create a public-private keypair. ::

     $ ssh-keygen -t rsa -C "your_email_address@example.com"

   ``ssh-keygen`` generates the key pair and will ask you where you want to save the file. ::

     Generating public/private rsa key pair.
     Enter file in which to save the key (/Users/your_username/.ssh/id_rsa):

   The default location is fine, in most cases. Now it's time to create a passphrase. A good, strong passphrase is highly recommended! ::

     Enter passphrase (empty for no passphrase): [Type a passphrase]
     Enter same passphrase again: [Type passphrase again]

   That's it. Keys generated! Here are the results. ::

     Your identification has been saved in /Users/your_username/.ssh/id_rsa.
     Your public key has been saved in /Users/your_username/.ssh/id_rsa.pub.
     The key fingerprint is:
     55:c5:d7:a9:1f:dc:7a:67:31:70:fd:87:5a:a6:d0:69 your_email_address@example.com

   .. note:: Make note of the location of your public key, you're going to need that in the next section.


.. _ssh_addkeytoaccount:

Add your SSH key to your Platform account
-----------------------------------------

You have your SSH keys (if not, take a look at the section above), but you need to make sure Platform has a copy of your public key. It's pretty easy to add it to your account.

1. First off, you'll need to copy your public key to the clipboard.

2. Head over to your user account page on `Marketplace <https://marketplace.commerceguys.com/user>`_ and navigate to the ``SSH Keys`` tab.

3. Click on the ``Add a public key`` link.

4. Paste the key that you copied earlier into the 'Key' text box and you can add a title, if you like (it will be auto-generated, if you don't add one).

5. Click 'Save'. 

That's it! You're all set. Now you'll be able to use :ref:`Git <git>` on Platform, and able to SSH into one of your :term:`environments <environment>` web servers.

.. image:: /overview/platform-interaction-methods/images/ssh-addkeytomarketplace.png
   :alt: Add SSH key to Marketplace


.. _ssh_towebservers:

SSH to your Web Server
----------------------

Just under the Environment indicator, in the Platform UI, there is a link to the access information for that :term:`environment`. 

1. Open your platform web UI. 
2. Click on this link to view access information about this :term:`environment`.
3. Copy the SSH command 

.. figure:: /overview/platform-interaction-methods/images/ssh-access-information.png
   :alt: SSH access information

   The SSH user name is the concatenation of the your platforms unique id and the environment id. The ssh hostname is 'ssh.' prepended onto the server clusters hostname your platform is hosted on. I.E.: [project-id]-[environment-id]@ssh.[server-cluster-hostname].

4. Open a terminal. 
5. paste the link into your terminal to SSH into the web server for this :term:`environment`.

You should see something like this. ::

    $ ssh wk5fqz6qoo123-master@ssh.eu.platform.sh

       ___ _      _    __ 
      | _ \ |__ _| |_ / _|___ _ _ _ __ 
      |  _/ / _` |  _|  _/ _ \ '_| '  \
      |_| |_\__,_|\__|_| \___/_| |_|_|_|

     Welcome to Platform.

     This is environment master
     of project wk5fqz6qoo123.

    web@wk5fqz6qoo123-master--php:~$ 



Troubleshoot SSH 
----------------

This is bad. ::

    $ ssh wk5fqz6qoo123-master@ssh.eu.platform.sh
    Permission denied (publickey).
    $ 

Don't panic. It's a common problem. A Permissions denied message like this can happen for two reasons.
* your environment is inactive 
* your ssh private key is not added into the ssh-agent

Check your private key 
^^^^^^^^^^^^^^^^^^^^^^

Check that your key is properly added to your SSH agent.
This is an authentication agent that manages your private key. 

1. Check your SSH agent. Run the command "ssh-add -l" in your terminal. :: 

    $ ssh-add -l
    2048 12:b0:13:83:7f:56:18:9b:78:ca:54:90:a7:ff:12:69 /Users/nick/.ssh/id_rsa (RSA)
    $ 

2. Check that file name on the right. Does it match your private key file?
3. If you don't see your private key file, add your private key. ::

    ssh-add path-to-your-key

4. Try again. 


Check your public key 
^^^^^^^^^^^^^^^^^^^^^

If you still have no luck, check the public key (see 
:ref:`ssh_addkeytoaccount`).


Generate some SSH debug information 
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

If your private key and public key both look OK but you don't have any luck logging in, print debugging information. These lines often give clues about what is going wrong. 

1. Run the SSH command with the -v option, like this. ::

    $ ssh -v wk5fqz6qoo123-master@ssh.eu.platform.sh 
    OpenSSH_6.7.8, OpenSSL 1.2.3 1 Sep 2014 
    debug1: Connecting to ssh.eu.platform.sh [54.32.10.98] port 22. 
    debug1: Connection established. 
    debug1: identity file /Users/nick/.ssh/id_rsa type 1
    ...(30 more lines of this light reading)...
    debug1: Offering RSA public key: /Users/nick/.ssh/id_rsa
    debug1: Authentications that can continue: publickey
    debug1: No more authentication methods to try. 
    Permission denied (publickey).
    $

You can use this information to make one last check of the private key file.

If you are still stuck, raise a ticket with Commerce Guys. 



last update: |today|
