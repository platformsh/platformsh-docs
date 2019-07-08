# Import your own code

## Configure services

In the previous step, you created a collection of empty configuration files that have given your project the following structure:

```.
├── .platform
│   ├── routes.yaml
│   └── services.yaml
├── .platform.app.yaml
└── < application code >
```

Now you will need to include information that will tell Platform.sh how you want your application to connect to its [services](/configuration/services.md). An example `.platform/services.yaml` will look something like this:

`.platform/services.yaml`

{% codesnippet "https://raw.githubusercontent.com/platformsh/language-examples/master/.platform/services.yaml", language="yaml" %}{% endcodesnippet %}

If you're application does not use any services at this point, you can leave it blank, but it must exist in your repository to run on Platform.sh. If your application does use a database or other services, you can configure them with the following attributes:

* `name`: Provide a name for the service, so long as it is alphanumeric. If your application requires multiple services of the same type (i.e., three MySQL databases), make sure to give them different names so that your data from one service is never overwritten by another (i.e., `mysqldb1`, `mysqldb2`, `mysqldb3`).

* `type`: This specifies the service type and its version using the format `type:version`. Consult the table below that lists all Platform.sh maintained services, along with their `type` and supported `version`s. The links will take you to each service's dedicated page in the documentation.

<div>
  <table id="servicesTable" border="1">
  <tbody></tbody>
  </table>
</div>

<script>
makeImagesTable("services", "supported", "servicesTable");
</script>

* `disk`: The `disk` attribute configures the amount of persistent disk that will be allocated between all of your services. Projects by default are allocated 5 GB (5120 MB), and that space can be distributed across all of your services.

> Each language and framework may have additional attributes that you will need to include in `.platform/services.yaml` depending on the needs of your application. To find out what else you may need to include to configure your services, consult
>
> * **The [Services](/configuration/services.md) documentation for Platform.sh**
>
>    The documentation goes into far more extensive detail of which attributes can also be included for service configuration, and should be used as your primary reference.  
>
> * **Language-specific templates for Platform.sh Projects**
>
>    Compare the `.platform/services.yaml` file from the simple template above to other templates when writing your own.


Platform.sh provides _managed services_, and each service comes with considerable default configuration that you will not have to include yourself in `.services.yaml`. Next,
you will next need to tell Platform.sh how to build and deploy your application using the `.platform.app.yaml` file.

<div class="buttons">
  <a href="#" class="prev-link button-link">Back</a>
  <a href="#" class="next-link button-link">I have configured my services</a>
</div>
