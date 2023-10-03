## Start from scratch

### 1. Generate the project

If you don't have a codebase already, you'll need to generate one and move it to a repository on GitHub.
GitLab and Bitbucket support is coming soon.

<details class="get-started-expander">
  <summary><strong>Generate a {{ .Page.Params.framework }} project</strong></summary>
  <br/>

{{ .Inner }}

1. Initiate the contents of this directory as a Git repository so before doing anything else, initialize the repository:

    ```bash
    git init .
    ```

1. By default, Git uses `master` as the name for the initial branch. 
If you wish to change the default branch name, you can do so with the `git branch -m` command. 
The rest of this guide will assume you have changed the default branch to `main`: 

    ```bash
    git branch -m main
    ```

1. Lastly, stage and commit the code you've generated.

    ```bash
    git add . && git commit -m "Init commit: {{ .Page.Params.framework }} starter for {{ .Site.Params.vendor.name }}."
    ```

With the {{ .Page.Params.framework }} repository generated, move onto the next step -- [**Setting up the repository**](#2-set-up-the-repository) on an external Git service.

</details>

### 2. Set up the repository

{{ .Site.Params.vendor.name }} is meant to, among other things, simplify the _continuous delivery_ role of your application development. 
This guide will help you configure a project, including how infrastructure should be provisioned across preview environments. 

Those preview environments should be created alongside feature development in a collaborative Git service space like GitHub.

<details class="get-started-expander">
  <summary><strong>Set up GitHub</strong> <em>(GitLab and Bitbucket coming soon!)</em></summary>
  <br/>

{{ printf `{{< guides/deploy/code/init-repo-github "%s" >}}` ( .Get 0 ) | .Page.RenderString }}

With the {{ .Page.Params.framework }} template repository now set up on GitHub, you're ready to create a project on {{ .Site.Params.vendor.name }} to migrate it. 
Click the button below to continue.

{{ printf `{{< guides/buttons next="#migrate-your-codebase" text="Migrate your codebase to %s" >}}` .Site.Params.vendor.name | .Page.RenderString }}

</details>
