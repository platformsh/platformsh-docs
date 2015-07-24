#DRAFT
#Multitple Drupal  sites in a single Project

Platform.sh supports running [multiple applications in the same project](/user_guide/reference/platform-app-yaml-multi-app.html) 
and these can be two or more Drupal site. But, they would be separate Drupal 
instances , they will have their assets separate and live their lives apart and 
it would be much better for them not to share the same database (though they 
could).

Note, that the same Drupal Instance can also use multiple databases (just add 
multiple instances to services.yaml and use  db_select) you will need to 
override settings.php [as described here](customizing-settings-php.html) and
add the other databases you could then use `db_select` to switch between those.

# Old Style "Mutli-Site" and Platform.sh

It makes no sense running truly different websites under the same project, 
you'd be missing out on everything platform has to offer - moving fast, and 
safely testing things in isolation.

And because of the dynamic nature of the domain names that are created for
the different environments, it would result in a fragile hacky thing.

As such please consider Platform.sh does not support running "vanilla/old-style"
 multi-site (using different sub-directories such as `sites/sub.example.com/`).

##Using Domain Access
Of course Platform.sh supports the domain access as it supports anything 
Drupal.

If the multiple sites are part of the same project this makes sense.

Because of the dynamic nature of routes in Platform.sh you will need to implement
some logic (here you would replace MYMODULE with a convenient name of your own
and include it in your custom modules for your Drupal installation).

```php
/**
 * Implements hook_domain_default_domains().
 */
function MYMODULE_domain_default_domains() {
  $domains = array();
  $domains['wipe-domain-tables'] = 'wipe-domain-tables';

  $routes = (array) json_decode(base64_decode(getenv('PLATFORM_ROUTES')));

  if (!empty($routes) && is_array($routes)) {
    $weight = -1;
    foreach ($routes as $url => $route) {
      if (
        $route->upstream == 'drupal'
        && preg_match('/^(https?):\/\/([a-z0-9\.-]+)\/$/', $url, $matches)
        && preg_match('/^https?:\/\/([a-z]+).{default}\/$/', $route->original_url, $matches2)
      ) {
        $scheme = $matches[1];
        $domain_name = $matches[2];
        $machine_name = $matches2[1];

        $domains[$machine_name] = array(
          'subdomain' => $domain_name,
          'sitename' => MYMODULE_get_sitename($machine_name),
          'scheme' => $scheme,
          'valid' => 1,
          'weight' => $weight++,
          'is_default' => ($machine_name == 'www' ? 1 : 0),
          'machine_name' => $machine_name,
        );
      }
    }
  }

  return $domains;
}
```