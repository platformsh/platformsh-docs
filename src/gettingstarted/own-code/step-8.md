
# Import your own code

## Configure routes

The final configuration file you will need to modify in your repository is the `.platform/routes.yaml` file.
    
```.
├── .platform
│   ├── routes.yaml
│   └── services.yaml
├── .platform.app.yaml
└── < application code >
```

A simple template `.platform/routes.yaml` for all languages will look very similar:

{% codetabs name="PHP", type="php", url="https://raw.githubusercontent.com/platformsh/template-php/master/.platform/routes.yaml" -%}

{%- language name="Go", type="js", url="https://raw.githubusercontent.com/platformsh/template-golang/master/.platform/routes.yaml" -%}

{%- language name="Python", type="py", url="https://raw.githubusercontent.com/platformsh/template-python3/master/.platform/routes.yaml" -%}

{%- endcodetabs %}

> Each language and framework may have additional attributes that you will need to include in `.platform/routes.yaml` depending on the needs of your application. To find out what else you may need to include to configure your routes, consult
> 
> * **The [Routes](/configuration/services.md) documentation for Platform.sh**
>    The documentation goes into far more extensive detail of which attributes can also be included for route configuration, and should be used as your primary reference.   
> * **Language-specific templates for Platform.sh Projects** 
>    Compare the `.platform/routes.yaml` file from the simple template above to other templates when writing your own.

<html>
<head>
<link rel="stylesheet" href="/styles/styles.css">
</head>
<body>

<br/><br/>

<center>

<a href="/gettingstarted/own-code/step-7.html" class="buttongen small">Back</a>
<a href="/gettingstarted/own-code/step-9.html" class="buttongen small">I have configured my routes</a>

</center>

<br/><br/>

</body>
</html>
