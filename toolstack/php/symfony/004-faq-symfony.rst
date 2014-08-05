.. _symfony_faq:

Frequently Asked Questions (FAQ)
================================

How do I store my sessions variables?
-------------------------------------

.. todo:: Need to write the error here. The fix is to add this "/app/sessions": "shared:files/sessions" in .platform.app.yaml and write the session variable into this folder using: "ini_set('session.save_path', __DIR__.'/../app/sessions' );" in ``web/app_dev.php``