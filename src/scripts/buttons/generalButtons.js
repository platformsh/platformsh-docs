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
    if (button.type == "basic") {
    		if (!oneOfMultiple) {
    				details = '<br/><br/><center>';
    		}
    		details += '<a href="' + button.path.path + '">' + button.path.text + '</a>';
        details += '</center><br/><br/>';
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
        details += "Error: '" + button.type + "' is not supported with 'makeButton()' directly. Use 'makeMultiButton()' instead.";
    } else {
    		details += "Error: '" + button.type + "' is not a supported button type. Use 'basic', 'descriptive', or 'navigation'.";
    }
    if (!oneOfMultiple) {
/* 				if (!("div" in button)) {
				             details += "Error: Your button object is missing a 'div' target.";
				        } */
    		document.getElementById(button.div).innerHTML = details;
    } else {
    		return details;
    }
}

function makeMultiButton(buttons) {
		var details = '';
		buttons.children.forEach(function (button) {
    		details += makeButton(button, multi=true);
    });
    document.getElementById(buttons.div).innerHTML = details;
}
