.. _symfony_faq:

Frequently Asked Questions (FAQ)
================================

How do I store my sessions variables?
-------------------------------------

If you get the following error:

.. code-block:: console

    failed: Read-only file system (30) in /app/app/cache/dev/classes.php line 420

that's because Symfony is trying to write into: ``/var/lib/php5/`` which is read-only.

A workaround is to mount a sessions folder into Platform.sh and write sessions in that folder.

Simply edit your ``.platform.app.yaml`` and add a mounts there:

.. code-block:: console

    mounts:
    ...
        "/app/sessions": "shared:files/sessions"
    ...

Then, add this line at the top of your ``app_dev.php``:

.. code-block:: console

    ini_set('session.save_path', __DIR__.'/../app/sessions' );

.. seealso::
  * :ref:`configuration_files`


Why does my newly cloned Symfony install throw errors?
--------------------------------------------------------------------------------------

You may encounter the WSOD (white screen of death) when you first clone a new Symfony2 project from your platform. This is likely because you forgot to install dependencies.

You will need to install composer first and then run the following command:

.. code-block:: console
	
	php composer.phar install

.. seealso::
  * `Install Composer <https://getcomposer.org/download/>`_