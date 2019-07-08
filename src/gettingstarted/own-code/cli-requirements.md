
# Import your own code

## Requirements for the CLI

Now that you have created your free trial account, you are able to push your application to Platform.sh once you have installed the CLI, but there are a few requirements that must be met first.

### Git

[Git](/development/tools.md#git) is the open source version control system that is utilized by Platform.sh. Any change you make to your Platform.sh project will need to be committed via Git. You can see all the Git commit messages of an environment in the `Environment Activity` feed of the [management console](/administration/web.md) for each project you create.

Before getting started, make sure you have it [installed](https://git-scm.com/) on your computer.

### SSH key pair

Once your account has been set up and the [CLI](/development/cli.md) is installed, Platform.sh needs one additional piece of information about your computer so that you can access your projects from the command line.
If you are unfamiliar with how to generate an RSA public and private key, there are excellent instructions in the documentation about [how to do so](/development/tools.md#ssh).

### Add your SSH key to your account

Now that you have the requirements out of the way, place your SSH key onto Platform.sh so that you can communicate with your projects from your computer using the management console. Log in to your account

<video controls>
  <source src="/videos/management-console/add-ssh-mc.mp4" type="video/mp4">
</video>

1. **Access SSH key settings in the management console**

    From the management console, move to the top right hand corner of the screen and click the dropdown menu to the left of the settings gear box icon. In the menu, click on `Account`. The next page will normally list all of your projects, which at this point will be empty if you're just starting out.
    Click on the `Account Settings` link at the top of the page, then click the `SSH keys` tab to the left of your account information.

2. **Add your SSH key to your account**

    At this point you won't see anything listed in the body of the page, because you don't have SSH configured with Platform.sh yet. Click the `+ Add public key` button in the top right hand corner of the screen.

    This will open up another window with two fields. Name the key with something memorable, like `home-computer`, and in the field below that, paste the content of the public key you created in the previous step.

    When you have finished, click `Save` to save the key.


That's it! Now that you have met the requirements and configured an SSH key, Platform.sh can authenticate your computer and you can interact with your project from the command line.

Next, you will need to install the Platform.sh CLI so that you can import your code to a project.

<div class="buttons">
  <a href="#" class="prev-link button-link">Back</a>
  <a href="#" class="next-link button-link">I have configured my SSH key in the management console</a>
</div>
