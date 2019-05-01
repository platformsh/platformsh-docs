

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

Now you will need to include information that will tell Platform.sh how you want your application to connect to its [services](/configuration/services.md). An example `.platform/services.yaml` will always look something like this:

`.platform/services.yaml`

{%- codetabs name="Python", type="py", url="https://raw.githubusercontent.com/platformsh/template-python3/master/.platform/services.yaml" -%}

{% language name="PHP", type="php", url="https://raw.githubusercontent.com/platformsh/template-php/master/.platform/services.yaml" -%}

{% language name="Go", type="js", url="https://raw.githubusercontent.com/platformsh/template-golang/master/.platform/services.yaml" -%}

{%- endcodetabs %}

If you're application does not use any services at this point, you can leave it blank, but it must exist in your repository to run on Platform.sh. If your application does use a database or other services, you can configure them with the following attributes:

* **Name**

  Provide a name for the service, so long as it is alphanumeric. If your application requires multiple services of the same type (i.e., three MySQL databases), make sure to give them different names so that your data from one service is never overwritten by another (i.e., `mysqldb1`, `mysqldb2`, `mysqldb3`). 
  
  This name will be used again to connect your services to the application in the `.platform.app.yaml` file.

* **Type**

  The service `type` specifies the service type and its version using the format `type:version`. Make sure to use an available version of the service type, or else you will receive an error when you try to build your project.
  
  The services supported by Platform.sh can be found in the [Services documentation](/configuration/services.md), with individual pages lists in the sidebar. Check the page of the service you want to configure for your application, and you will find supported versions and examples for how to connect that service with a particular language in the "Usage example" section.
  

* **Disk**

  The `disk` attribute configures the amount of persistent disk that will be allocated between all of your services. Projects by default are allocated 5 GB (5120 MB), and that space can be distributed across all of your services.
 
> Each language and framework may have additional attributes that you will need to include in `.platform/services.yaml` depending on the needs of your application. To find out what else you may need to include to configure your services, consult
> 
> * **The [Services](/configuration/services.md) documentation for Platform.sh**
>
>    The documentation goes into far more extensive detail of which attributes can also be included for service configuration, and should be used as your primary reference.  
> 
> * **Language-specific templates for Platform.sh Projects** 
>
>    Compare the `.platform/services.yaml` file from the simple template above to other templates when writing your own.


Now that you have configured your project's services, you will next need to tell Platform.sh how to build and deploy your application using the `.platform.app.yaml` file.
  

<html>
<head>
<link rel="stylesheet" href="/styles/styles.css">
</head>
<body>

<br/><br/>

<center>

<a href="/gettingstarted/own-code/step-5.html" class="buttongen small">Back</a>
<a href="/gettingstarted/own-code/step-7.html" class="buttongen small">I have configured my services</a>

</center>

<br/><br/>

</body>
</html>
