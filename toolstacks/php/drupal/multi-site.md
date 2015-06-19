#Multi-Site Drupal Projects

platform.sh supports running multiple applications in the same project
https://docs.platform.sh/reference/platform-app-yaml-multi-app.html but these 
would be separate Drupal instances (they could share the same database), they 
will have their assets separate and live their lives apart.

Also the same Drupal Instance can use multiple databases (just add multiple
instances to services.yaml)

And of course platform.sh supports the domain access as it supports anything 
Drupal.

If the multiple sites are part of the same project this makes sense.

But it makes no sense running truly different websites under the same project, 
you'd be missing on everything platform has to offer.