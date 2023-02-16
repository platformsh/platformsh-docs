Now you have your configuration for deployment and your app set up to run on Platform.sh.
Make sure all your code is committed to Git and run `symfony cloud:deploy` to your Platform.sh environment.

Your code is built, producing a read-only image that's deploys to a running cluster of containers.
If you aren't using a source integration, the log of the process is returned in your terminal.
If you're using a source integration, you can get the log by running `symfony cloud:activity:log --type environment.push`.
When the build finished, you are given the URL of your deployed environment.
Click the URL to see your site.

If your environment wasn't active and so wasn't deployed, activate it by running the following command:

```bash
symfony cloud:environment:activate
```
