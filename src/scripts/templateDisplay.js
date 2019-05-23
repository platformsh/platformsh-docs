
var jsonSource = "/scripts/templates/templates.json";

function servicesList(currentServices, returnType) {
    var details = "";

    $.each(currentServices, function(j, t) {
        if (returnType == "name") {
            details += t.name + "<br/>";
        } else {
            details += t.version + "<br/>"
        }
    });
    return details;
}

function templateTypeDisplay(firstMention, fullName) {
    var currentDisplay = "";
    if (!(firstMention)) {
        currentDisplay = fullName.charAt(0).toUpperCase() + fullName.slice(1);
    }
    return currentDisplay;
}

function makeTemplateTableHeader(tableName) {

		  var table = document.getElementById(tableName);
      var header = table.createTHead();
      var row = header.insertRow(0);
			
      var cell = row.insertCell(0);
      var cell2 = row.insertCell(1);
      var cell3 = row.insertCell(2);
      var cell4 = row.insertCell(3);
      var cell5 = row.insertCell(4);
      
      cell.innerHTML = "<b>Type</b>";
      cell2.innerHTML = "<b>Template</b>";
      cell3.innerHTML = "<b>Services</b>";
      cell4.innerHTML = "<b>Version</b>";
      cell5.innerHTML = "<b>Status</b>";
    
}

function makeTemplateTable(language, tableName) {
    makeTemplateTableHeader(tableName)
    
    $.getJSON(jsonSource, function(data) {
    		var templateTypes = data[language];
        
        $.each(templateTypes, function(i, f) {
            var mentioned = 0;
            $.each(f, function(j, t) {
                var templateServices = t.services;
								var tblRow = "<tr>" + "<td>" + templateTypeDisplay(mentioned, i) + "</td>" +
                      "<td>" + "<a href=\"" + t.repo + "\">" + t.name + "</a>" + "</td>" +
                      "<td>" + servicesList(templateServices, "name") + "</td>" +
                      "<td>" + servicesList(templateServices, "version") +
                      "<td>" + "" + "</td>" +"</tr>";
                $(tblRow).appendTo("#" + tableName + " tbody");
                mentioned += 1;
            });
        });
    });
}
