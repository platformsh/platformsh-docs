# Going Live

## Preliminary Steps

Before you take your site live, there are a few steps that will help you prepare the project.

1. **Register your domain**

    Register your domain with a registrar that allows you to use [CNAMEs](/golive/steps/dns.md) for your domain. Make sure to do this before moving on to the next steps, as the CLI will reject attempts to add domains that do not allow CNAMEs.

2. **Test your routes**

    Test your application and make sure that all of your routes are functioning as you intended. Consult the [routes]() documentation as well to verify that your `routes.yaml` has been properly written.

    If any [access restrictions](/administration/web/configure-environment.md#http-access-control) have been enabled during development, be sure to remove them as well.

3. **(Optional) Obtain 3rd party SSL if needed**

    Let's Encrypt SSL certificates are automatically issued for Platform.sh projects at no charge to you. If you instead would like to use a [3rd party SSL certificate](/golive/steps/tls.md), make sure that you have purchased it and that it is active prior to going live. 

    Additionally, if your application uses [wildcard routes](/golive/steps/tls.md), it will require custom certificates for them, as Let's Encrypt does not support wildcard certificates.

After you have gone through the following checklist your application is ready to be taken live!

<div id = "buttons"></div>

<script>
    var navNextText = "I'm ready to go live";
    var navButtons = {type: "navigation", prev: getPathObj("prev"), next: getPathObj("next", navNextText), div: "buttons"};
    makeButton(navButtons);
</script>
