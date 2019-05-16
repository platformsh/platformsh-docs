# Development Environments

## Merge into production

Now that you've had the chance to verify that your application built and deployed correctly on your development environment, you're ready to merge it into your production site. Platform.sh provides [snapshot](/administration/snapshot-and-restore.md) features that protect against any unforeseen consequences of your merges, keeping a historical copy of all of your code and data. 

<html>
<head>
  <link rel="stylesheet" type="text/css" href="/asciinema/asciinema-player.css" />
</head>
<body>
  <asciinema-player src="/asciinema/recordings/snap-merge-restore.cast" preload=1 autoplay=1 loop=1></asciinema-player>
  <script src="/asciinema/asciinema-player.js"></script>
</body>
</html>

> **Note:** In each code example provided, it is not necessary to include the `--project` flag if you are merging from within your local repository and the flags are meant only to be illustrative.

1. **Create a snapshot**

    Before you merge the `dev` feature into `master`, create a [snapshot](/administration/snapshot-and-restore.md) of the `master` environment. The snapshot will preserve both the code and all of its data that can be used to restore the environment later.

    ```bash
    platform snapshot:create --project <project id>
    ```
    
    Select `master` as the environment you want to back up and the CLI will create your snapshot.

2. **Merge feature into production**

    ```bash
    platform environment:merge --project <project id>
    ```
    
    Select `dev`, and then Platform.sh will merge `dev` into its parent, `master`. You can once again verify that your changed have been merged when the build process completes with 
    
    ```bash
    platform url
    ```

3. **Restore a snapshot**

    If for whatever reason the outcome of the merge did not go as you expected and you would like to restore the code and data to the time of your snapshot, you can use the command 

    ```bash
    platform snapshot:restore --project <project id>
    ```

<html>
   <head>
      <link rel="stylesheet" href="/styles/styles.css">
      <script type = "text/javascript" src = "/scripts/buttons/buttons.js" ></script>
   </head>
   <body>
   <div id = "buttons"></div>
   <script>
   var buttonTextNext = "I have merged the new feature";
   makeButtons("full", buttonTextNext);
   </script>
   </body>
</html>
