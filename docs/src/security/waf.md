---
title: Web application firewall (WAF)
sidebarTitle: WAF
description: |
    Enterprise and Elite projects on Platform.sh come with a Web application firewall (WAF) at no additional cost, which monitors requests to your application and blocks suspicious requests according to our ruleset. WAFs can be an important line of defense against well-known exploit vectors that can otherwise make an application vulnerable to malicious requests and distributed denial of service (DDoS) attacks.
tier:
  - Enterprise
  - Elite
---

{{% description %}}

## HTTP protocol attacks

Platform.sh's WAF implements a number of request filtering rules for common security vulnerabilities on the HTTP protocol. 

### Request smuggling

The [HTTP specification](https://tools.ietf.org/html/rfc2616) allows for two ways to define where a request ends within its header: `Content-Length` and `Transfer-Encoding`. Both can be used, but the specification additionally outlines that if both headers are present in a single request, `Transfer-Encoding` should be used over `Content-Length`. HTTP request smuggling occurs when

- the front end and back end services vary slightly in deciding when one header should be used over the other and determining the beginning and end of the same requests.
- a malicious agent is able to determine and exploit the fact that this disagreement exists, sending malicious requests that get parsed with legitimate requests in unintended ways.

When a malicious request header is mistakenly included as part of a legitimate (victim) request to the site instead of two separate requests, it could circumvent that application's security methods and disclose sensitive information in the process. The malicious request usually attempts to exploit this end of message disagreement by including CRLF (carriage return and line feed) characters in the request header, which would typically be used to parse individual requests.

{{< note title="Protection rules">}}
The WAF monitors for requests that include a CRLF character or the word `http/\d`, in combination with an `HTTP` or `WEBDAV` method name, since the presence of these features indicate an attempt to inject a second request.
{{< /note >}}

### Header injection

As a general class of security vulnerabilities, header injections occur when HTTP response headers are generated based on user input. An attacker is able to exploit the vulnerable cycle to include malicious content in an application's response headers to subsequent requests.

{{< note title="Protection rules">}}
The WAF monitors for header injection attempts that can occur via the payload and the header itself. Requests are blocked for those that contain the carriage return (CR; `%0d`) and line feed (LF; `%0a`) characters so that data is not returned in a response header and interpreted by the client, similar to the [response splitting](/security/waf.html#response-splitting) and [request smuggling](/security/waf.html#request-smuggling) protection rules. 

It will also monitor and detect newline characters in `GET` request argument values. 
{{< /note >}}

### Response splitting

Response splitting is enabled by the presence of header injection vulnerabilities. The standard HTTP request and response cycle results in a single HTTP response returned to a user for each HTTP request they place on the server. An HTTP response splitting attack occurs when an attacker modifies the data included in the HTTP response header. That malicious data can then be returned to a user placing subsequent requests. 

Depending on the characters added to the response header (such as line feeds and carriage returns), an attacker can create and return additional responses to legitimate user requests, hence the name response *splitting*. 

{{< note title="Protection rules">}}
The WAF monitors for requests that include the carriage return (CR; `%0d`) and line feed (LF; `%0a`) characters. The presence of these characters indicate an attempt to inject data in the response header and potentially force intermediate proxy servers to treat the message as two separate responses. 
{{< /note >}}

## HTTP protocol enforcement

On top of the above rule set, the Platform.sh WAF implements a number of additional rules intended to enforce the HTTP protocol. 

- **HTTP Request Line Format Enforcement**

    Request lines are validated against the HTTP RFC specification using rule negation with regex, which specifies the proper construction of URI request lines (such as `"http:" "//" host [":" port] [ abs_path ["?" query]]`). The incoming connection is terminated, and then the request reconstructed on the internal network, enforcing the valid format in transit.

- **GET or HEAD requests with a body are not allowed**

    The protocol allows for `GET` requests to have a body - while this is rarely used, attackers could try to force a request body on unsuspecting applications. When a `GET` request is detected, the WAF will check for the existence of the `Content-Length` and `Transfer-Encoding` headers. If either exist and the payload is either not 0 or not empty, then all body-related headers are stripped from those requests and then passed through otherwise unaltered. 

- **Disallow Content-Length and Transfer-Encoding Headers together**

    Requests [must not contain](https://tools.ietf.org/html/rfc7230#section-3.3.2) both a `Content-Length` and `Transfer-Encoding` header, as the presence of leaves applications vulnerable to [request smuggling](#request-smuggling). The WAF forces requests to use chunked transfer-encoding only on the internal network. 

- **Missing/Empty Host Headers**

    Route mapping is implemented based on host names. Because of this, requests are not relayed that do either do not include the host header, or if that header exists but is empty. 

- **File upload limit**

    File upload limits are enforced, but are configured by the application's configuration in `.platform.app.yaml` using the `max_request_size` attribute in [`web.locations`](../create-apps/app-reference.md#locations). Note that this limit is set by default at 250MB if not set to something different. 

- **File extension restriction**

    File extensions are restricted according to the application's configuration in `.platform.app.yaml` in `web.locations`. The root path, or a path beneath it, can be configured to allow only certain file extensions by defining [rules](../create-apps/app-reference.md#rules) for them using regular expressions.

- **Restricted HTTP headers**

    The following headers are disallowed: `Connection`, `Proxy-Authorization`, `TE`, `Upgrade`.

- **Backup/"working" file extension**

    Enforced by the WAF and configured by the user under [`web.locations`](../create-apps/app-reference.md#locations) using the `scripts` attribute where it can be disabled. [Regular expressions](../create-apps/app-reference.md#rules) can also be created to catch unwanted requests to script extensions.

- **Slowloris DoS attacks** 

    The Slowloris denial of service attack exploits partial HTTP requests, consuming large amounts of bandwidth by continuing to keep those connections open for as long as possible. Apache web servers are vulnerable to Slowloris attacks, but for nginx this is not the case. Since Platform.sh Router services use nginx processes, projects are protected against this kind of an attack. 

## Framework specific protections

Platform.sh's WAF also includes several protective rules for vulnerabilities found in commonly deployed frameworks, such as Drupal and Magento.

### Drupal

#### [SA-CORE-2018-002](https://www.drupal.org/sa-core-2018-002)

| Type:  | Remote code execution   |
|-----|-----|
| **Details:** |    Also known as Drupalgeddon2, a remote code execution vulnerability was found to exist within multiple subsystems of Drupal 7.x and 8.x, which could be exploited to completely compromise the site.   |
| **Rules:** | Suspicious requests are filtered based on parameter validation.  |

### Magento

#### [Magestore extension vulnerability (2019-SQLi)](https://web.archive.org/web/20210414043507/https://magento.com/security/news/critical-vulnerability-magestore-store-locator-extension)

| Type:  | SQL injection  |
|-----|-----|
| **Details:** | A critical vulnerability exists in the Magestore Store Locator extension, versions 1.0.2 and earlier. The exploit results in unauthorized access to sensitive information.   |
| **Rules:** | Suspicious requests are filtered by request path, in addition to query and body validation.  |

#### [PRODSECBUG-2347](https://magento.com/security/patches/magento-2.3.2-2.2.9-and-2.1.18-security-update-13)

| Type:  | Denial of Service  |
|-----|-----|
| **Details:** | Insufficient brute-forcing defenses in the token exchange protocol between Magento and payment processors could be abused in carding attacks.   |
| **Rules:** | Suspicious requests are filtered based on the request path, method, and certain headers. |

#### [PRODSECBUG-2198](https://magento.com/security/patches/magento-2.3.1-2.2.8-and-2.1.17-security-update)

| Type:  | SQL injection |
|-----|-----|
| **Details:** | An unauthenticated user can execute arbitrary code through an SQL injection vulnerability, which causes sensitive data leakage.   |
| **Rules:** | Suspicious requests are filtered based on the request path and query parameters. |

#### [PRODSECBUG-2403](https://magento.com/security/patches/magento-2.3.3-and-2.2.10-security-update)

| Type:  | Remote Code Execution |
|-----|-----|
| **Details:** | An unauthenticated user can insert a malicious payload through Page Builder template methods.  |
| **Rules:** | Suspicious requests are filtered based on the request path. |

#### [PRODSECBUG-2432](https://magento.com/security/security-update-potential-vulnerability-magento-admin-url-location)

| Type:  | Information Disclosure  |
|-----|-----|
| **Details:** | An issue has been discovered in Magento Open Source and Magento Commerce that can be used to disclose the URL location of a Magento Admin panel. While there is currently no reason to believe this issue would lead to compromise directly, knowing the URL location could make it easier to automate attacks. |
| **Rules:** | Suspicious requests are filtered based on parameter validation. |
