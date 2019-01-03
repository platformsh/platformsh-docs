# SSL in Production

Platform.sh fully supports using SSL certificate in production and strongly encourages all of our customers to do so. We do not charge for SSL support. We do not at this time issue our own SSL certificates but you can "bring your own" from the SSL issuer of your choice.

A BYO-certificate is not necessary for development environments. Platform.sh provides wildcard certificates that covers all \*.platform.sh domains, including development environments.

Platform.sh supports all kinds of certificates including domain-validated certificates, extended validation (EV) certificates, high-assurance certificates and wildcard certificates.

The information below is provided as a generic guide for generating and signing your own certificates. However, we strongly recommend consulting the documentation for your chosen SSL issuer.

## SSL/TLS

- Generate private key
- Use openssl to generate a new private key
- Generate CSR
- Submit CSR to SSL provider
- Subdomain
- Root domain
- Testing SSL
- Add / change certificate

## General SSL Information

Staging, and other development environments can use a wildcard certificate provided by Platform.sh.

Purchasing an SSL cert varies in cost and process depending on the vendor. Using SSL providers will require some or all of the following steps:

Generate private key Before requesting an SSL cert, you need to generate a private key in your local environment using the openssl tool. If you aren’t able to execute the openssl command from the terminal you may need to install it.

### Mac OS X

Your OS X installation should come with OpenSSL installed, but you might consider installing a more recent version using homebrew:
`brew install openssl`

### Windows

[Windows executable](http://slproweb.com/products/Win32OpenSSL.html)

### Ubuntu Linux

apt-get install openssl

## Use openssl to generate a new private key

When prompted, enter an easy password value as it will only be used when generating the CSR and not by your app at runtime.

```bash
openssl genrsa -des3 -out server.pass.key 2048
```

The private key needs to be stripped of its password so it can be loaded without manually entering the password.

```bash
openssl rsa -in server.pass.key -out server.key
```

You now have a `server.key` private key file in your current working directory.

## Generate CSR

A CSR is a certificate signing request and is also required when purchasing an SSL cert. Using the private key from the previous step, generate the CSR. This will require you to enter identifying information about your organization and domain.

Though most fields are self-explanatory, pay close attention to the following:

- Country Name: The two letter code, in ISO 3166-1 format, of the country in which your organization is based.

- Common Name: This is the fully qualified domain name that you wish to secure.

  - For a single subdomain: `www.example.com`
  - For all subdomains, specify the wildcard URL: `*.example.com`
  - For the root domain only: `example.com`

  The Common Name field must match the secure domain. You cannot purchase a certificate for the root domain, e.g. `example.com`, and expect to secure `www.example.com`. The inverse is also true. Each domain can have one certificate and it can be attached to the main domain or subdomain.

Generate the CSR:

```bash
openssl req -new -key server.key -out server.csr
```

The result of this operation will be a server.csr file in your local directory (alongside the server.key private key file from the previous step).

## Submit CSR to SSL provider

Next, begin the process of creating a new SSL certificate with your chosen certificate provider. This will vary depending on your provider, but at some point you will need to upload the CSR generated in the previous step.

You may also be asked for what web server to create the certificate. If so, select Nginx as the web server for use on Platform.sh. If Nginx is not an option, Apache 2.x will also suffice.

If you’re given an option of what certificate format to use (PKCS, X.509 etc…) choose X.509.

If you want to secure more than one subdomain you will need to purchase a wildcard certificate from your provider. While these certificates are typically more expensive, they allow you to serve requests for all subdomains of \*.example.com over SSL.

On completion of the SSL certificate purchase process you should have several files including:

- The SSL certificate for the domain specified in your CSR, downloaded from your certificate provider. This file will have either a .pem or .crt extension.
- The private key you generated in the first step, server.key.

Once you have the SSL certificate file and private key you are ready to configure SSL for your project.

## Use the Platform.sh Web Interface to add the certificate

You can also add your certificate via the Platform.sh [Web Interface](/administration/web.md). Just go to the [project configuration page](/administration/web/configure-project.md) in the web interface and click on Domains. If you already have a domain, you can edit the domain and then click on the Add SSL certificate button. You can then add your private key, public key certificate and optional certificate chain.

![UI configuration for SSL](/images/ui-ssl.png)

> **note**
> Private key should be in the old style, which means it should begin with BEGIN RSA PRIVATE KEY. If it starts with BEGIN PRIVATE KEY that means it is bundled with the identifier for key type. To convert it to the old style RSA key:
> openssl rsa -in private.key -out private.rsa.key

## Use the Platform.sh CLI to add the certificate

Example:

```bash
platform domain:add secure.example.com --cert=/etc/ssl/private/secure-example-com.crt --key=/etc/ssl/private/secure-example-com.key
```

Type `platform help domain:add` for more information.

## Subdomain

If you’re securing a subdomain, e.g., www.example.com, modify your DNS settings and create a CNAME record to the endpoint or modify the CNAME target if you already have a CNAME record.

Record Name Target

`CNAME www ENVIRONMENT-PROJECT-ID.REGION.platform.sh.`

If you’re using a wildcard certificate your DNS setup will look similar.

Record Name Target

`CNAME * ENVIRONMENT-PROJECT-ID.REGION.platform.sh.`

## Root domain

If you’re securing a root domain, e.g., example.com, you must be using a DNS provider that provides CNAME-like functionality at the zone apex.

Modify your DNS settings and create an ALIAS or ANAME record to the endpoint.

Record Name Target

ALIAS or ANAME empty or @
`ENVIRONMENT-PROJECT-ID.REGION.platform.sh`

In case you want to change an already added certificate, you will have to remove the domain and add it again with the new certificate.

## Testing SSL

Use a command line utility like curl to test that everything is configured correctly for your secure domain.

The -k option tells curl to ignore untrusted certificates.

```bash
$ curl -kvI https://www.example.com
About to connect() to www.example.com port 443 (#0)
Trying 50.16.234.21... connected
Connected to www.example.com (50.16.234.21) port 443 (#0)
SSLv3, TLS handshake, Client hello (1):
SSLv3, TLS handshake, Server hello (2):
SSLv3, TLS handshake, CERT (11):
SSLv3, TLS handshake, Server finished (14):
SSLv3, TLS handshake, Client key exchange (16):
SSLv3, TLS change cipher, Client hello (1):
SSLv3, TLS handshake, Finished (20):
SSLv3, TLS change cipher, Client hello (1):
SSLv3, TLS handshake, Finished (20):
SSL connection using AES256-SHA
Server certificate:
subject: C=US; ST=CA; L=SF; O=SFDC; OU=Heroku; CN=www.example.com
start date: 2011-11-01 17:18:11 GMT
expire date: 2012-10-31 17:18:11 GMT
common name: www.example.com (matched)
issuer: C=US; ST=CA; L=SF; O=SFDC; OU=Heroku; CN=www.heroku.com
SSL certificate verify ok.
> GET / HTTP/1.1
> User-Agent: curl/7.19.7 (universal-apple-darwin10.0) libcurl/7.19.7 OpenSSL/0.9.8r zlib/1.2.3
> Host: www.example.com
> Accept: */*
```

Pay attention to the output. It should print SSL certificate verify ok. If it prints something like common name: www.example.com (does not match 'www.somedomain.com') then something is not configured correctly.
