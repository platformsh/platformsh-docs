# Upload your SSH public key

You need an [id\_rsa public/private
keypair](https://help.github.com/articles/generating-ssh-keys/) to use
Platform.sh.

## Upload using the Web UI

To upload the public key in the browser go to [your user
account](https://marketplace.commerceguys.com/user) and click the
SSH Keys tab. Name your key in the *Title* field, and paste the public
key into the *Key* field. Your key will typically be found at
`~/.ssh/id_rsa.pub` on Linux and Mac OS X machines.

![Screenshot of a public key field](/images/edit-ssh.png)

#### Upload using Platform.sh CLI

Alternately, you can upload your SSH key using the Platform.sh CLI
itself.

```bash
platform ssh-key:add ~/.ssh/id_rsa.pub
```
