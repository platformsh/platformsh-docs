{{ $server := .Get "server" }}

To deploy with {{ $server }} on Platform.sh, update the `web` block of `.platform.app.yaml` to follow one of the below examples. 
Each example is a combination of how dependencies are managed (Pip, Pipenv, or Poetry) and whether the application listens on a TCP (default) or Unix (if you intend to run behind a proxy server) socket.
Consult the [application reference](/create-apps/app-reference#upstream) for more information on upstream sockets and protocols. 