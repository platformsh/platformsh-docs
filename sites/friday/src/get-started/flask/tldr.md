---
title: Guide to deploying a Flask app on {{% vendor/name %}} TL;DR
description: The TL;DR - Step-by-Step version for deploying, and working with Flask on {{% vendor/name %}}.
---
## TL;DR Step-by-Step
`T:` - run the line in a terminal/command prompt

1. T: `pip3 install cookiecutter`
2. T: `cookiecutter https://github.com/cookiecutter-flask/cookiecutter-flask.git`
3. Answer questions
  1. Name
  5. Email
  6. Github_username
  7. Project name
  8. App name
  9. Description
  10. Pipenv
  11. Python version
  12. Node version
  13. heroku
14. Cd into directory (should be what you answered for 3.5)
15. T: `git init .`
16. T: `git branch -m main`
17. T: `{{% vendor/cli %}} project:init`
  1. Select Python
  19. Select Postgres
20. T: `git add .`
21. T: `git commit -m "init commit"`
22. T: `{{% vendor/cli %}} p:create`
23. Answer questions
  1. Choose your org
  25. Give it a title
  26. Choose a region
  27. Enter the branch name from #6
  28. Set the project as the remote (for now)
  29. Select Y to "continue"
30. Open `{{< vendor/configfile "app" >}}`
  1. Find the section describing "Variables"
  32. Uncomment `# variables` and the next line `env:`
  33. On the next line, add `FLASK_APP: autoapp.py`
  43. Find the section for `hooks:build`
  44. On the line before `pip install`, add the following:
      ```yaml {configFile="app"}
      pip install --upgrade pip
      npm install
      ```
  48. Scroll down to the `deploy` section
  49. On the line after `set -eux`, add
      ```yaml
      npm run build
      ```
  51. Find the section `web:commands:start` and change it to
      ```yaml {configFile="app"}
      start: flask run -p $PORT
      ```
  53. Below this find the section for `upstream:socket_family` and either comment out both lines, or change `unix` to `tcp`
54. T: `git add {{< vendor/configfile "app" >}}`
55. T: `git commit -m "adds FLASK_APP env var, adds mount for static builds, build commands, npm run build on deploy, web start command"`
56. Open `.environment` file
  1. Change `DATATABASE_URL` to: `postgresql://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_DATABASE}`
  58. Add the following lines to .environment:
      ```shell
         export SECRET_KEY="${PLATFORM_PROJECT_ENTROPY}"
         export FLASK_DEBUG=$( [ "${PLATFORM_ENVIRONMENT_TYPE}" = "production" ] && echo 0 || echo 1)
         export FLASK_ENV="${PLATFORM_ENVIRONMENT_TYPE}"
         export GUNICORN_WORKERS=1
         export LOG_LEVEL=$( [ "${PLATFORM_ENVIRONMENT_TYPE}" = "production" ] && echo "info" || echo "debug")
         # In production, set to a higher number, like 31556926
         export SEND_FILE_MAX_AGE_DEFAULT=$( [ "${PLATFORM_ENVIRONMENT_TYPE}" = "production" ] && echo 31556926 || echo 0)
      ```
66. T: `git add .enviornment`
67. T: `git commit -m "adds needed flask env vars"`
68. T: `{{% vendor/cli %}} e:push`
  1. Answer Y <-- push will fail, and is _expected_
70. T: `upsun resources:set`
  1. Set application to profile size `1`
  2. Set number of application instances to `1`
  3. Set postgresql profile size to `1`
  4. Set persistent disk for postgresql to `2048`
  5. Select `Y` to confirm choices
1. Find the section describing `mounts`
35. Uncomment `# mounts:`
36. On the next line add
      ```yaml {configFile="app"}
      "<name-of-your-app-from-3.5-above>/static":
        source: local
        source_path: static_build
      ```
37. T: `upsun resources:set --disk=<name-of-your-app-from-3.5-above>:1024`
38. Select `Y` to confirm changes to your application resources
71. T: `python3 -m venv env`
72. T: `source venv/bin/activate`
73. T: `pip install --upgrade pip`
74. T: `pip install -r requirements.txt`
75. T: `{{% vendor/cli %}} tunnel:open -y`
76. T: `export PLATFORM_RELATIONSHIPS="$({{% vendor/cli %}} tunnel:info --encode)"`
77. T: `export PORT=8888`
78. T: `export PLATFORM_PROJECT_ENTROPY=$(openssl rand -base64 32)`
79. T: `export PLATFORM_ENVIRONMENT_TYPE=production`
80. T: `source ./.environment`
81. T: `flask db init`
82. T: `flask db migrate`
83. Open `{{< vendor/configfile "app" >}}`
  1. Find the section for `hooks:deploy`
  85. On a new line after `npm run build`, add `flask db upgrade`
86. T: `git add migrations/*`
87. T: `git commit -m "adds migrations"`
88. T: `git add {{< vendor/configfile "app" >}}`
89. T: `git commit -m "adds flask db upgrade to deploy hook"`
90. T: `{{% vendor/cli %}} environment:push`

The above steps do not include setting up a local development environment, or switching to gunicorn as a web server.
