<!-- shortcode start {{ .Name }} -->
{{ $server := .Get "server" }}
To deploy with {{ $server }} on {{ .Site.Params.vendor.name }} ,
use one of the following examples to update your [app configuration](../../create-apps/_index.md).

The examples vary based on both your package manager (Pip, Pipenv, or Poetry)
and whether your app listens on a TCP (default) or Unix (for running behind a proxy server) socket.
For more information on upstream sockets and protocols, see the [application reference](/create-apps/app-reference/single-runtime-image.md#upstream).

The snippets below assume that {{ $server }} has been added as a dependency to your `requirements.txt`, `Pipfile.lock`, or `poetry.lock`.
<!-- shortcode end {{ .Name }} -->
