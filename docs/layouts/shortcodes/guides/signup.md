Depending on whether or not you have an existing project you want to migrate to Platform.sh,
there are three ways to get started.

### With a template

{{ markdownify (readFile "/layouts/shortcodes/template-intro.md") }}

Deploy a {{ .Get "name" }} template itself straight to Platform.sh.
Use the button below to launch a {{ .Get "name" }} template project
and create a Platform.sh account along the way.
If you don't want to sign up with an email address,
you can sign up using an existing GitHub, Bitbucket, or Google account.
If you choose one of these options, you can set a password for your Platform.sh account later.

<p align="center">
  <a href='https://console.platform.sh/org/create-project?template=https://raw.githubusercontent.com/platformsh/template-builder/master/templates/{{ .Get "template" }}/.platform.template.yaml&_utm_campaign=cta_deploy_marketplace_template&utm_source=public_documentation&_utm_medium=organic'>
    <img src="https://platform.sh/images/deploy/lg-blue.svg" alt="Deploy on Platform.sh" width="180px" />
  </a>
</p>

Once the template is deployed, you can follow the rest of this guide
so you can better understand the extra files and tweaks in the repository.

### With a brand new code base

You can start with a vanilla code base or push a pre-existing project to Platform.sh.

1. [Register for a trial Platform.sh account](https://auth.api.platform.sh/register).

   If you don't want to sign up with an email address,
   you can sign up using an existing GitHub, Bitbucket, or Google account.
   If you choose one of these options, you can set a password for your Platform.sh account later.

2. Create your first project.

   Since you're providing your own code, use the **Blank project** option.
   Give the project a title and choose the region closest to your site visitors.
   You can also select more resources for your project,
   although a `development` plan should be enough for you to get started.

{{ .Inner | .Page.RenderString }}

4. Add a Git remote for the Platform.sh project you just created.

   The easiest way to get the ID of the project is to run `plaform` on its own, which lists all of your projects.
   As you have only one project, you can copy its ID.
   Then in your Git repository run:

   ```bash
   platform project:set-remote <PROJECT_ID>
   ```

   That creates an upstream called `platform` for your Git repository.
   Don't push to it yet.

Once the project is fully configured, you can push to the remote you've created and have the project build automatically.

### From a third party Git provider

Platform.sh also supports third party Git hosting services, such as GitHub, GitLab, or BitBucket.
In that case, the Platform.sh Git repository becomes a read-only mirror of the third party repository,
which you can continue to use as normal.

1. [Register for a trial Platform.sh account](https://auth.api.platform.sh/register).

   If you don't want to sign up with an email address,
   you can sign up using an existing GitHub, Bitbucket, or Google account
   If you choose one of these options, you can set a password for your Platform.sh account later.

1. Create your first project.

   Since you're providing your own code, use the **Blank project** option.
   Give the project a title and choose the region closest to your site visitors.
   You can also select more resources for your project,
   although a `development` plan should be enough for you to get started.

1. Add an integration to your existing third party repository.

   The process varies a bit for each supported service, so check the specific pages for each one.

   * [BitBucket](/integrations/source/bitbucket.md)
   * [GitHub](/integrations/source/github.md)
   * [GitLab](/integrations/source/gitlab.md)

   Accept the default options or modify to fit your needs.

All existing branches you have are automatically synchronized to Platform.sh.
The deploy on Platform.sh reports a failure at this point.
That's expected because you haven't provided configuration files yet.
You add them in the next step.
Remember to have a local clone of your project.

{{ $inner := `

If you're integrating a repository to Platform.sh that contains a number of open pull requests,
don't use the default integration options.
Projects are limited to three\* development environments (active and deployed branches or pull requests)
and you would need to deactivate them individually to test this guide's migration changes.
Instead, each service integration should be made with the following flag:

<div class="highlight"><pre class="chroma"><code class="language-bash" data-lang="bash">platform integration:add --type=&lt;service&gt; ... --build-pull-requests=false
</code></pre></div>

You can then go through this guide and activate the environment when you're ready to deploy

\* You can purchase additional development environments at any time in the Console.
Open your {{ .Get "name" }} project and select **Edit plan**.
Add additional **Environments**, view a cost estimate, and confirm your changes.

`}}
{{ partial "note" (dict "Inner" $inner "context" .) }}

Now that you have a local Git repository, a Platform.sh project, and a way to push code to that project, you're all set to continue.
