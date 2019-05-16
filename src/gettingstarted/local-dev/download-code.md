# Local development

## Download the code

If you have already [pushed your code](/gettingstarted/own-code.md) to Platform.sh, then you should already have a local repository that you can build from.

Otherwise, it will be necessary to download a local copy of your project first.

<html>
<head>
  <link rel="stylesheet" type="text/css" href="/asciinema/asciinema-player.css" />
</head>
<body>
  <asciinema-player src="/asciinema/recordings/local-copy.cast" preload=1 autoplay=1 loop=1></asciinema-player>
  <script src="/asciinema/asciinema-player.js"></script>
</body>
</html>

1. **Get project ID**

    You will need the your *project ID*. You can retrieve this ID at any time using the CLI commands `platform` or `platform project:list`.

2. **Get a copy of the repository locally**
    
    Next, use the CLI to download the code in your Platform.sh project using the command
    
    ```bash
    platform get <project id>
    ```

Now that you have a local copy of your application that is configured to the Platform.sh remote repository, you can now connect to its services and build it on your machine.

<html>
   <head>
      <link rel="stylesheet" href="/styles/styles.css">
      <script type = "text/javascript" src = "/scripts/buttons/buttons.js" ></script>
   </head>
   <body>
   <div id = "buttons"></div>
   <script>
   var buttonTextNext = "I have a copy of my code locally";
   makeButtons("full", buttonTextNext);
   </script>
   </body>
</html>
