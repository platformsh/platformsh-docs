# Local development

## Download the code

If you have already [pushed your code](/gettingstarted/own-code.md) to Platform.sh, then you should already have a local repository that you can build from.

Otherwise, it will be necessary to download a local copy of your project first.

<asciinema-player src="/videos/asciinema/local-copy.cast" preload=1></asciinema-player>

1. **Get project ID**

    You will need the your *project ID*. You can retrieve this ID at any time using the CLI command `platform`.

2. **Get a copy of the repository locally**

    Next, use the CLI to download the code in your Platform.sh project using the command

    ```bash
    platform get <project id>
    ```

Next you can now connect to its services and build it on your machine.

<div class="buttons">
  <a href="#" class="prev-link button-link">Back</a>
  <a href="#" class="next-link button-link">I have a local copy of my code</a>
</div>
