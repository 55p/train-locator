// JavaScript Document
var not = function() {
  this.isEnabled = false;
}

not.prototype.enable = function() {
  if (!("Notification" in window)) {
    document.querySelector("footer a+a").style.display = "none";
    return;
  }
  
  if (Notification.permission === "granted") {
    this.isEnabled = true;
    document.querySelector("footer a+a").style.display = "none";
  } else if (Notification.permission !== 'denied') {
    Notification.requestPermission(this.requestCallback.bind(this));
  }     
}

not.prototype.displayNotify = function(txt) {
  if (this.isEnabled) {
    var notification = new Notification(txt, {icon:'info.jpg'});
  }
}

not.prototype.displayError = function(txt) {
  if (this.isEnabled) {
    var notification = new Notification(txt, {icon:'alert.jpg'});
  } else {
    alert(txt);
  }
}

not.prototype.requestCallback = function(permission) {
  //alert(permission);
  if(!('permission' in Notification)) {
    Notification.permission = permission;
  }

  if (permission === "granted") {
    this.isEnabled = true;
    document.querySelector("footer a+a").style.display = "none";
    this.display("Děkuji.");
  }    
}

var Notify = new not();
