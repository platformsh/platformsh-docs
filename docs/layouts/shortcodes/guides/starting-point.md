{{ $name := .Get "name"}}
{{ $repo := .Get "templateRepo" }}
{{ $composerLink := .Get "composerLink" }}
{{ $site := $name}}
{{ if ne $composerLink "" }}
  {{ $site = printf "[Composer-flavored %s](%s)" $name $composerLink }}
{{ end }}
To get {{ $name }} running on Platform.sh, you have two potential starting places:

-   You already have a {{ $site }} site you are trying to deploy.
    Go through this guide to make the recommended changes to your repository to prepare it for Platform.sh.

-   You have no code at this point.

    If you have no code, you have two choices:

    -   Generate a basic {{ $site }} site.
        {{ if .Get "initExample" }}See an example for doing this under initializing a project.{{ end }}

    -   Use a ready-made [{{ $name }} template](https://github.com/platformsh-templates/{{ $repo }}).
        {{ markdownify (readFile "/layouts/shortcodes/template-intro.md") }}

        To use a template, click the button below to create a {{ .Get "name" }} template project.

        <p align="center">
          <a href='https://console.platform.sh/org/create-project?template=https://raw.githubusercontent.com/platformsh/template-builder/master/templates/{{ $repo }}/.platform.template.yaml&_utm_campaign=cta_deploy_marketplace_template&utm_source=public_documentation&_utm_medium=organic'>
            <img src="https://platform.sh/images/deploy/lg-blue.svg" alt="Deploy on Platform.sh" width="180px" />
          </a>
        </p>

        Once the template is deployed, you can follow the rest of this guide
        to better understand the extra files and changes to the repository.
