function getButtonPaths(nText, pText) {
		var previous = document.querySelectorAll('[class="navigation navigation-prev "]');
    var next = document.querySelectorAll('[class="navigation navigation-next "]');
    return {prev: {path: previous[0].pathname, text: pText}, next: {path: next[0].pathname, text: nText}};
    }

function makeButtons(buttonStyle, nextText='Next', prevText='Back') {
    var buttons = getButtonPaths(nextText, prevText);
    var details = '<br/><br/><center>';
      if (buttonStyle == "previousOnly") {
        details += '<a href="' + buttons.prev.path + '" class="buttongen small">' + buttons.prev.text + '</a>';
      } else if (buttonStyle == "nextOnly") {
        details += '<a href="' + buttons.next.path + '" class="buttongen small">' + buttons.next.text + '</a>';
      } else if (buttonStyle == "full") {
        details += '<a href="' + buttons.prev.path + '" class="buttongen small">' + buttons.prev.text + '</a>';
        details += '<a href="' + buttons.next.path + '" class="buttongen small">' + buttons.next.text + '</a>';
      }
    details += '</center><br/><br/>';
    document.getElementById("buttons").innerHTML = details;
}
