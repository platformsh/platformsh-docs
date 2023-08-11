---
title: Classification data
description: Platform.sh allows you to send classification data to your backend system through HTTP headers to spot malicious IP addresses.
weight: 3
---

To help spot malicious IP addresses, Platform.sh sends classification data to your backend system through the following HTTP headers.

| HTTP header          | Type    | Description                                                                                               |
| -------------------- | ------- | --------------------------------------------------------------------------------------------------------- |
| `Client-Cdn`         | string  | When a CDN that is supported by Platform.sh is used, this header displays its name (Fastly, Cloudflare, or Cloudfront). |     
| `Client-Country`     | string  | The two-character ISO 3166-1 country code of the end-client IP (after CDN handling for the CDNs that Platform.sh supports).<BR/> The geolocation data sent through this header is provided by [MaxMind GeoLite2](https://dev.maxmind.com/geoip/geolite2-free-geolocation-data).|
| `Client-Abuse-Score` | integer | The abuse score of the end-client IP. A score >= 100 indicates a near certainty that the request comes from an abusive IP. <BR/> The abuse data sent through this header is provided by [AbuseIPDB](https://www.abuseipdb.com/). |
| `Client-Asn`         | integer | The Autonomous System number of the end-client IP. <BR/> The geolocation data sent through this header is provided by [MaxMind GeoLite2](https://dev.maxmind.com/geoip/geolite2-free-geolocation-data).|
