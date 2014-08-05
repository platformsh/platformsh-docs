.. _symfony_faq:

Frequently Asked Questions (FAQ)
================================

How do I store my sessions variables?
-------------------------------------

If you get the error about ``failed: Read-only file system (30) in /app/app/cache/dev/classes.php line 420``, that's because Symfony is trying to write into: ``/var/lib/php5/`` which is not writable.

A workaround is to mount a sessions folder into Platform and write sessions in that folder.

Simply edit your ``.platform.app.yaml`` and add a mounts there:

.. code-block::
    console

    mounts:
    ...
        "/app/sessions": "shared:files/sessions"
    ...

Then, add this line at the top of your ``app_dev.php``:

.. code-block::
    console

    ini_set('session.save_path', __DIR__.'/../app/sessions' );

.. seealso::
  * :ref:`configuration_files`