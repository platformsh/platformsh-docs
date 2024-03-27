{{ $python := "[Django](/get-started/stacks/django.md)<br/>[Flask](/get-started/stacks/flask.md)" }}
{{ $php := "[Symfony](/get-started/stacks/symfony/_index.md)<br/>[Laravel](/get-started/stacks/laravel.md)" }}
{{ $nodejs := "[Express](/get-started/stacks/express.md)<br/>[Next.js](/get-started/stacks/nextjs.md)<br/>[Strapi](/get-started/stacks/strapi.md)" }}

<table>
  <tr>
    <th>Language</th>
    <th>Frameworks</th>
  </tr>
  <tr>
    <td>{{ "[Python](/languages/python/_index.md)" | .Page.RenderString }}</td>
    <td>{{ $python | .Page.RenderString }}</td>
  </tr>
  <tr>
    <td>{{ "[PHP](/languages/php/_index.md)  " | .Page.RenderString }}</td>
    <td>{{ $php | .Page.RenderString }}</td>
  </tr>
    <tr>
    <td>{{ "[Javascript/Node.js](/languages/nodejs/_index.md)" | .Page.RenderString }}</td>
    <td>{{ $nodejs | .Page.RenderString }}</td>
  </tr>
</table>
