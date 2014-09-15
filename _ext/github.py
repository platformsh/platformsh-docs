import os
import warnings
 
# Loosely based on https://gist.github.com/mgedmin/6052926 (BSD)
 
def get_github_url(app, view, path):
    return 'https://github.com/{project}/{view}/{branch}/{path}'.format(
        project=app.config.github_project,
        view=view,
        branch=app.config.github_branch,
        path=path,
        )

def html_page_context(app, pagename, templatename, context, doctree):
    if templatename != 'page.html':
        return
 
    if not app.config.github_project:
        return
 
    path = os.path.relpath(doctree.get('source'), app.builder.srcdir)
    show_url = get_github_url(app, 'blob', path)
    edit_url = get_github_url(app, 'edit', path)
 
    context['github_show_url'] = show_url
    context['github_edit_url'] = edit_url
  
def setup(app):
    app.add_config_value('github_project', '', True)
    app.add_config_value('github_branch', 'master', True)
    app.connect('html-page-context', html_page_context)
