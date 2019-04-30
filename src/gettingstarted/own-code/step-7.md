
# Import your own code

## Configure application

Revisiting the structure of your project,
    
```.
├── .platform
│   ├── routes.yaml
│   └── services.yaml
├── .platform.app.yaml
└── < application code >
```

you will next need to include information that will tell Platform.sh how you want your [application](/configuration/app-containers.md) to behave each time it is built and deployed on Platform.sh in your `.platform.app.yaml` file. An example `.platform.app.yaml` looks like this:

`.platform.app.yaml`

{% codetabs name="PHP", type="php", url="https://raw.githubusercontent.com/platformsh/template-php/master/.platform.app.yaml" -%}

{%- language name="Go", type="js", url="https://raw.githubusercontent.com/platformsh/template-golang/master/.platform.app.yaml" -%}

{%- language name="Python", type="py", url="https://raw.githubusercontent.com/platformsh/template-python3/master/.platform.app.yaml" -%}

{%- endcodetabs %}


The `.platform.appl.yaml` file is extremely flexible, and can contain many lines with very fine-grained control over your application or very few general requirements. At the very least, Platform.sh requires four principle attributes in this file to control your builds:

* **Name**

  One of the required attributes in this file is its `name`. The `name` of your application container does not have to be the same as your project name, and you can in most single application cases simply name it `app`. If you are trying to to deploy microservices with multiple applications, the only constraint is that each of these application names must be unique. You should notice in the next step, when you configure how requests are handled in `.platform/routes.yaml` that `name` is reused there, and it is important that they are the same.

* **Type**

  The `type` attribute in `.platform.app.yaml` sets the container base image for the application, and sets the primary language. In general, `type` should have the form
  
  ```yaml
  type: <language>:<version>
  ```

  Set `<version>` to a version supported by Platform.sh, which you can find in the documentation under each language:
  
  * [PHP supported versions](/languages/php.md#supported-versions)
  * [Python supported versions](/languages/python.md#supported-versions)
  * [Node.js supported versions](/languages/nodejs.md#supported-versions)
  * [Ruby supported versions](/languages/ruby.md#supported-versions)
  * [Go supported versions](/languages/go.md#supported-versions)
  * [Java supported versions](/languages/java.md#supported-versions)

* **Disk**

  The `disk` attribute
  
* **Instance (`web`/`worker`)**
  
> Each language and framework may have additional attributes that you will need to include in `.platform.app.yaml` depending on the needs of your application. To find out what else you may need to include to configure your application, consult
> 
> * **The [Application](/configuration/app-containers.md) documentation for Platform.sh**
>    The documentation goes into far more extensive detail of which attributes can also be included for application configuration, and should be used as your primary reference.
>    
> * **Language-specific templates for Platform.sh Projects** 
>    Compare the `.platform.app.yaml` file from the simple template above to other templates when writing your own.

Now that you have configured your application, you will next need to handle HTTP requests to your application using the `.platform/routes.yaml` file.

<html>
<head>
<link rel="stylesheet" href="/styles/styles.css">
</head>
<body>

<br/><br/>

<center>

<a href="/gettingstarted/own-code/step-6.html" class="buttongen small">Back</a>
<a href="/gettingstarted/own-code/step-8.html" class="buttongen small">I have configured my application</a>

</center>

<br/><br/>

</body>
</html>
