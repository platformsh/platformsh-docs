---
title: Fast-track guide to deploying a Flask app on {{% vendor/name %}}
sidebarTitle: Fast-track guide
sectionBefore: Bonus
description: The fast-track, step-by-step guide for deploying, and working with Flask on {{% vendor/name %}}.
---

Here are all the steps required to successfully generate a Flask app with Cookiecutter,
and deploy it on {{% vendor/name %}}.

`T:` Run the line in a terminal/command prompt

1. T: `pip3 install cookiecutter`
2. T: `cookiecutter https://github.com/cookiecutter-flask/cookiecutter-flask.git`
3. Follow the prompts to submit the following information:
   - Name
   - Email
   - GitHub username
   - Project name
   - App name
   - Description
   - Pipenv
   - Python version
   - Node version
   - Heroku
4. `cd` into project directory (`app_name` defined at step 3)
5. T: `git init .`
6. T: `git branch -m main`
7. T: `{{% vendor/cli %}} project:init`
8. Follow the prompts:
   - Select Python
   - Select your services
9. T: `git add .`
10. T: `git commit -m "Init commit"`
11. T: `{{% vendor/cli %}} p:create`
12. Follow the prompts:
    - Create or select your organization
    - Name your project
    - Choose a region
    - Enter the branch name defined at step 6
    - Set the project as the remote (for now)
    - Select `Y` to continue
13. Open `{{< vendor/configfile "app" >}}`
14. Find the section describing `variables`
15. Uncomment `# variables` and the `env:` line
16. Add the following configuration:

    ```yaml {configFile="app"}
    variables:
      env:
        FLASK_APP: autoapp.py
    ```
17. Find the section for `mounts`
18. Add the following configuration:

    ```yaml {configFile="app"}
    mounts:
      "app_name/static":
        source: "local"
        source_path: "static_assets"
    ```
19. Find the section for `hooks:build`
20. Add the following configuration:

    ```yaml {configFile="app"}
    hooks:
      build: |
        set -eux
        pip install --upgrade pip
        pip install -r requirements.txt
        npm install  
    ```
21. Find the section for `hooks:deploy`
22. Add the following configuration:
    ```yaml {configFile="app"}
       deploy:
         set -eux
         npm run build 
    ```
23. Find the section for `web:commands:start`
24. Add the following configuration:
    ```yaml {configFile="app"}
    web:
      commands:
        start: "flask run -p $PORT"
      upstream:
        socket_family: tcp
    ```
25. T: `git add {{< vendor/configfile "app" >}}`
26. T: `git commit -m "Adds FLASK_APP env var, adds mount for static builds, build commands, npm run build on deploy, web start command"`
27. Open your `.environment` file
28. Change `DATATABASE_URL` to: `your_service_type://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_DATABASE}`
29. Add the following lines to `.environment`:
    ```bash {location=".environment"}
        export SECRET_KEY="${PLATFORM_PROJECT_ENTROPY}"
        export FLASK_DEBUG=$( [ "${PLATFORM_ENVIRONMENT_TYPE}" = "production" ] && echo 0 || echo 1)
        export FLASK_ENV="${PLATFORM_ENVIRONMENT_TYPE}"
        export GUNICORN_WORKERS=1
        export LOG_LEVEL=$( [ "${PLATFORM_ENVIRONMENT_TYPE}" = "production" ] && echo "info" || echo "debug")
        # In production, set to a higher number, like 31556926
        export SEND_FILE_MAX_AGE_DEFAULT=$( [ "${PLATFORM_ENVIRONMENT_TYPE}" = "production" ] && echo 31556926 || echo 0)
    ```
30. T: `git add .environment`
31. T: `git commit -m "Adds needed flask env vars"`
32. T: `{{% vendor/cli %}} e:push`
33. Enter `Y`.<br/>
    **Expected failure on first push because you need to set resources.**
34. T: `upsun resources:set`
35. Follow the prompts:
    - Define a CPU/RAM combination for your application container
    - Define a number of instances for your application
    - Define a CPU/RAM combination for each of your service containers
    - Define persistent disk storage for each of your databases
    - Enter `Y` to confirm
36. T: `python3 -m venv env`
37. T: `source venv/bin/activate`
38. T: `pip install --upgrade pip`
39. T: `pip install -r requirements.txt`
40. T: `{{% vendor/cli %}} tunnel:open -y`
41. Open `{{< vendor/configfile "app" >}}`
42. Add the following variables:
    ```yaml {configFile="app"}
    export PLATFORM_RELATIONSHIPS="$({{% vendor/cli %}} tunnel:info --encode)"
    export PORT=8888
    export PLATFORM_PROJECT_ENTROPY=$(openssl rand -base64 32)
    export PLATFORM_ENVIRONMENT_TYPE=production
    ```
43. T: `source ./.environment`
44. T: `flask db init`
45. T: `flask db migrate`
46. Open `{{< vendor/configfile "app" >}}`
47. Find the section for `hooks:deploy`
48. Add the following configuration:
    ```yaml {configFile="app"}
    deploy: |
    set -eux
    npm run build
    flask db upgrade   
    ```
49. T: `git add migrations/*`
50. T: `git commit -m "Adds migrations"`
51. T: `git add {{< vendor/configfile "app" >}}`
52. T: `git commit -m "Adds flask db upgrade to deploy hook"`
53. T: `{{% vendor/cli %}} environment:push`

The above steps do not include [setting up a local development environment](/get-started/flask/local-development/_index.md),
or [switching to Gunicorn as a web server](/get-started/flask/web-servers.md).
