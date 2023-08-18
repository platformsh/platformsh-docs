Your local clone of the template has the following project structure:

```bash
├── .platform
│   ├── {{ partial "vendor/configfile" (dict "context" . "config" "routes") }}
│   └── {{ partial "vendor/configfile" (dict "context" . "config" "services") }}
├── {{ anchorize (.Get "name" )}}
│   ├── # App code
│   └── {{ partial "vendor/configfile" (dict "context" . "config" "services") }}
├── gatsby
│   ├── # App code
│   └── {{ partial "vendor/configfile" (dict "context" . "config" "services") }}
└── README.md
```

From this repository, you deploy a Gatsby app and a {{ .Get "name" }} app.
The code for each of them resides in their own directories.
When deploying a single app project [such as Gatsby](/guides/gatsby/deploy.html),
the repository needs three configuration files that describe its infrastructure, described below in detail.
For [multi-app projects](/create-apps/multi-app/_index.md),
two of those files remain in the project root and are shared between Gatsby and {{ .Get "name" }}.
Each app keeps its own app configuration file (`{{ partial "vendor/configfile" (dict "context" . "config" "services") }}`) in its subdirectory.
