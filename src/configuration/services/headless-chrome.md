# Headless Chrome

Headless Chrome is a headless browser that is useful for automated testing. 

## Supported versions

* 73

## Relationship

The format exposed in the `$PLATFORM_RELATIONSHIPS` [environment variable](/development/variables.md#platformsh-provided-variables):

```yaml
{
  "service": "chrome",
  "ip": "169.254.221.236",
  "hostname": "uvqac3sgdovvx4zd6u5szwi244.chrome.service._.eu-3.platformsh.site",
  "cluster": "kb6sjxhpo4bwa-master-7rqtwti",
  "host": "chrome.internal",
  "rel": "http",
  "scheme": "http",
  "type": "chrome-headless:73",
  "port": 9022
}
```


## Usage example

In your `.platform/services.yaml`:

```yaml
chrome:
  type: chrome-headless:73
```

In your `.platform.app.yaml`:

```yaml
relationships:
    chrome: "chrome:http"
```

You can then use the service in a configuration file of your application with something like:


