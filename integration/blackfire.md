Blackfire
=========

Platform.sh supports [Blackfire Profiler](https://blackfire.io/)
developed by [SensioLabs](http://sensiolabs.com/).

Get Started
-----------

**Sign up for free** at [blackfire.io](https://blackfire.io/signup), and
install the **Blackfire Companion** web browser extension
([Chrome](https://chrome.google.com/webstore/detail/blackfire-companion/miefikpgahefdbcgoiicnmpbeeomffld)).

Get your server credentials on your [Blackfire
account](https://blackfire.io/account/credentials).

![](/integration/images/blackfire-credentials.png)

> alt
>
> :   Blackfire credentials
>
Paste those credentials in your `.platform.app.yaml`:

``` {.sourceCode .console}
runtime:
  extensions:
    - name: blackfire
      configuration:
        server_id: "bad10394-bbaf-436e-9ee9-c6090cb45eb2"
        server_token: "692203ae8755da6b57b8161d3f20dd1be71502f77adebf3363d164033d74d29b"
```

Push your changes to your Platform environment to enable Blackfire:

``` {.sourceCode .console}
git add .platform.app.yaml
git commit -m "Enable Blackfire."
git push
```

Profile
-------

Access your site via your browser and click `Profile` in the Blackfire
Companion.

![](/integration/images/blackfire-companion.png)

> alt
>
> :   Blackfire companion
>
That's it, your site is being profiled and you should get all the
results in your Blackfire account.

