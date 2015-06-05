# Migrate an existing site to Platform.sh

To migrate your existing site into Platform.sh, here are the three
components you need to import: *code base*, *database* and *files*.

## Import your code base

This will depend wether you have Git already set up for your project or
not.

### Your project already uses Git

If you're already working with Git for your project, then you simply
need to add a **platform** remote repository. In that case, you will
keep your existing Git history.

On a terminal, go to your Git project folder and add **platform** as a
remote.

```bash
$ cd ~/Sites/platform
$ git remote add platform [PROJECT-ID]@git.[REGION].platform.sh:[PROJECT-ID].git
```

> **note**
>
> You can copy-paste the Git URL from the Platform UI under the Git
> icon.

Then push your local branch to your **platform** remote.

```bash
$ git push platform HEAD:master
```

Both on the terminal and on the Platform UI, you should see your Master
environment being built.

### Your project doesn't use Git yet

If you're not working with Git for your project, then you'll need to
initialize your repo.

On a terminal, go to your project folder, initiate the Git repository,
and add a **platform** remote repository.

```bash
$ cd ~/Sites/mysite
$ git init
$ git remote add platform [PROJECT-ID]@git.[REGION].platform.sh:[PROJECT-ID].git
```

> **note**
>
> You can get the Git URL from the Platform UI under the Git icon.

Commit your project to the **platform** remote repository and push the
code.

```bash
$ git add .
$ git commit -m "Initial commit of My Site"
$ git push platform master
```

> **note**
>
> *git init* should have created a default *master* branch for you
> locally, so you can directly push that branch to you *master* remote
> branch on Platform.sh.

Both on the terminal and on the ui\_overview, you should see your Master
environment being built.

## Import your database

Export your database in an SQL file or in a compressed file.

Copy it via SSH to the remote environment on Platform into the
`/app/tmp` folder which is writable:

```bash
$ scp database.sql [PROJECT-ID]-master@ssh.[REGION].platform.sh:/app/tmp
```

Log in to the environment via SSH and import the database:

```bash
$ ssh [PROJECT-ID]-master@ssh.[REGION].platform.sh
web@[PROJECT-ID]-master--php:~$ mysql -h database.internal main < tmp/database.sql
```

## Import your files

Go to your files folder on your local machine and synchronize them to
your remote Platform.sh environment:

```bash
$ rsync -r files/. [PROJECT-ID]-master@ssh.[REGION].platform.sh:/app/tmp/
```

> **note**
>
> The location of the files folder depends on your configuration.

