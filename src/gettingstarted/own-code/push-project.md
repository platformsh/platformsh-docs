# Import your own code

## Build, Deploy, Done!

With your configuration files complete, all that's left is to commit the changes and push to Platform.sh.

<asciinema-player src="/videos/asciinema/first-push.cast" preload=1></asciinema-player>

1. **Commit and push**

    Run the commands

    ```bash
    git add .
    git commit -m "Add config files."
    git push -u platform master
    ```

    Platform.sh will detect the presence of your configuration files and use them to build the application.

2. **Verify**

    When the build is completed, you can verify the deployment by typing the command

    ```bash
    platform url
    ```

    This will return a list of your routes. Pick the primary route `0` and click Enter, which will open your application in a browser window.

    Alternatively, you can also log back into the management console in your new project. Select the `Master` environment in the `Environments` list and click the link below the Overview box on the left side of the page.

    <video controls>
      <source src="/videos/management-console/check-status.mp4" type="video/mp4">
    </video>

That's it! Using the Platform.sh CLI and a few properly configured files, pushing your application to run on Platform.sh takes only a few minutes.

Now that your code is on Platform.sh, check out some of the Next Steps to get started developing.

<div class="buttons">
  <a href="#" class="prev-link button-link">Back</a>
  <a href="#" class="next-link button-link">I have deployed my application</a>
</div>
