---
title: "Web Application Firewall (WAF)"
weight: 15
sidebarTitle: "WAF"
description: |
    Enterprise and Elite projects on Platform.sh come with a Web Application Firewall (WAF) at no additional cost, which monitors requests to your application and blocks suspicious requests according to our ruleset. WAFs can be an important line of defense against well-known exploit vectors, and Platform.sh maintains an extensive ruleset for protecting gateway hosts against malicious requests, such as distrubuted denial of service (DDoS) attacks and other known vulnerabilities in specific languages and frameworks.
tier:
  - Enterprise
  - Elite
---

{{< description >}}

## HTTP protocol attacks

Platform.sh's WAF implements a number of request filtering rules for common security vulnerabilities on the HTTP protocol, which are implemented either on the Gateway host or the nginx Router service. 

### Request smuggling

The [HTTP specification](https://tools.ietf.org/html/rfc2616) allows for two ways to define where a request ends within its header: Content-Length and Transfer-Encoding. Both can be used, but the specification additionally outlines that if both headers are present in a single request, Transfer-Encoding should be used over Content-Length. HTTP request smuggling occurs when

- the front end and back end services vary slightly in deciding when one header should be used over the other and determining the beginning and end of the same requests.
- a malicious agent is able to determine and exploit the fact that this disagreement exists, sending malicious requests that get parsed with legitimate requests.

When a malicious request header is mistakenly included as part of a legitimate (victim) request to the site instead of two separate requests, potentially circumventing that application's security methods and disclosing sensitive information in the process. The malicious request usually attempts to exploit end of message disagreement by including CRLF (carriage return and line feed) characters in the request header, which would typically be used to parse individual requests. 

#### Protection rules

The WAF monitors for requests that include a CRLF character or the word `http/\d`, in combination with an `HTTP` or `WEBDAV` method name, since the presence of these features indicate an attempt to inject a second request.

### Header injection

As a general class of security vulnerabilities, header injections occur when HTTP response headers are generated based on user input. An attacker is able to exploit the vulnerable cycle to include malicious content in an application's response headers to subsequent requests.

#### Protection rules

The WAF monitors for requests that include the carriage return (CR; `%0d`) and line feed (LF; `%0a`) characters so that data is not returned in a response header and interpreted by the client, similar to the [response splitting](/security/waf.html#protection-rules-2) and [request smuggling](/security/waf.html#protection-rules) protection rules. 

### Response splitting

Response splitting is enabled by the presence of header injection vulnerabilities. The standard HTTP request and response cycle results in a single HTTP response returned to a user for each HTTP request they place on the server. An HTTP response splitting attack occurs when an attacker modifies the data included in the HTTP response header. That malicious data can then be returned to a user placing subsequent requests. 

Depending on the characters an attack successfully adds to the response header (such as line feeds and carriage returns), an attacker may be able gain full control over the remaining headers and body of the application's responses. This level of control can give attackers the ability to create and return additional responses to legitimate user requests, hence the name response *splitting*. 

#### Protection rules

The WAF monitors for requests that include the carriage return (CR; `%0d`) and line feed (LF; `%0a`) characters. The presence of these characters indicate an attempt to inject data in the response header and potentially force intermediate proxy servers to treat the message as two separate responses. 

### HTTP Splitting

[Need some help with intro description here. Seems like much of the above, only specific to filename POSTs. Or Rewrites, but that seems specific to Apache/PHP?]

#### Protection rules

The WAF monitors for requests that include `\n` or `\r` characters in the `REQUEST_FILENAME` rewrite variable.

## HTTP protocol enforcement

On top of the above ruleset, the Platform.sh WAF implements a number of additional rules intended to enforce the HTTP protocol. 

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


## Framework and runtime specific protections

Platform.sh's WAF also included several protective rules specific to runtimes and commonly deployed frameworks, such as Drupal and Magento.

### Drupal

#### [SA-CORE-2018-002](https://www.drupal.org/sa-core-2018-002)

| Type:  | Remote code execution   |
|-----|-----|
| **Details:** |    Also known as Drupalgeddon2, a remote code execution vulnerability was found to exist within multiple subsystems of Drupal 7.x and 8.x, which could be exploited to completely compromise the site.   |
| **Rule(s):** | Suspicious requests are filtered based on parameter validation.  |

### Magento

#### [Magestore extension vulnerability (2019-SQLi)](https://magento.com/security/news/critical-vulnerability-magestore-store-locator-extension) 

| Type:  | SQL injection  |
|-----|-----|
| **Details:** | A critical vulnerability exists in the Magestore Store Locator extension, versions 1.0.2 and earlier. The exploit results in unauthorized access to sensitive information.   |
| **Rule(s):** | Suspicious requests are filtered by request path, in addition to query and body validation.  |

#### [PRODSECBUG-2347](https://magento.com/security/patches/magento-2.3.2-2.2.9-and-2.1.18-security-update-13)

| Type:  | Denial of Service  |
|-----|-----|
| **Details:** | Insufficient brute-forcing defenses in the token exchange protocol between Magento and payment processors could be abused in carding attacks.   |
| **Rule(s):** | Suspicious requests are filtered based on the request path, method, and certain headers. |

#### [PRODSECBUG-2198](https://magento.com/security/patches/magento-2.3.1-2.2.8-and-2.1.17-security-update)

| Type:  | SQL injection |
|-----|-----|
| **Details:** | An unauthenticated user can execute arbitrary code through an SQL injection vulnerability, which causes sensitive data leakage.   |
| **Rule(s):** | Suspicious requests are filtered based on the request path and query parameters. |

#### [PRODSECBUG-2403](https://magento.com/security/patches/magento-2.3.3-and-2.2.10-security-update)

| Type:  | Remote Code Execution |
|-----|-----|
| **Details:** | An unauthenticated user can insert a malicious payload through Page Builder template methods.  |
| **Rule(s):** | Suspicious requests are filtered based on the request path. |

#### [PRODSECBUG-2432](https://magento.com/security/security-update-potential-vulnerability-magento-admin-url-location)

| Type:  | Information Disclousure  |
|-----|-----|
| **Details:** | An issue has been discovered in Magento Open Source and Magento Commerce that can be used to disclose the URL location of a Magento Admin panel. While there is currently no reason to believe this issue would lead to compromise directly, knowing the URL location could make it easier to automate attacks. |
| **Rule(s):** | Suspicious requests are filtered based on parameter validation. |
