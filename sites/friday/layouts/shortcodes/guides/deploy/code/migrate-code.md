## Migrate your codebase

You have, at this point, a {{ .Page.Params.framework }} repository hosted on an external Git service like GitHub.
This section will describe two options you have for integrating that repository with a **project** on {{ .Site.Params.vendor.name }}: [using the {{ .Site.Params.vendor.name }} Console](#upsun-console) or [with the {{ .Site.Params.vendor.name }} CLI](#upsun-cli).

### {{ .Site.Params.vendor.name }} Console

<details class="get-started-expander">
  <summary><strong>GitHub</strong> <em>(GitLab and Bitbucket coming soon!)</em></summary>

{{ printf `{{< guides/deploy/code/init-project-console-github "%s" >}}` ( .Get 0 ) | .Page.RenderString }}

</details>

### {{ .Site.Params.vendor.name }} CLI

<details class="get-started-expander">
  <summary><strong>GitHub</strong> <em>(GitLab and Bitbucket coming soon!)</em></summary>

{{ printf `{{< guides/deploy/code/init-project-cli-github "%s" >}}` ( .Get 0 ) | .Page.RenderString }}

</details>

<style>
    .get-started-expander {
        margin-bottom: 1rem; 
        padding: 2rem;
        border: 1px solid #191C1E !important; 
        cursor:pointer;
    }
</style>
