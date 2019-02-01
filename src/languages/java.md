# Java

Platform.sh supports the deployment of some Java applications. 

## Supported images

* 8

## WSGI-based configuration

Configure the `.platform.app.yaml` file with a few key settings as listed below.

1. Specify the language of your application (available versions are listed above):

   ```yaml
   # .platform.app.yaml
   type: "java:8"
   ```
