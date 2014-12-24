.. _blackfire:

Blackfire
=========

Platform.sh supports `Blackfire Profiler <https://blackfire.io/>`_.

To configure it, simply edit your ``.platform.app.yaml`` to add the following lines with your credentials:

.. code-block:: console

  runtime:
      extensions:
          name: blackfire
          configuration:
              server_id: "d73e126e-5520-45d8-82c2-34e3f92d7ccf"
              server_token: "eb27e4ca8a2f4d2fb6a59a66b885231eb27e4ca8a2f4d2fb6a59a66b885231"