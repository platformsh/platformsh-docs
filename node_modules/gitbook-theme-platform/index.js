module.exports = {
    book: {
        assets: "./book",
        js: [
          "platform.js",
          "user-widget/user-widget.js",
          "user-widget/angular.min.js",
          "user-widget/app.js"
        ],
        css: [
          "platform.css",
          "user-widget/user-widget.css"
        ],
        html: {
          "head:end": "<link rel='stylesheet' type='text/css' href='//cloud.typography.com/7640312/659566/css/fonts.css'>",
          "body:start": function() {
            return "<div id='platform-bar'><a class='branding' href='https://platform.sh'><span class='logo'>Platform.sh</span></a><a class='site-name' href='/'><span>Documentation Home</span></a><div id='navlink'><span class='divider'>/</span><div class='dropdown'><ul><li>"+this.options.title+"<ul><li><a href='/user_guide/'>User Guide</a></li><li><a href='/discover/'>Discover</a></li><li><a href='/drupal/'>Get started with Drupal</a></li><li><a href='/drupal_migrate/'>Migrate an existing Drupal site</a></li><li><a href='/symfony/'>Get started with Symfony</a></li></ul></li></ul></div></div></div>"
          },
          "body:end": function(){
            return "<script>(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)})(window,document,'script','//www.google-analytics.com/analytics.js','ga');ga('create', 'UA-4064131-10', 'auto');ga('send', 'pageview');</script>";
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
