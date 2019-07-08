# Start with a template

## Build, Deploy, Done!

Once you have configured the template application in the previous step, Platform.sh will build your project for you.

<video controls>
  <source src="/videos/management-console/check-status.mp4" type="video/mp4">
</video>

1. **Explore the management console**

   When the build screen has cleared, Platform.sh will return you to the management console. Since you now have a project on your account, a version of this page will be what you see each time you visit the console.

   You will start on the main page for your new project, `My First Project`. From here, you can control the settings of this project and monitor its status.

   In the `Environments` box, click on `Master`.

2. **Check the build status**

   Take a minute to notice some the information available on this page.

   * **Overview**

      In this box the `Master` environment, which is a live environment built from the `master` branch of our application code, will have a status of `Building`.

      Once that status has updated to `Active`, the build is complete and the application has deployed.

   * **Environment Activity**

      In this box, you can see what you have done so far has two initial entries: `My First Project` was created, and the template profile you chose was initialized on the environment.

3. **Done!**

   That's it! Once the build status has changed to `Active`, your application has been deployed on Platform.sh.

   You can view the template by clicking on the link that is now visible for the `Master` environment under the Overview box. It will open another tab in your browser to your new live site!


In these few steps you created a free trial account, configured a template application on a project and deployed it using the management console entirely from your browser.

Using the [Platform.sh CLI](/development/cli.md), however, you get even more control over your project configurations, including the ability to migrate your own applications to Platform.sh. Move onto the next step to install it.

<div class="buttons">
  <a href="#" class="prev-link button-link">Back</a>
  <a href="#" class="next-link button-link">I have built and deployed a template application</a>
</div>
