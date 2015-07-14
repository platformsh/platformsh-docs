module.exports = {
    book: {
        assets: "./book",
        js: [
            "platform.js"
        ],
        css: [
            "platform.css"
        ],
        html: {
          "head:end": "<link rel='stylesheet' type='text/css' href='//cloud.typography.com/7640312/659566/css/fonts.css'>",
          "body:start": function() {
            return "<div id='platform-bar'><a class='branding' href='/'><span class='logo'></span><span class='site-name'>Docs</span></a><div id='navlink'><span class='divider'>/</span><div class='dropdown'><ul><li>"+this.options.title+"<ul><li><a href='/overview/'>Overview</a></li><li><a href='/drupal/'>Drupal</a></li><li><a href='/drupal_migrate/'>Drupal Migrate</a></li><li><a href='/symfony/'>Symfony</a></li><li><a href='/reference/'>Reference</a></li></ul></li></ul></div></div></div>"
          }
        }
    },
    hooks: {
        init: function() {

        },
        finish: function() {
        }
    }
};
