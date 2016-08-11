# Now we have a new environment
We'll get into this in a bit more detail later.. but the best way currently
to develop Drupal sites is with Drush Make Files. We'll show you how cool this
is.

type `platform` again in your projects directory.

You should see the new branch that was created, and a couple of starting points
to help you get along.

```
$ platform
Welcome to Platform.sh!

Project Name: A Drupal Site for the Masses
Project ID: vmwklzcpbi6zq
Project Dashboard: https://eu.platform.sh/#/projects/vmwklzcpbi6zq

Your environments are:
+-----------+-----------+--------+
| ID        | Name      | Status |
+-----------+-----------+--------+
| master*   | Master    | Active |
| add-theme | add-theme | Active |
+-----------+-----------+--------+
* - Indicates the current environment.

Check out a different environment by running platform checkout [id].
Branch a new environment by running platform environment:branch [new-name].
Back up the current environment by running platform environment:backup.
Execute Drush commands against the current environment by running platform drush.

You can list other projects by running platform projects.

Manage your domains by running platform domains.
Manage your SSH keys by running platform ssh-keys

Type platform list to see all available commands.
```
