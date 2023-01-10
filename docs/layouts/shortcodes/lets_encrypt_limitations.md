Let's Encrypt has a limit of 100 hostnames per certificate and 64 character per hostname.
Each of your environments can have 1 Let's Encrypt certificate.
If you define both a `{default}` and `www.{default}` route for each domain you use, you have a limit of 50 hostnames.
Adding more than that results in a warning on deploy and no new TLS certificates are issued.
