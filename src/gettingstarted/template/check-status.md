# Start with a template

## Build, Deploy, Done!

Once you have configured the template application in the previous step, Platform.sh will build your project for you.

<html>
<head>
<link rel="stylesheet" href="/styles/styles.css">
</head>
<body>
  <video width="800" controls autoplay loop>
    <source src="/videos/check-status.mp4" type="video/mp4">
  </video>
  <br/><br/> 
</body>
</html>

1. **Explore the management console**

   When the build screen has cleared, Platform.sh will return you to the management console. From now on, since you a project on your account, a version of this page will be what you see each time you visit the console.
   
   You will be on the main page for your new project, `My First Project`. From here, you can control the settings of this project, as well as monitor its status.
   
   In the `Environments` box, click on `Master`.
   
2. **Check the build status**

   As Platform.sh completes its build, take a minute to notice some the information available on this page.
   
   * **Overview**
   
      In this box, the `Master` environment, which is a live environment build from the `master` branch of our project, will have a status of `Building`. 
            
      Once that status has updated to `Active`, the build is complete and the application has deployed.
      
   * **Environment Activity**
   
      In this box, you can see what you have done so far has two initial entries: `My First Project` was created, and a template profile was initialized based on the template you chose in the previous step.
         
3. **Done!**

   That's it! Once the build status has changed to `Active`, you're application has been deployed on Platform.sh.
   
   You can view the template now by clicking on the link that is now visible for the `Master` environment under the Overview box. 
   
   It will open another tab in your browser to your new live site!
      
   
In these few steps you have created a free trial account, configured a maintained template on a  project and deployed it using the management console entirely in your browser. 

Using the [Platform.sh CLI](/development/cli.md), however, you get even more control over your project configurations, and you are able to migrate your own applications to Platform.sh. Move onto the next step to install it.

<html>
<head>
<link rel="stylesheet" href="/styles/styles.css">
</head>
<body>

<br/><br/>

<center>

<a href="/gettingstarted/template/create-project.html" class="buttongen small">Back</a>
<a href="/gettingstarted/template/cli-requirements.html" class="buttongen small">I have built and deployed a template project</a>

</center>

<br/><br/>

</body>
</html>
