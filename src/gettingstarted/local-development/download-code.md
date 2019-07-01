# Local development

## Download the code

If you have already [pushed your code](/gettingstarted/own-code.md) to Platform.sh, then you should already have a local repository that you can build from.

Otherwise, it will be necessary to download a local copy of your project first.

<asciinema-player src="/videos/asciinema/local-copy.cast" preload=1 autoplay=1 loop=1></asciinema-player>

1. **Get project ID**

    You will need the your *project ID*. You can retrieve this ID at any time using the CLI command `platform`.

2. **Get a copy of the repository locally**

    Next, use the CLI to download the code in your Platform.sh project using the command

    ```bash
    platform get <project id>
    ```

Next you can now connect to its services and build it on your machine.

<div id = "buttons"></div>

<script>
$(document).ready(function(){
  var navNextText = "I have a local copy of my code";
  var navButtons = {type: "navigation", prev: getPathObj("prev"), next: getPathObj("next", navNextText), div: "buttons"};
  makeButton(navButtons);
});
</script>
