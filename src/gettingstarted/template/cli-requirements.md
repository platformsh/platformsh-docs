# Start with a template

## Next Steps: Requirements for the CLI

With the [management console](/administration/web.md) you can start new projects from templates just as you did in the previous steps, but deploying your own applications requires you to also use the [Platform.sh CLI](/development/cli.md).

Before you install it, there are a few requirements that must be met first.

### Git

[Git](/development/tools.md#git) is the open source version control system that is utilized by Platform.sh. Any change you make to your Platform.sh project will need to be committed via Git. You can see all the Git commit messages of an environment in the `Environment Activity` feed of the [management console](/administration/web.md) for each project you create.

Before getting started, make sure you have it [installed](https://git-scm.com/) on your computer.

### SSH key pair

Once your account has been set up and the [CLI](/development/cli.md) is installed, Platform.sh needs one additional piece of information about your computer so that you can access your projects from the command line.
If you are unfamiliar with how to generate an SSH public and private key, there are excellent instructions in the documentation about [how to do so](/development/tools.md#ssh).

### Add your SSH key to your account

Add your SSH key to your Platform.sh account so that you can communicate with your projects using the CLI.

<video width="800" controls autoplay loop>
  <source src="/videos/add-ssh-mc.mp4" type="video/mp4">
</video>

1. **Access SSH key settings in the management console**

    From the management console, move to the top right hand corner of the screen and click the dropdown menu to the left of the settings gear box icon. In the menu, click on `Account`. This next page lists all of your active projects, which now includes `My First Project`. 

    Click on the `Account Settings` link at the top of the page, then click the `SSH keys` tab to the left of your account information.

2. **Add your SSH key to your account**

    Click the `+ Add public key` button in the top right hand corner of the screen. This will open up another window with two fields. Name the key with something memorable, like `home-computer`, and in the field below that, paste the content of your public key.
    
    When you have finished, click `Save` to save the key.
    

That's it! Now that you have met the requirements and configured an SSH key, all that's left is to install the Platform.sh CLI so you can interact with your projects from the command line.

<div id = "buttons"></div>

<script>
    var navNextText = "I have added my SSH key to my account";
    var navButtons = {type: "navigation", prev: getPathObj("prev"), next: getPathObj("next", navNextText), div: "buttons"};
    makeButton(navButtons);
</script>
