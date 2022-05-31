For example, to use `pipenv` to manage requirements and a virtual environment, add the following:

   ```yaml {location=".platform.app.yaml"}
   dependencies:
       python3:
           pipenv: "2022.5.2"

   hooks:
       build: |
          pipenv install --system --deploy
   ```
