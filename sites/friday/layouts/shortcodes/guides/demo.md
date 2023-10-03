## Explore features with a demo project

Before moving on to the framework-specific Getting Started guides below, it is _strongly recommended_ that you first go through the {{ .Site.Params.vendor.name }} demo project. 
The project is a guided tour of many of the common CLI commands as well as the foundational concepts behind working with {{ .Site.Params.vendor.name }}.

To start the demo project:

1. Visit the [{{ .Site.Params.vendor.name }} Console]({{ .Site.Params.vendor.urls.register }}).
    If this is your first time using {{ .Site.Params.vendor.name }}, you'll be directed to first sign up for an account 
    and create your first organization.
1. In the top right-hand corner, choose **+ Create Project**.
1. You'll then be presented with three options for creating the new project. 
    Choose the **Demo project** option by selecting **Explore {{ .Site.Params.vendor.name }}**.
    You can select the organization you created in the previous step from the top dropdown.

    <!-- ![Apps and services tree](/images/create-project-choices.png "1.0") -->

Once you've completed the demo, you'll have:

1. A project deployed on {{ .Site.Params.vendor.name }}, which you can delete with the command `{{ .Site.Params.vendor.cli }} project:delete -p PROJECT_ID` before proceeding.
1. You first organization created. You can delete that organization with the command `{{ .Site.Params.vendor.cli }} org:delete -o ORG_NAME`, but you will need to recreate an organization before proceeding to the next step.
