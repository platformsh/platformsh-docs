.. _webhooks:

Webhooks
========

Platform.sh can easily be integrated with external services using webhooks.

With the CLI, you can list all your active integrations:

.. code-block:: console

    platform integrations

.. _github-hook:

GitHub
------

The `GitHub <https://github.com>`_ integration allows you to manage your Platform.sh environments
directly from your GitHub repository.

Supported:

* Create a new environment when creating a Git branch or opening a pull request.
* Rebuild an environment when pushing code to a Git branch or a pull request.
* Delete an environment when merging a pull request.

To integrate your Platform.sh project with an existing GitHub repository, you
first need to generate a token on your GitHub user profile. Simply go to your
account page on GitHub and click ``Edit profile``.

Select the *Applications* tab and click `Generate new token
<https://github.com/settings/tokens/new>`_ in the *Personal access tokens*
section.

Give it a description and then ensure the token has the following scopes:

* To integrate with public repositories: ``public_repo``
* To integrate with your own private repositories:  ``repo``
* To integrate with your organization's private repositories:  ``repo`` and ``read:org``

Copy the token and make a note of it (temporarily).

Note that for the integration to work, your GitHub user needs to have
permission to push code to the repository.

Now open a command line (you need to have the Platform.sh CLI installed). To enable the GitHub integration with the CLI:

.. code-block:: console

    platform integration:add --type=github --token=GITHUB-USER-TOKEN --repository=USER/REPOSITORY
    
If your repository belongs to an organisation, use ``--repository=ORGANISATION/REPOSITORY``.

The two optional parameters, which are both enabled by default, control whether
you want to track branches and/or pull requests:

* ``--build-pull-requests`` [true | false]
* ``--fetch-branches`` [true | false]

This command returns the Payload URL that you need to paste on your Github
repository webhooks page.

Go to your GitHub repository and click ``Settings``. Select the *Webhooks and
Services* tab and click ``Add webhook``. Paste the Payload URL, Choose "Just 
send me everything" for the events you want to receive. and click ``Add webhook``. 

You can now start pushing code, creating new branches or opening pull requests
directly on your GitHub repository.

.. _hipchat-hook:

HipChat
-------

The `HipChat <https://hipchat.com>`_ integration allows you to send notifications about your Platform.sh
activity directly to HipChat.

To enable the HipChat webhook with the CLI:

.. code-block:: console

    platform integration:add --type=hipchat --room=ROOM-ID --token=HIPCHAT-TOKEN

The two optional parameters control what events and states you want to track:

* ``events``: ["*"]
* ``states``: ["pending", "in_progress", "complete"]

.. _generic-hook:

Generic hook
------------
This hook will allow you to capture any push events on platform and POST a JSON file 
describing the activity to the url of your choice. You can use this to further automate
your Platform.sh workflow.

.. code-block:: console

    platform integration:add --type=webhook --url=A-URL-THAT-CAN-RECEIVE-THE-POSTED-JSON

Here you can see an example of the response:

.. code-block:: javascript
    
    {
    "completed_at": "2015-02-01T16:57:07.347350+00:00",
    "completion_percent": 100,
    "created_at": "2015-02-01T16:57:06.799016+00:00",
    "environments": [
        "master"
    ],
    "id": "o6nnkdf4w7jdm",
    "log": "Found 1 new commit.\n\nBuilding application ...",
    "parameters": {
        "environment": "master",
        "new_commit": "b52500ed5419ce15403963cd1f9203d7a230de86",
        "old_commit": "8008b0cf4535adee78a7b4b7c5d23f6cac251c2b",
        "user": "35a491da-031e-4c23-b264-9f96040a6e36"
    },
    "payload": {
        "commits": [
            {
                "author": {
                    "email": "user@example.com",
                    "name": "John Doe"
                },
                "message": "empty",
                "sha": "35a500ed5419ce15403963cd1f9203d7a230de86"
            }
        ],
        "commits_count": 1,
        "environment": {
            "created_at": "2015-01-21T12:43:15.331095+00:00",
            "deployment_target": "local",
            "enable_smtp": true,
            "has_code": true,
            "head_commit": "35a500ed5419ce15403963cd1f9203d7a230de86",
            "http_access": {
                "addresses": [],
                "basic_auth": {}
            },
            "id": "master",
            "is_dirty": false,
            "is_main": true,
            "name": "master",
            "parent": null,
            "project": "7polx4hc6wak6",
            "status": "active",
            "title": "Master",
            "updated_at": "2015-01-21T12:43:15.331240+00:00"
        },
        "user": {
            "created_at": "2015-02-01T16:56:21.692740+00:00",
            "display_name": "John Doe",
            "id": "35a491da-031e-4c23-b264-9f96040a6e36",
            "updated_at": null
        }
    },
    "project": "7polx4hc6wak6",
    "result": "success",
    "started_at": "2015-02-01T16:57:06.834660+00:00",
    "state": "complete",
    "type": "environment.push",
    "updated_at": "2015-02-01T16:57:07.347358+00:00"
    }
