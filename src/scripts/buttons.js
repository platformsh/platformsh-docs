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
    				details += '<br/><center>';
    		}
    		details += basicLine;

        if (!oneOfMultiple) {
    				details += '<br/><center>';
    		}
    } else if (button.type == "descriptive") {
    		details += '<a href="' + button.path.path + '" class="buttongen full"><b>' + button.path.text + '</b><br/><br/>' + button.path.description + '</a>';

		} else if (button.type == "basicFull") {
			  details += '<center><a href="' + button.path.path + '" class="buttongen full-center"><b>' + button.path.text + '</b></a></center>';

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
