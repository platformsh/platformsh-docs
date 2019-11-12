## Global Application Cache (Dual-CDN)

A common configuration we recommend is to split CDN traffic between Fastly for dynamic content and CloudFront for static content, branded as our Global Application Cache.  Fastly offers far greater flexibility while CloudFront offers a better cost-per-megabyte.  However, this configuration requires application-level changes to ensure generated asset URLs point to the CloudFront CDN.  While Platform.sh provides recommendations for major applications on how to configure them accordingly, doing so is the customer's responsibility.

The Global Application Cache is only available to Platform.sh Enterprise plans.

The basic procedure to take advantage of the Global Application Cache requires some application development on your end in order to serve assets (and only assets) from a different subdomain (`assets.example.com`) whereas your site’s HTML will be served from `www.example.com`. This method gains you the flexibility of Fastly for your dynamic content but maintains our favorable cost relationship with CloudFront to serve the often heavier static assets.  Take into account that you typically don’t want to serve your HTML over the asset CDN subdomain.  This is a built in feature of some open source software, such as the Drupal CDN module, but requires planning on the part of your application development team if your framework doesn’t support this natively.

The default bandwidth limits included in your Enterprise plan are 100GB for the dynamic bandwidth (Fastly) and 1TB for assets (CloudFront).  This is more than enough to serve most applications in our experience, but obviously this is heavily dependent on traffic and content of your application.
