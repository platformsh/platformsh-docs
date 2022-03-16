{{ $name := .Get "name"}}
{{ $repo := .Get "templateRepo" }}
{{ $composerLink := .Get "composerLink" }}
{{ $site := $name}}
{{ if ne $composerLink "" }}
  {{ $site = printf "[Composer-flavored %s](%s)" $name $composerLink }}
{{ end }}
To get {{ $name }} running on Platform.sh, you have two potential starting places:

- You already have a {{ $site }} site you are trying to deploy.
  Go through each step to make the recommended changes to your repository to prepare it for Platform.sh.
- You have no code at this point.
  Platform.sh maintains a ready-made [{{ $name }} template](https://github.com/platformsh-templates/{{ $repo }}) that you can deploy.
  The steps below clarify why the modifications have been made to a base {{ $name }} project.
