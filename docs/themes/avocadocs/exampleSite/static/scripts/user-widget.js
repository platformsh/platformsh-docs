var widgetLoaded = false;
$(document).ready(function (){
  if (!widgetLoaded) {
    var userWidgetTarget = document.getElementById("user-widget");
    userWidget.init(userWidgetTarget, {
      accountUrl: "https://accounts.platform.sh",
      nameOrAvatar: true
    } );
    widgetLoaded = true;
  }
});
