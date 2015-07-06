# Initialize Git

## Your project doesn't use Git yet

If you're not using with Git yet on your project, then you need to initialize it to push your codebae to Platform.sh.

Open a terminal and go to your project folder. Run this command to initiate the Git repository, and add a **platform** remote.

```bash
cd ~/Sites/mysite
git init
git remote add platform [PROJECT-ID]@git.[REGION].platform.sh:[PROJECT-ID].git
```

> **note**
> You can copy the `CLONE` URL from the Platform.sh Web Interface under the Git icon, or via the ``Setting up your project`` wizard.

Add and commit all your files to Git.

```bash
git add --all
git commit -m "Initial commit of My Project"
```

The *git init* command creates a default *master* branch for you locally, which you can later push to the *master* remote branch on Platform.sh.

## Your project already uses Git

If you're already working with Git for your project, then you simply need to add a **platform** remote repository. In that case, you will keep your existing Git history.

On a terminal, go to your Git project folder and add **platform** as a
remote.

```bash
$ cd ~/Sites/platform
$ git remote add platform [PROJECT-ID]@git.[REGION].platform.sh:[PROJECT-ID].git
```
