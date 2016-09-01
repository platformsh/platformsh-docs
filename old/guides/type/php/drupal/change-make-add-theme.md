# Let's add a theme
But lets be productive.. and just add a theme. Open the `project.make` file with
your favorite editor. It should contain something like

```
api = 2
core = 7.x

; Drupal core.
projects[drupal][type] = core
projects[drupal][version] = 7.38
projects[drupal][patch][] = "https://drupal.org/files/issues/install-redirect-on-empty-database-728702-36.patch"

; Drush make allows a default sub directory for all contributed projects.
defaults[projects][subdir] = contrib

; Platform indicator module.
projects[platform][version] = 1.3
```
And add the following lines:
```
projects[bootstrap][type] = theme
projects[bootstrap][version] = 3.0
```
Save and close the file

if you run now `git status` you should see:
```
$ git status
On branch add-theme
Your branch is up-to-date with 'origin/add-theme'.
Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git checkout -- <file>..." to discard changes in working directory)

	modified:   project.make

no changes added to commit (use "git add" and/or "git commit -a")
```
