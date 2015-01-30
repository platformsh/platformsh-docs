.. _blackfire:

Blackfire
=========

Platform.sh supports `Blackfire Profiler <https://blackfire.io/>`_.

Get Started
------------

**Sign up for free** at `blackfire.io <https://blackfire.io/signup>`_, and install the **Blackfire Companion** web browser extension (`Chrome <https://chrome.google.com/webstore/detail/blackfire-companion/miefikpgahefdbcgoiicnmpbeeomffld>`_).

Get your server credentials on your `Blackfire account <https://blackfire.io/account/credentials>`_.

.. figure:: /integration/images/blackfire-credentials.png
  :alt: Blackfire credentials

Paste those credentials in your ``.platform.app.yaml``:

.. code-block:: console

  runtime:
      extensions:
          - name: blackfire
          configuration:
              server_id: "bad10394-bdaf-436e-9ee9-c6090cd45eb2"
              server_token: "692203ae8755da6b57b8161d3f20db1be71502f77adedf3363d164033d74d29b"

Push your changes to your Platform environment to enable Blackfire:

.. code-block:: console

  $ git add .platform.app.yaml
  $ git commit -m "Enable Blackfire."
  $ git push

Profile
-------

Access your site via your browser and click ``Profile`` in the Blackfire Companion.

.. figure:: /integration/images/blackfire-companion.png
  :alt: Blackfire companion

That's it, your site is being profiled and you should get all the results in your Blackfire account.