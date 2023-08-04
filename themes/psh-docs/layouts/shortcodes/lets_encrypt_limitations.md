Let's Encrypt allows a maximum of 100 hostnames per certificate and 64 characters per hostname.
You can have 1 Let's Encrypt certificate for each of your environments.
If you define both a `{default}` and a `www.{default}` route for each domain you use,
you can add up to 50 hostnames.
Going over this limitation results in a warning on deploy and no new TLS certificates are issued.