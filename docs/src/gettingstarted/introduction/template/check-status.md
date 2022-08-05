---
title: "Build, Deploy, Done!"
weight: 3
toc: false
aliases:
  - "/gettingstarted/template/check-status.html"
---

Once you have configured the template application in the previous step, Platform.sh builds your project for you.

{{< video src="videos/management-console/check-status.mp4" >}}

1. **Explore the Console**

   When the build screen has cleared, Platform.sh returns you to the Console.
   Since you now have a project on your account, a version of this page is what you see each time you visit the Console.

   You start on the main page for your new project, `My First Project`.
   From here, you can control the settings of this project and monitor its status.

   In the **Environments** box, click your default branch's name.

2. **Check the build status**

   Take a minute to notice some of the information available on this page.

   * **Overview**

      In this box, your production environment, which is a live environment built from the default branch of your application code,
      has the status `Building`.

      Once that status has updated to `Active`,
      the build is complete and the application has been deployed.

   * **Environment Activity**

      In this block, you can see what you have done so far has two initial entries:
      `My First Project` was created and the template profile you chose was initialized on the environment.

3. **Done!**

   That's it! Once the build status has changed to `Active`, your application has been deployed on Platform.sh.

   You can view the template by clicking on the link that's now visible for the environment under the Overview box.
   It opens another tab in your browser to your new live site!


In these few steps you created a free trial account, configured a template application on a project,
and deployed it using the Console entirely from your browser.

Using the [Platform.sh CLI](/administration/cli/_index.md), you get even more control over your project configurations,
including the ability to migrate your own applications to Platform.sh.
Move to the next step to install it.

{{< guide-buttons next="I've deployed a template application" >}}
