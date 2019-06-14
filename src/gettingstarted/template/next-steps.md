# Start with a template

## Next steps

In this guide you created a project using the [management console](/administration/web.md) and installed the [Platform.sh CLI](/development/cli.md).

Don't stop now! There are far more features that make Platform.sh profoundly helpful to developers that you have left to explore.

### Import your own code

Templates are great, but configuring your own application to run on Platform.sh is just as easy.

<div id = "own-code"></div>

<script>
    var descTitle = "Import your own code";
    var descDesc = "Use the CLI and a few configuration files to deploy your code on Platform.sh.";
    var descPath = getPathObj("/gettingstarted/own-code.html", descTitle, descDesc);
    var descButton = {type: "descriptive", path: descPath, div: "own-code"};
    makeButton(descButton);
</script>

### Developing on Platform.sh

Once an application has been migrated to Platform.sh, there's plenty more features that will help improve your development life cycle.

<div id = "local-dev"></div>

<script>
    var descTitle = "Local Development";
    var descDesc = "Remotely connect to services and build your application locally during development.";
    var descPath = getPathObj("/gettingstarted/local-development.html", descTitle, descDesc);
    var descButton = {type: "descriptive", path: descPath, div: "local-dev"};
    makeButton(descButton);
</script>

<div id = "dev-envs"></div>

<script>
    var descTitle = "Development environments";
    var descDesc = "Activate development branches and test new features before merging into production.";
    var descPath = getPathObj("/gettingstarted/dev-environments.html", descTitle, descDesc);
    var descButton = {type: "descriptive", path: descPath, div: "dev-envs"};
    makeButton(descButton);
</script>

### Additional Resources

<div id = "steps"></div>

<script>
    var descTitle = "Next steps";
    var descDesc = "Set up domains to take your application live, configure external integrations to GitHub, and more!";
    var descPath = getPathObj("/gettingstarted/next-steps.html", descTitle, descDesc);
    var descButton = {type: "descriptive", path: descPath, div: "steps"};
    makeButton(descButton);
</script>

<div id = "community"></div>

<script>
    var descTitle = "Platform.sh Community";
    var descDesc = "Check out how-tos, tutorials, and get help for your questions about Platform.sh.";
    var descPath = getPathObj("https://community.platform.sh/", descTitle, descDesc);
    var descButton = {type: "descriptive", path: descPath, div: "community"};
    makeButton(descButton);
</script>

<div id = "blog"></div>

<script>
    var descTitle = "Platform.sh Blog";
    var descDesc = "Read news and how-to posts all about working with Platform.sh.";
    var descPath = getPathObj("https://platform.sh/blog/", descTitle, descDesc);
    var descButton = {type: "descriptive", path: descPath, div: "blog"};
    makeButton(descButton);
</script>

<div id = "buttons"></div>

<script>
$(document).ready(function(){
  var navButtons = {type: "navigation", prev: getPathObj("prev"), div: "buttons"};
  makeButton(navButtons);
});
</script>
