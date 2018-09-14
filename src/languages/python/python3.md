# How to run Python 3 in the build hook of a non-Python application

This method of running Python 3 in non-Python applications should only be used [in an application's build hook](/configuration/app/build.md#build-hook) when Python 3 is necessary to build or configure your application (e.g. pre-compiling static files). If you need a full Python application to run alongside another type of application (PHP, Node.js, etc.), you should deploy it as part of a [multi-application project](/configuration/app/multi-app.md).

The version of Python 3 [distributed with the most recent release of Debian](https://wiki.debian.org/Python#Supported_Python_Versions) is available in the build hook of non-Python applications. However, packages cannot be installed directly in the distribution's `site-packages` folder, so using Python 3 will require creating a virtual environment for package installation.

At the top level of your application (where `.platform.app.yaml` is located), create a file called `python3.sh`, and paste in the following contents:

```shell
#!/bin/dash

unset PIP_USER

# Create a virtual environment for running Python 3 and installing packages
python3 -m venv py3-venv --system-site-packages --without-pip

# Source the activation file to activate the virtual environment
. py3-venv/bin/activate

# Install pip using the standard pip bootstrapping script
curl https://bootstrap.pypa.io/get-pip.py -o get-pip.py
python3 get-pip.py
```

To create and access the virtual environment, source the file in your build hook. From there, you can install Python 3 dependencies with `pip3`:

```yaml
hooks:
    build: |
      set -e

      # Source the python3.sh venv creation script
      . ./python3.sh

      # Usage examples:

      # Install dependencies using pip3 and a requirements.txt file:
      pip3 install -r requirements.txt

      # Or install dependencies with pip3 by name:
      pip3 install requests

      # And run Python 3 using the activated virtual environment:
      python3 --version
```
