---
title: Set up a database migration
sidebarTitle: "Handle migrations"
description: Go through the steps required to prepare database migrations.
weight: -50
---

If your project includes a database, you need to set up an initial migrations for it.

To do so, {{% vendor/name %}} recommends using [Flask-Migrate](https://flask-migrate.readthedocs.io/en/latest/).
If you've generated your Flask app using Cookiecutter,
your app uses Flask-Migrate by default to handle database migrations.

Otherwise, to install Flask-Migrate, run the following command:

```bash {location="Terminal"}
pip install Flask-Migrate
```

After you've installed Flask-Migrate, you need to set up a temporary local environment and allow it to access your database,
so you can run the `migrate` command successfully.

Follow these steps:
   
1. To set up a local environment where your project can run, run the following command:

   ```bash {location="Terminal"}
   python3 -m venv env && source venv/bin/activate
   ```

2. To upgrade `pip` and install your requirements, run the following commands:

   ```bash {location="Terminal"}
   pip install –upgrade pip
   pip install -r requirements.txt
   ```

4. Your database was automatically created and deployed when you first pushed your changes to {{% vendor/name %}}.
   To allow your virtual environment to communicate with your database, run the following command:

   ```bash {location="Terminal"}
   platform tunnel:open -y
   ```

   An SSH tunnel to all the services for your app is open.

5. To successfully establish communication between your local environment and your services,
   you need to set more environment variables.</br>
   To do so, add the following line to your `{{% vendor/configfile "app" %}}` file:

   ```yaml {configFile="app"}
   export PLATFORM_RELATIONSHIPS="$(platform tunnel:info --encode)"
   ```
  
   The {{% vendor/name %}} [$PLATFORM_RELATIONSHIPS variable](/development/variables/use-variables.md#use-provided-variables)
   allows you to retrieve information about services and their credentials,
   while `platform tunnel` generates that same data locally. 

6. To set other required variables, add the following lines:

   ```yaml {configFile="app"}
   export PLATFORM_ENVIRONMENT_TYPE=production
   export PORT=8888
   export PLATFORM_PROJECT_ENTROPY=$(openssl rand -base64 32)
   ```

7. To complete the setup of all the required environmental variables in your current shell,
   run the following command:

   ```bash {location="Terminal"}
   source ./.environment
   ```

8. To instruct Flask-migrate to initiate the migration directory,
   prepare for the `migrate` command, and generate your migrations,
   run the following commands:

   ```bash {location="Terminal"}
   flask db init 
   flask db migrate
   ```

9. To commit your migrations, run the following commands:

   ```bash {location="Terminal"}
   git add migrations/*
   git commit -m "Adds migrations"
   ```

10. If you want future migration changes to be automatically applied,
    instruct {{% vendor/name %}} to run the Flask-migrate `upgrade` command whenever your app is deployed.</br>
    To do so, customize your [deploy hook](/create-apps/hooks/hooks-comparison.html#deploy-hook) again.
    Locate the section dedicated to it:

    ```yaml {configFile="app"}
    # The deploy hook is run after the app container has been started, but before it has started accepting requests.
    # More information: https://docs.upsun.com/create-apps/hooks/hooks-comparison.html#deploy-hook
    deploy: |
        set -eux
        npm run build
    ```
    
    Add `flask db upgrade`:

    ```yaml {configFile="services"}
    deploy: |
        set -eux
        npm run build
        flask db upgrade        
    ```

11. To commit and push your changes, run the following commands:

    ```bash {location="Terminal"}
    git add .platform.app.yaml
    git commit -m "Adds flask db upgrade to deploy hook"
    platform environment:push -y
    ```

    Your Flask app is now fully deployed on {{% vendor/name %}}.