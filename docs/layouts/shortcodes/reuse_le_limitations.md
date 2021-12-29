Let's Encrypt has a limit of 100 TLS certificates per environment.
If you define both a `{default}` and `www.{default}` route for each domain you use, that will give you a limit of 50 domains.
Adding more than that will result in a warning on deploy and some domains will not be issued a TLS certificate.

