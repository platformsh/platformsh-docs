function getPathObj(buttonPath, buttonText=null, buttonDescription=null) {
		var defaultBackText = "Back";
    var objPath;
    if (buttonPath == "prev" || buttonPath == "next") {
        var fullPath = document.querySelectorAll('[class="navigation navigation-' + buttonPath + ' "]');
        objPath = fullPath[0].pathname;
        if (buttonPath == "prev") {
            buttonText = defaultBackText;
        }
    } else {
        objPath = buttonPath;
    }
    return {path: objPath, text: buttonText, description: buttonDescription};
}

function makeButton(button, oneOfMultiple=false) {
		var details = '';
    var errorLines = {
    									"multi": "Error: '" + button.type + "' is not supported with 'makeButton()' directly. Use 'makeMultiButton()' instead.",
                      "unsupported": "Error: '" + button.type + "' is not a supported button type. Use 'basic', 'descriptive', or 'navigation'."
    };

    if (button.type == "basic") {
    		var basicLine = '<a href="' + button.path.path + '" class="buttongen small">' + button.path.text + '</a>';
    		if (!oneOfMultiple) {
    				details += '<br/><br/><center>';
    		}
    		details += basicLine;

        if (!oneOfMultiple) {
    				details += '<br/><br/><center>';
    		}
    } else if (button.type == "descriptive") {
    		details += '<a href="' + button.path.path + '" class="buttongen full"><b>' + button.path.text + '</b><br/><br/>' + button.path.description + '</a>';

    } else if (button.type == "navigation") {
					if (!oneOfMultiple) {
            details = '<br/><br/><center>';
        }
                if ('prev' in button) {
                   details += '<a href="' + button.prev.path + '" class="buttongen small">' + button.prev.text + '</a>';
                }
                if ('next' in button) {
                   details += '<a href="' + button.next.path + '" class="buttongen small">' + button.next.text + '</a>';
                }
                details += '</center><br/><br/>';

    } else if (button.type == "multi") {
        details += errorLines.multi;
    } else {
    		details += errorLines.unsupported;
    }
    if (!oneOfMultiple) {
    		document.getElementById(button.div).innerHTML = details;
    } else {
    		return details;
    }
}

function makeMultiButton(buttons) {
		var details = '<br/><br/><br/><center>';
		buttons.children.forEach(function (button) {
    		details += makeButton(button, true);
    });
    details += '<center><br/><br/><br/>';
    document.getElementById(buttons.div).innerHTML = details;
}


function makeTestButton(demoChoice, divName) {

		if (demoChoice == "navigation") {
        var navNextText = "I have set up my free trial account";
        var templatePath2 = getPathObj("/development/templates.html", "Templates");
        var testButton = {type: "navigation", prev: getPathObj("prev"), next: getPathObj("next", navNextText), div: divName};

				makeButton(testButton);

    } else if (demoChoice == "multiple") {
    		var githubPath = getPathObj("/administration/integrations/github.html", "GitHub");
        var github = {type: "basic", path: githubPath};

        var gitlabPath = getPathObj("/administration/integrations/gitlab.html", "GitLab");
        var gitlab = {type: "basic", path: gitlabPath};

        var bitbucketPath = getPathObj("/administration/integrations/bitbucket.html", "Bitbucket");
        var bitbucket = {type: "basic", path: bitbucketPath};

        var integrations = {type: "multi", children: [github, gitlab, bitbucket], div: divName};

        makeMultiButton(integrations);

    } else if (demoChoice == "descriptive") {

    		var descTitle = "External Integrations";
        var descDesc = "Configure Platform.sh to mirror every push and pull request on GitHub, Gitlab, and Bitbucket.";
        var descPath = getPathObj("/gettingstarted/integrations.html", descTitle, descDesc);
        var descButton = {type: "descriptive", path: descPath, div: divName};

    		makeButton(descButton);

    } else if (demoChoice == "basic") {
    		var templatePath = getPathObj("/development/templates.html", "Templates");
        var templates = {type: "basic", path: templatePath, div: divName};

        makeButton(templates)
    }

}



