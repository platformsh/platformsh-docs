# SSL Configuration

SSL certificates both for the origin and for Platform.sh provided CDNs are configured via support ticket. You must provide the certificate, the unencrypted private key, and the necessary certificate chain supplied by your SSL provider. These should be placed in your application's `private` directory.

## Origin

Platform.sh Enterprise supports a single SSL certificate on the origin. Support for multiple certificates is offered only through a CDN such as CloudFront or Fastly. Self-signed certificates can optionally be used on the origin for development purposes or for enabling SSL between the CDN and origin.

## CloudFront

All SSL certificates used with CloudFront MUST be 2048 bit certificates.  Larger sizes will not work.

