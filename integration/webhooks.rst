.. _webhooks:

Webhooks
========

Platform.sh can easily be integrated with external services using webhooks.

With the CLI, you can list all your active integrations:

.. code-block:: console

    $ platform integration:list

.. _generic-hook:

Generic hook
------------

.. _github-hook:

GitHub
------

The `GitHub <https://github.com>`_ integration allows you to manage your Platform.sh environments
directly from your GitHub repository.

Supported:

* Create a new environment when creating a Git branch or opening a pull request.
* Rebuild an environment when pushing code to a Git branch or a pull request.
* Delete an environment when deleting a Git branch or merging a pull request.

To integrate your Platform.sh project with an existing GitHub repository, you
first need to generate a token on your GitHub user profile. Simply go to your
account page on GitHub and click ``Edit profile``. Select the *Applications*
tab and click ``Generate new token`` on the *Personal access tokens* section.

Give it a description and only check the ``repo`` scope. Make sure you save the
token somewhere.

To enable the GitHub webhook with the CLI:

.. code-block:: console

    $ platform integration:add --type=github --token=GITHUB-USER-TOKEN --repository=USER/REPOSITORY

The two optional parameters, which default to true, control whether you want to
track branches and/or pull requests:

* ``build_pull_requests``: true/false
* ``fetch_branches``: true/false

This command returns the Payload URL that you need to paste on your GitHub
repository.

Go to your GitHub repository and click ``Settings``. Select the *Webhooks and
Services* tab and click ``Add webhook``. Paste the Payload URL and click
``Add webhook``.

You can now start pushing code, creating new branch or opening pull request
directly on your GitHub repository.

.. _hipchat-hook:

HipChat
-------

The `HipChat <https://hipchat.com>`_ integration allows you to send notifications about your Platform.sh
activity directly to HipChat.

To enable the HipChat webhook with the CLI:

.. code-block:: console

    $ platform integration:add --type=hipchat --room=ROOM-ID --token=HIPCHAT-TOKEN

The two optional parameters control what events and states you want to track:

* ``events``: ["*"]
* ``states``: ["pending", "in_progress", "complete"]
