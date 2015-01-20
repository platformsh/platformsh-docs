.. _webhooks:

Webhooks
========

Platform.sh can easily be integrated with external services using webhooks.

With the CLI, you can list all your active integrations:

.. code-block:: console

    $ platform integrations

.. _generic-hook:

Generic hook
------------

.. _github-hook:

Github
------

The `Github <https://github.com>`_ integration allows you to manage your Platform.sh environments
directly from your Github repository.

Supported:

* Create a new environment when creating a Git branch or opening a pull request.
* Rebuild an environment when pushing code to a Git branch or a pull request.
* Delete an environment when deleting a Git branch or merging a pull request.

To integrate your Platform.sh project with an existing Github repository, you
first need to generate a token on your Github user profile. Simply go to your
account page on Github and click ``Edit profile``. Select the *Applications*
tab and click `Generate new token <https://github.com/settings/tokens/new>`_ on
the *Personal access tokens* section.

Give it a description and only check the ``repo`` and `read:org`` scopes. Make sure you save the
token somewhere.

To enable the Github webhook with the CLI:

.. code-block:: console

    $ platform integration:add --type=github --token=GITHUB-USER-TOKEN --repository=USER/REPOSITORY

The two optional parameters, which default to true, control whether you want to
track branches and/or pull requests:

* ``build_pull_requests``: true/false
* ``fetch_branches``: true/false

This command returns the Payload URL that you need to paste on your Github
repository.

Go to your Github repository and click ``Settings``. Select the *Webhooks and
Services* tab and click ``Add webhook``. Paste the Payload URL and click
``Add webhook``.

You can now start pushing code, creating new branch or opening pull request
directly on your Github repository.

.. _hipchat-hook:

Hipchat
-------

The `Hipchat <https://hipchat.com>`_ integration allows you to send notifications about your Platform.sh
activity directly to Hipchat.

To enable the Hipchat webhook with the CLI:

.. code-block:: console

    $ platform integration:add --type=hipchat --room=ROOM-ID --token=HIPCHAT-TOKEN

The two optional parameters control what events and states you want to track:

* ``events``: ["*"]
* ``states``: ["pending", "in_progress", "complete"]
