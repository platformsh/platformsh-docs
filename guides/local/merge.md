# Time for Production

You can now test your change. You like it? Want to put it into production?
![Platform Web Merge](/images/platform-web-merge.png)
Click on the merge button and voilà! It is going to redeploy your production
site with the new theme. 

You can also do this from the command line.. with nothing but git..
```
$ git checkout master
Switched to branch 'master'
Your branch is up-to-date with 'platform/master'.
$ git merge add-theme
Updating f56715e..2548c67
Fast-forward
 project.make | 1 +
 1 file changed, 1 insertion(+)
$ git push
Total 0 (delta 0), reused 0 (delta 0)

Validating submodules.
Validating configuration files.
Processing activity: **Ori Pekelman** pushed to **Master**
    Found 1 new commit.
[...]
    Building application 'php' with toolstack 'php:drupal' (tree: 95c3a69)

To vmwklzcpbi6zq@git.eu.platform.sh:vmwklzcpbi6zq.git
   f56715e..2548c67  master -> master
```

Visually of course nothing will change: we merge the code, not the 
database (that would be stupid). So you will need to reactivate the theme. In
real life you would probably export a feature or do this in an installation
profile. 

And you can always `platform checkout master; platform drush vset theme_default bootstrap`
from the command line to the same effect...
