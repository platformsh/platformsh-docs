{{ $python := "[Django](/get-started/stacks/django.md)<br/>[Flask](/get-started/stacks/flask.md)" }}
{{ $php := "[Symfony](/get-started/stacks/symfony/_index.md)<br/>[Laravel](/get-started/stacks/laravel.md)" }}
{{ $nodejs := "[Express](/get-started/stacks/express.md)<br/>[Next.js](/get-started/stacks/nextjs.md)<br/>[Strapi](/get-started/stacks/strapi.md)" }}

<table>
  <tr class="framework-table">
    <th>Language</th>
    <th>Frameworks</th>
  </tr>
  <tr class="framework-table">
    <td>{{ "[Python](/languages/python/_index.md)" | .Page.RenderString }}</td>
    <td>{{ $python | .Page.RenderString }}</td>
  </tr>
  <tr class="framework-table">
    <td>{{ "[PHP](/languages/php/_index.md)  " | .Page.RenderString }}</td>
    <td>{{ $php | .Page.RenderString }}</td>
  </tr>
  <tr class="framework-table">
    <td>{{ "[Javascript/Node.js](/languages/nodejs/_index.md)" | .Page.RenderString }}</td>
    <td>{{ $nodejs | .Page.RenderString }}</td>
  </tr>
  <tr class="framework-table">
    <td>{{ "[C#/.NET Core](/languages/dotnet.md)" | .Page.RenderString }}</td>
    <td>{{ "[Get started](/get-started/here)<br/>[View docs](/languages/dotnet.md)" | .Page.RenderString }}</td>
  </tr>
  <tr class="framework-table">
    <td>{{ "[Elixir](/languages/elixir.md)" | .Page.RenderString }}</td>
    <td>{{ "[Get started](/get-started/here)<br/>[View docs](/languages/elixir.md)" | .Page.RenderString }}</td>
  </tr>
  <tr class="framework-table">
    <td>{{ "[Go](/languages/go.md)" | .Page.RenderString }}</td>
    <td>{{ "[Get started](/get-started/here)<br/>[View docs](/languages/go.md)" | .Page.RenderString }}</td>
  </tr>
  <tr class="framework-table">
    <td>{{ "[Java](/languages/java)" | .Page.RenderString }}</td>
    <td>{{ "[Get started](/get-started/here)<br/>[View docs](/languages/java)" | .Page.RenderString }}</td>
  </tr>
  <tr class="framework-table">
    <td>{{ "[Lisp](/languages/lisp.md)" | .Page.RenderString }}</td>
    <td>{{ "[Get started](/get-started/here)<br/>[View docs](/languages/lisp.md)" | .Page.RenderString }}</td>
  </tr>
  <tr class="framework-table">
    <td>{{ "[Ruby](/languages/ruby.md)" | .Page.RenderString }}</td>
    <td>{{ "[Get started](/get-started/here)<br/>[View docs](/languages/ruby.md)" | .Page.RenderString }}</td>
  </tr>
  <tr class="framework-table">
    <td>{{ "[Rust](/languages/rust.md)" | .Page.RenderString }}</td>
    <td>{{ "[Get started](/get-started/here)<br/>[View docs](/languages/rust.md)" | .Page.RenderString }}</td>
  </tr>
</table>
