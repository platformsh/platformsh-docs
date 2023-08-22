Your local clone of the template has the following project structure:

```bash
├── .platform
│   ├── routes.yaml
│   └── services.yaml
├── {{ anchorize (.Get "name" )}}
│   ├── # App code
│   └── .platform.app.yaml
├── gatsby
│   ├── # App code
│   └── .platform.app.yaml
└── README.md
```

From this repository, you deploy a Gatsby app and a {{ .Get "name" }} app.
The code for each of them resides in their own directories.
When deploying a single app project [such as Gatsby](/guides/gatsby/deploy.html),
the repository needs three configuration files that describe its infrastructure, described below in detail.
For [multi-app projects](/create-apps/multi-app/_index.md),
two of those files remain in the project root and are shared between Gatsby and {{ .Get "name" }}.
Each app keeps its own app configuration file (`.platform.app.yaml`) in its subdirectory.
