## Before you begin

You need:

- A local copy of the project repository on your computer.
  
  You can get one by running the following command: <code>platform get {{ `{{< variable "PROJECT_ID" >}}` | .Page.RenderString }}</code>.
  Or clone an integrated source repository
  and set the remote branch by running the following command: <code>platform project:set-remote {{ `{{< variable "PROJECT_ID" >}}` | .Page.RenderString }}</code>.
- The [Platform.sh CLI](/administration/cli/_index.md).