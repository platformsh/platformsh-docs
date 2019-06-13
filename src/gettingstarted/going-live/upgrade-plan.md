# Going Live

## Upgrade Plan

If you initialized your project on the "Development" plan size, you will not be able to take it live until you upgrade it. This can be done very easily using the management console.

<video width="800" controls autoplay loop>
  <source src="/videos/management-console/upgrade-plan.mp4" type="video/mp4">
</video>

Development plans come with four environments: three development and one "future" production environment. You will need to upgrade the plan size from a "Development" plan to any other plan size, depending on the needs of your application. 

For example, "Small" plan sizes provide a production environment, but restrict your application to the use of a single service (i.e. a database).

On your project, click the "Go live" button in the top right hand corner of your project preview image. This will allow you to edit the project's plan, and it can also be reached from your "Account" page by clicking "Edit" from the vertical dot dropdown for your project.

Select the plan size that is appropriate for the needs of your application. This is also the page where you can increase the number of development environments, the amount of storage, and the number of users that will have access to the project. Make your changes and then click "Update plan" at the bottom of the page. Your application will redeploy, and then your changes to the plan will be saved.

Now that you have upgraded your plan size, you are ready to set up your pre-registered domain.

<div id = "buttons"></div>

<script>
    var navNextText = "I have upgraded my plan size";
    var navButtons = {type: "navigation", prev: getPathObj("prev"), next: getPathObj("next", navNextText), div: "buttons"};
    makeButton(navButtons);
</script>
