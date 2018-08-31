
# How to use NVM to run different versions of Node.js

[Node Version Manager](https://github.com/creationix/nvm) or NVM is a tool for managing multiple versions of Node.js in one installation. 

You can use NVM with any of our container types that have node installed to change or update the version. This may be useful, for example, where a container has a Long Term Release (LTS) version available, but you would like to use the latest.

Installing NVM is done in the build hook of your `.platform.app.yaml`, which some additional calls to ensure that environment variables are set correctly.

```yaml
hooks:
    build: |
        unset NPM_CONFIG_PREFIX
        curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.8/install.sh | dash
        export NVM_DIR="$HOME/.nvm"
        [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
        nvm current
        nvm install 9.5.0
    deploy: |
        unset NPM_CONFIG_PREFIX
        nvm use 9.5.0
 ```
   
And in a `.environment` file in the root of your project:
 
``` 
# This is necessary for nvm to work.
unset NPM_CONFIG_PREFIX
# Disable npm update notifier; being a read only system it will probably annoy you.
export NO_UPDATE_NOTIFIER=1
# This loads nvm for general usage.
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
```
