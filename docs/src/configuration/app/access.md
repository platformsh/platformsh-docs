---
title: "Access"
weight: 6
toc: false
---

The `access` key in `.platform.app.yaml` defines the user roles who can log in via SSH to the environments they have permission to access.  The specified role is a minimum; anyone with an access level of this role or higher can access the container via SSH.

Possible values are `admin`, `contributor`, and `viewer`.  The default is `contributor`.

## Restrict SSH access to specific roles

The following block in `.platform.app.yaml` restricts SSH access to just those users with `admin` privileges in the project or the specific deployed environment.

```yaml
access:
    ssh: admin
```
