## Troubleshoot SSH

While trying to log in via SSH, this can happen:

```bash
$ ssh [SSH-URL]
Permission denied (publickey).
```

Don't panic! It's an issue which can happen for the following reasons:

* Your environment is inactive
* You haven't [redeployed](/development/troubleshooting.html#force-a-redeploy) your environment since adding the new public key
* You didn't upload your public key to your user profile
* Your SSH private key has not been added into your ssh-agent

### Check your public key

Make sure your public key has been uploaded to your user account.

### Check your ssh-agent

Check that your key is properly added to your SSH agent. This is an authentication agent that manages your private key.

1.  Check your SSH agent. Run the command `ssh-add -l` in your terminal:

```bash
$ ssh-add -l
2048 12:b0:13:83:7f:56:18:9b:78:ca:54:90:a7:ff:12:69 /Users/nick/.ssh/id_rsa (RSA)
```

2.  Check that file name on the right (`.ssh/id_rsa` in the example above). Does it match your private key file?
3.  If you don't see your private key file, add your private key:

```bash
$ ssh-add path-to-your-key
```

4.  Try again.

### Still having trouble?

If you followed all the steps above, you may also notice an error message similar to below while attempting to ssh to platform.sh:

```text
Hello Your Name, you successfully connected, but you do not have access to service 'xxxxxxxxxxxxxx-master': check permissions.
Received disconnect from 54.210.49.244: 14: No more auth methods available
```

This usually means a deployment has not been committed yet. When a new key is added, it only becomes immediately active for use with Git. For use with ssh, it will not be activated until a deployment is made. 

See [Forcing a redeployment](/development/troubleshooting.html#force-a-redeploy)...

### If all else fails, generate some SSH debug information

If your private key and public key both look OK but you don't have any luck logging in, print debugging information. These lines often give clues about what is going wrong.

1.  Run the SSH command with the `-v` option, like this:

```bash
$ ssh -v [SSH-URL]
OpenSSH_6.7.8, OpenSSL 1.2.3 1 Sep 2014
debug1: Connecting to ssh.eu.platform.sh [54.32.10.98] port 22.
debug1: Connection established.
debug1: identity file /Users/nick/.ssh/id_rsa type 1
...(30 more lines of this light reading)...
debug1: Offering RSA public key: /Users/nick/.ssh/id_rsa
debug1: Authentications that can continue: publickey
debug1: No more authentication methods to try.
Permission denied (publickey).
```

You can use this information to make one last check of the private key file.

If you're still stuck, don't hesitate to submit a support ticket, we'll help you solve your problem.

## Related

* [Setting up](ssh/setting-up.md)
* [Managing SSH keys on Platform.sh](ssh/managing-ssh-keys.md)
* [Working with SSH keys](ssh/local-ssh-keys.md)
* [Accessing your service](ssh/access.md)
