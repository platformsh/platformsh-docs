---
title: "Web Application Firewall (WAF)"
weight: 15
sidebarTitle: "Enterprise WAF"
description: |
    Enterprise projects on Platform.sh come with a Web Application Firewall at no additional cost, which monitors requests to your application and blocks suspicious requests according to our ruleset.
tier:
  - Enterprise
---

{{< description >}}

WAFs can be an important first line of defense against well-known exploit vectors, and Platform.sh maintains an extensive ruleset for protecting gateway hosts against malicious requests, such as distrubuted denial of service (DDoS) attacks as well as more specific protections for particular languages and frameworks. The full ruleset is listed in the tables below split by type.

## General protections

### Protocol enforcement

| sfdg |  sfdg | sfdg  | sfdg  |
|------|------|------|------|
|   HTTP Request Line Format Enforcement   | LOREM | IPSUM | SOMETHING |
|   GET or HEAD requests without Body are not allowed   | LOREM | IPSUM | SOMETHING |
|   Disallow Content-Length and Transfer-Encoding Headers together   | LOREM | IPSUM | SOMETHING |
|   Missing/Empty Host Headers  | LOREM | IPSUM | SOMETHING |
|   File upload limit  | LOREM | IPSUM | SOMETHING |
|   File extension restriction   | LOREM | IPSUM | SOMETHING |
|   Restricted HTTP headers   | LOREM | IPSUM | SOMETHING |
|   Backup/"working" file extension   | LOREM | IPSUM | SOMETHING |

### Protocol attack

| sfdg |  sfdg | sfdg  | sfdg  |
|------|------|------|------|
| HTTP request smuggling | LOREM | IPSUM | SOMETHING |
| HTTP response splitting | LOREM | IPSUM | SOMETHING |
| HTTP header injection | LOREM | IPSUM | SOMETHING |
| HTTP splitting | LOREM | IPSUM | SOMETHING |

## Framework and runtime specific protections

### Drupal

| Vector |  Type |  Details | Enterprise WAF rule(s) |
|------|------|------|------|
|   [SA-CORE-2018-002](https://www.drupal.org/sa-core-2018-002)   | Remote Code Execution | Also known as Drupalgeddon2, a remote code execution vulnerability was found to exist within multiple subsystems of Drupal 7.x and 8.x, which could be exploited to completely compromise the site. | Suspicious requests are filtered based on parameter validation.  |  

### Magento

| Vector |  Type |  Details | Enterprise WAF rule(s) |
|------|------|------|------|
|  [Magestore extension vulnerability (2019-SQLi)](https://magento.com/security/news/critical-vulnerability-magestore-store-locator-extension)  | SQL injections | A critical vulnerability exists in the Magestore Store Locator extension, versions 1.0.2 and earlier. The exploit results in unauthorized access to sensitive information. | Suspicious requests are filtered by request path, in addition to query and body validation.  |
|  [PRODSECBUG-2347](https://magento.com/security/patches/magento-2.3.2-2.2.9-and-2.1.18-security-update-13)  | Denial of Service | 	Insufficient brute-forcing defenses in the token exchange protocol between Magento and payment processors could be abused in carding attacks. | Suspicious requests are filtered based on the request path, method, and certain headers. |
| [PRODSECBUG-2198](https://magento.com/security/patches/magento-2.3.1-2.2.8-and-2.1.17-security-update) | SQL injections | An unauthenticated user can execute arbitrary code through an SQL injection vulnerability, which causes sensitive data leakage.  | Suspicious requests are filtered based on the request path. |
| [PRODSECBUG-2403](https://magento.com/security/patches/magento-2.3.3-and-2.2.10-security-update) | Remote Code Execution | An unauthenticated user can insert a malicious payload through Page Builder template methods. | Suspicious requests are filtered based on the request path and query parameters. |
| [PRODSECBUG-2432](https://magento.com/security/security-update-potential-vulnerability-magento-admin-url-location) | 	Information Disclousure | An issue has been discovered in Magento Open Source and Magento Commerce that can be used to disclose the URL location of a Magento Admin panel. While there is currently no reason to believe this issue would lead to compromise directly, knowing the URL location could make it easier to automate attacks. | Suspicious requests are filtered based on parameter validation. |
