# SSH Agent Setup

The SSH Agent will forward authentication requests from Platform.sh Enterprise to your local machine. This allows you to log into remote servers from the Enterprise host using your local private key. With a working ssh-agent you can easily copy files directly between the Enterprise host and Platform.sh, or from another remote server.

## OpenSSH

To test for a working SSH agent, run locally:

```
ssh-add -l
```

If you see your key listed, congratulations you already have a working agent. All you need to do is add `-A` to your ssh command. e.g. `ssh -A <user>@<cluster>.ent.platform.sh`.

If instead you see `Could not open a connection to your authentication agent.` you will need to start it manually. A permanent ssh-agent configuration is recommended but beyond the scope of this documentation.

```bash
# Run the agent and set environment variables
eval `ssh-agent`

# Add all local keys to the agent
ssh-add

# Connect to the Enterprise host, forcing agent forwarding on.
ssh -A <user>@<cluster>.ent.platform.sh

# When done, kill the agent.
kill $SSH_AGENT_PID
```

### Forwarding keys by default

It may be helpful to set your SSH client to always forward keys to Platform.sh servers, which can simplify other SSH or Rsync commands.  To do so, include a block in your local `~/.ssh/config` file like so:

```
Host *.us.platform.sh
       ForwardAgent yes

Host *.eu.platform.sh
       ForwardAgent yes
```

(You can include other configuration as desired.)

## PuTTY / Pageant

Pageant is the SSH authentication agent for PuTTY and is included in the [standard PuTTY distribution](http://www.chiark.greenend.org.uk/~sgtatham/putty/download.html).

Complete instructions on configuring Pageant and PuTTY agent forwarding can be found on [HowToGeek](http://www.howtogeek.com/125364/how-to-ssh-hop-with-key-forwarding-from-windows/).
