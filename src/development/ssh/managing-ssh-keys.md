# Managing SSH keys

<!-- toc -->

Platform.sh allows you to add SSH keys for more than one computer. You can also add more than one SSH key per computer if necessary. For example, you might use one SSH key for Platform.sh, and one for another service.

### Using the web interface

Your SSH keys can be found at User > Account settings > SSH keys.

### Using the CLI

The CLI provides several commands for working with your SSH keys.


To add an SSH key:

```bash
platform ssh-key:add
```

To delete an SSH key:

```bash
platform ssh-key:delete
```

To list your SSH keys:

```bash
platform ssh-key:list
```

## Related

* [Setting up](ssh/setting-up.md)
* [Working with SSH keys](ssh/local-ssh-keys.md)
* [Accessing your service](ssh/access.md)
* [Troubleshooting SSH](ssh/troubleshooting.md)
