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
            return "<div id='platform-bar'><a class='branding' href='/'><span class='logo'></span><span class='site-name'>Docs</span></a><div id='navlink'><span class='divider'>/</span><div class='dropdown'><ul><li>"+this.options.title+"<ul><li><a href='/overview/'>Overview</a></li><li><a href='/drupal/'>Getting Started With Drupal</a></li><li><a href='/drupal_migrate/'>Getting Started - Migrate an Existing Drupal site</a></li><li><a href='/symfony/'>Getting Started with Symfony</a></li><li><a href='/user_guide/'>User Guide</a></li></ul></li></ul></div></div></div>"
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
