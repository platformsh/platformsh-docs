.. _environment_variables:

Environment variables
=====================

Platform exposes :term:`environment variables` to the runtime environment (ie. PLATFORM_*) which allow you to define any specific configuration at the environment level.

You can edit those :term:`environment variables` directly from the Platform UI under the ``Variables`` tab of the configuration page of the environment.

Runtime
-------

* :term:`Environment variables` are exposed in the runtime (ie. PHP) with the PLATFORM_VARIABLES environment variable. It's a base64-encoded JSON object that maps variable names to variable values.

Hierarchy
---------

* :term:`Environment variables` are resolved following the environment hierarchy. If a variable is not defined in an environment, it takes the value of its parent.

Toolstack
---------

You can define variables based on the :term:`toolstack` you're working with.

For example with Drupal, you would prefix your :term:`Environment variables` with ``drupal:``.

Those variables will then be special-cased by our ``settings.local.php`` and directly added to ``$conf``.

An example will be: ``drupal:site_name`` which will directly set the site name of your Drupal site.

	$ export

declare -x HOME="/app"
declare -x LANG="fr_FR.UTF-8"
declare -x LC_CTYPE="fr_FR.UTF-8"
declare -x LOGNAME="web"
declare -x LS_COLORS="rs=0:di=01;34:ln=01;36:mh=00:pi=40;33:so=01;35:do=01;35:bd=40;33;01:cd=40;33;01:or=40;31;01:su=37;41:sg=30;43:ca=30;41:tw=30;42:ow=34;42:st=37;44:ex=01;32:*.tar=01;31:*.tgz=01;31:*.arj=01;31:*.taz=01;31:*.lzh=01;31:*.lzma=01;31:*.tlz=01;31:*.txz=01;31:*.zip=01;31:*.z=01;31:*.Z=01;31:*.dz=01;31:*.gz=01;31:*.lz=01;31:*.xz=01;31:*.bz2=01;31:*.bz=01;31:*.tbz=01;31:*.tbz2=01;31:*.tz=01;31:*.deb=01;31:*.rpm=01;31:*.jar=01;31:*.war=01;31:*.ear=01;31:*.sar=01;31:*.rar=01;31:*.ace=01;31:*.zoo=01;31:*.cpio=01;31:*.7z=01;31:*.rz=01;31:*.jpg=01;35:*.jpeg=01;35:*.gif=01;35:*.bmp=01;35:*.pbm=01;35:*.pgm=01;35:*.ppm=01;35:*.tga=01;35:*.xbm=01;35:*.xpm=01;35:*.tif=01;35:*.tiff=01;35:*.png=01;35:*.svg=01;35:*.svgz=01;35:*.mng=01;35:*.pcx=01;35:*.mov=01;35:*.mpg=01;35:*.mpeg=01;35:*.m2v=01;35:*.mkv=01;35:*.webm=01;35:*.ogm=01;35:*.mp4=01;35:*.m4v=01;35:*.mp4v=01;35:*.vob=01;35:*.qt=01;35:*.nuv=01;35:*.wmv=01;35:*.asf=01;35:*.rm=01;35:*.rmvb=01;35:*.flc=01;35:*.avi=01;35:*.fli=01;35:*.flv=01;35:*.gl=01;35:*.dl=01;35:*.xcf=01;35:*.xwd=01;35:*.yuv=01;35:*.cgm=01;35:*.emf=01;35:*.axv=01;35:*.anx=01;35:*.ogv=01;35:*.ogx=01;35:*.aac=00;36:*.au=00;36:*.flac=00;36:*.mid=00;36:*.midi=00;36:*.mka=00;36:*.mp3=00;36:*.mpc=00;36:*.ogg=00;36:*.ra=00;36:*.wav=00;36:*.axa=00;36:*.oga=00;36:*.spx=00;36:*.xspf=00;36:"
declare -x MAIL="/var/mail/web"
declare -x OLDPWD
declare -x PATH="/usr/local/bin:/usr/bin:/bin:/usr/local/games:/usr/games"
declare -x PLATFORM_APPLICATION="eyJyZWxhdGlvbnNoaXBzIjogeyJzb2xyIjogInNvbHI6c29sciIsICJyZWRpcyI6ICJyZWRpczpyZWRpcyIsICJkYXRhYmFzZSI6ICJteXNxbDpteXNxbCJ9LCAid2ViIjogeyJwYXNzdGhydSI6dsf
ICIvaW5kZXgucGhwIiwgIm1vdmVfdG9fcm9vdCI6IHRydWUsICJleHBpcmVzIjogMCwgImRvY3VtZW50X3Jvb3QiOiAiL3B1YmxpYyJ9LCAibmFtZSI6ICJwaHAiLCAidG9vbHN0YWNrIjogInBocDpkcnVwYWwiLCAiaG9va3MiOiB7ImJ1aWxkIjogbnVsbCwgImRlcGxveSI6ICJjZCAvYXBwL3B1YmxpYyA7IGRydXNoIC15IHVwZGF0ZWRiIn0sICJjcm9ucyI6IHsiZHJ1cGFsIjogeyJjbWQiOiAiY2QgcHVibGljIDsgZHJ1c2ggY29yZS1jcm9uIiwgInNwZWMiOiAiKi8yMCAqICogKiAqIn19LCAiYWNjZXNzIjogeyJzc2giOiAiY29udHJpYnV0b3IifSwgInByZWZsaWdodCI6IHsiZW5hYmxlZCI6IHRydWUsICJpZ25vcmVkX3J1bGVzIjogW119LCAibW91bnRzIjogeyIvcHVibGljL3NpdGVzL2RlZmF1bHQvZmlsZXMiOiAic2hhcmVkOmZpbGVzL2ZpbGVzIiwgIi9wcml2YXRlIjogInNoYXJlZDpmaWxlcy9wcml2YXRlIiwgIi90bXAiOiAic2hhcmVkOmZpbGVzL3RtcCJ9LCAiZGlzayI6IDIwNDgsICJzaXplIjogIkFVVE8ifQ=="
declare -x PLATFORM_ENVIRONMENT="master"
declare -x PLATFORM_PROJECT="3ukbie4igkfqs"
declare -x PLATFORM_RELATIONSHIPS="eyJzb2xyIjogW3siaXAiOiAiMjQ2Ljk2LjAuNSIsICJob3N0IjogInNvbHIuaW50ZXJuYWwiLCAic2NoZW1lIjogInNvbHIiLCAicG9ydCI6IDgwODB9XSwgInJlZGlzIjogW3siaXAiOiAiMjQ2Ljk2LjAuNCIsICJob3N0IjogInJlZGlzLmludGVybmFsIiwgInNjaGVtZSI6ICJyZWRpcyIsICJwb3J0IjogNjM3OX1dLCAiZGF0YWJhc2UiOiBbeyJ1c2VybmFtZSI6ICIiLCAicGFzc3dvcmQiOiAiIiwgImlwIjogIjI0Ni45Ni4wLjYiLCAiaG9zdCI6ICJkYXRhYmFzZS5pbnRlcm5hbCIsICJxdWVyeSI6IHsiaXNfbWFzdGVyIjogdHJ1ZX0sICJwYXRoIjogIm1haW4iLCAic2NoZW1lIjogIm15c3FsIiwgInBvcnQiOiAzMzA2fV19"
declare -x PLATFORM_ROUTES="eyJodHRwczovL3d3dy5yb3lhbGJyYW5kLmluYy8iOiB7InRvIjogImh0dHA6Ly9yb3lhbGJyYW5kLmluYy8iLCAidHlwZSI6ICJyZWRpcmVjdCJ9LCAiaHR0cDovL3JveWFsYnJhbmQuaW5jLyI6IHsic3NpIjogeyJlbmFibGVkIjogZmFsc2V9LCAiY2FjaGUiOiB7ImVuYWJsZWQiOiB0cnVlfSwgInR5cGUiOiAidXBzdHJlYW0iLCAidXBzdHJlYW0iOiAicGhwIn0sICJodHRwOi8vd3d3LnJveWFsYnJhbmQuaW5jLyI6IHsidG8iOiAiaHR0cDovL3JveWFsYnJhbmQuaW5jLyIsICJ0eXBlIjogInJlZGlyZWN0In0sICJodHRwczovL3JveWFsYnJhbmQuaW5jLyI6IHsic3NpIjogeyJlbmFibGVkIjogZmFsc2V9LCAiY2FjaGUiOiB7ImVuYWJsZWQiOiB0cnVlfSwgInR5cGUiOiAidXBzdHJlYW0iLCAidXBzdHJlYW0iOiAicGhwIn19"
declare -x PLATFORM_TREE_ID="c537d147914fe2eca3f030d9fafeb69e679cb47b"
declare -x PLATFORM_VARIABLES="eyJaSVpJIjogInByb3V0IiwgIlBMQVRGT1JNX0VOVklST05NRU5UIjogInRlc3QifQ=="
declare -x PWD="/app"
declare -x SHELL="/bin/bash"
declare -x SHLVL="2"
declare -x SSH_AUTH_SOCK="/tmp/ssh-HP1ZbMwzj1/agent.96"
declare -x SSH_CLIENT="246.64.0.2 53797 22"
declare -x SSH_CONNECTION="246.64.0.2 53797 246.96.0.7 22"
declare -x SSH_TTY="/dev/pts/0"
declare -x TERM="xterm-256color"
declare -x USER="web"

echo $(base64 -d <<<$PLATFORM_VARIABLES)