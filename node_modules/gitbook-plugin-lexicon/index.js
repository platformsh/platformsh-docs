var fs = require('fs');
var Q = require('q');
var lexicon, lexIndex;
var config = {
  "localCopy": "lexicon.json"
};

function scanner(lexicon) {
    return new RegExp('(' + lexicon.map(function (t) { return t["title"] }).sort(function (a, b) { return b.length - a.length; }).join('|') + ')', "g");
};

function rewriter(lexicon) {
    return function (match, p1) {
        return '<span class="hint" data-hint="' + lexIndex[p1]["definition"].trim() + '">' + p1 + '</span>';
    };
};

function loadLexicon(localCopy, d) {
    fs.readFile(localCopy, {encoding: 'utf-8'}, function (err, content) {
        if (content === undefined) {
            d.resolve();
            return;
        }
        lexicon = JSON.parse(content);
        lexIndex = {};
        lexicon.forEach(function (t) {
            lexIndex[t["title"]] = t;
        });
        d.resolve();
    });
};

module.exports = {
    book: {
        "assets": "./book",
        "css": ["lexicon.css"]
    },
    hooks: {
        "init": function (done) {
            var userConfig = this.options.pluginsConfig.lexicon;
            for (c in userConfig) {
                config[c] = userConfig[c];
            }
            var d = Q.defer();
            loadLexicon(config["localCopy"], d);
            return d.promise;
        },
        "page:after": function(page) {
            if (lexicon === undefined) {
                return page;
            }
            page.content = page.content.replace(/<section[\s\S]*?>([\s\S]*?)<\/section>/g, function (match, section) {
                return section.replace(scanner(lexicon), rewriter(lexicon));
            });
            if (this.options.pluginsConfig.json) {
                page.sections[0].content = page.sections[0].content.replace(scanner(lexicon), rewriter(lexicon));
            }
            return page;
        }
    }
};
