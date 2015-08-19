# Configure Solr core

You can add a `core_config` key in the configuration of Solr.

Here is an example of a Solr configuration in your `.platform/services.yaml` file:

```yaml
solr:
    type: solr:4.10
    configuration:
        core_config: !archive "<directory>"
```

The `directory` parameter points to a directory in the Git repository, relative to the `.platform/services.yaml` file. 

This directory needs to contain everything that Solr 4.10 needs to start a core. At the minimum, `solrconfig.xml` and `schema.xml`. 

## Default

When unspecified, our default configuration is based on what Drupal generally expects (the content is equivalent to the attached `config.tar.gz`).