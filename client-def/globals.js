// JavaScript Document
Array.prototype.clear = function() {
  while (this.length > 0) {
    this.pop();
  }
};

String.prototype.trim = function() {
  return this.replace(/(^\s*)|(\s*$)/g, "")
};
String.prototype.removeHash = function() {
  if (this.charAt(0) == '#') return this.substring(1); 
  return this;
};

var context = function() {
  this.observations = new Array();
  this.groups = new Array();
  this.days = new Array();
  this.trains = new Array();
  
  this.messages = new Array();
  
  window.addEventListener("hashchange", this.hashChangeListener.bind(this), true)
}
/*
context.prototype.addMessage = function(message) {
  var index = this.messages.length; 
  this.messages [index] = message;
}
context.prototype.isMessage = function(message) {
  var size = this.messages.length;
  for (var i = 0; i < size; i++) {
    if (this.messages [i] == message) {
      return true;
    }
  }
  return false;
}
context.prototype.deleteMessage = function(message) {
  var size = this.messages.length;
  var isMessage = false;
  for (var i = 0; i < size; i++) {
    if (this.messages [i] == message) {
      this.messages [i] = null;
    } else if (this.messages [i] != null) {
      isMessage = true;
    }
  }
  if (!isMessage) {
    this.messages.clear();
  }
}
*/
context.prototype.clearObservation = function() {
  this.observations.clear();
  this.groups.clear();
  this.days.clear();
  this.trains.clear();
}
context.prototype.addObservation = function(obs) {
  var index = this.observations.length; 
  this.observations [index] = obs;
}
context.prototype.getObservations = function() {
  return this.observations;
}
context.prototype.getObservationById = function(id) {
  if (id == undefined) {
    return null;
  }
  var size = this.observations.length;
  for (var i = 0; i < size; i++) {
    if (this.observations [i].id == id) {
      return this.observations [i];
    }
  }
  return null;
}

context.prototype.clearGroup = function() {
  this.groups.clear();
  this.days.clear();
  this.trains.clear();
}
context.prototype.addGroup = function(group) {
  var index = this.groups.length; 
  this.groups [index] = group;
}
context.prototype.getGroups = function() {
  return this.groups;
}
context.prototype.getGroupById = function(id) {
  var size = this.groups.length;
  for (var i = 0; i < size; i++) {
    if (this.groups [i].id == id) {
      return this.groups [i];
    }
  }
  return null;
}

context.prototype.clearDay = function() {
  this.days.clear();
  this.trains.clear();
}
context.prototype.addDay = function(day) {
  var index = this.days.length; 
  this.days [index] = day;
}
context.prototype.getDays = function() {
  return this.days;
}
context.prototype.getDayById = function(id) {
  var size = this.days.length;
  for (var i = 0; i < size; i++) {
    if (this.days [i].id == id) {
      return this.days [i];
    }
  }
  return null;
}

context.prototype.clearTrain = function() {
  this.trains.clear();
}
context.prototype.addTrain = function(day) {
  var index = this.trains.length; 
  this.trains [index] = day;
}
context.prototype.getTrains = function() {
  return this.trains;
}
context.prototype.getTrainById = function(id) {
  var size = this.trains.length;
  for (var i = 0; i < size; i++) {
    if (this.trains [i].id == id) {
      return this.trains [i];
    }
  }
  return null;
}

context.prototype.hashChangeListener = function(event) {
  var hash = window.location.hash.removeHash();
  
  if (hash == "") {
    listener.writeObservations();
    return;
  }
  
  var splitted = hash.split("-");
  if (splitted[0] == "o") {
    listener.writeGroups(splitted[1]);
  } else
  if (splitted[0] == "g") {
    listener.writeDays(splitted[1]);
  } else
  if (splitted[0] == "d") {
    listener.writeTrains(splitted[1]);
  } else
  if (splitted[0] == "t") {
    listener.writeOneTrain(splitted[1]);
  } else
  
  if (splitted[0] == "c") {
    if (splitted[1] == "observation") {
      UI.newObservation();
    } else if (splitted[1] == "group") {
      UI.newGroup(splitted[2]);
    } else if (splitted[1] == "day") {
      UI.newDay(splitted[2]);
    } else if (splitted[1] == "train") {
      UI.newTrain(splitted[2]);
    } else if (false) {
    
    }
    //tvorime neco...
  }
  
  //upravujeme neco 
  if (splitted[0] == "u") {
    if (splitted[2] == undefined) {
      //chyba...
      listener.writeObservations();
      return;
    }
      
    if (splitted[1] == "observation") {
      listener.writeObservationUpdate(splitted[2]);
    } else 
    if (splitted[1] == "group") {
      listener.writeGroupUpdate(splitted[2]);
    } else 
    if (splitted[1] == "day") {
      listener.writeDayUpdate(splitted[2]);
    } else 
    if (splitted[1] == "train") {
      listener.writeTrainUpdate(splitted[2]);
    } 
    //tvorime neco...
  }
  
  if (splitted[0] == "del") {
    if (splitted[2] == undefined) {
      listener.writeObservations();
      return;
    }
      
    if (splitted[1] == "observation") {
      listener.deleteObservation(splitted[2]);
    } else if (splitted[1] == "group") {
      listener.deleteGroup(splitted[2]);
    } else if (splitted[1] == "day") {
      listener.deleteDay(splitted[2]);
    } else if (splitted[1] == "train") {
      listener.deleteTrain(splitted[2]);
    } 
    //tvorime neco...
  }
}
context.prototype.getIdFromHash = function() {
  var hash = window.location.hash.removeHash();
  var splitted = hash.split("-");
  if (splitted[0] == "o" || splitted[0] == "g" || splitted[0] == "d" || splitted[0] == "t" || splitted[0] == "r") {
    return splitted[1];
  }
}

var Globals = new context();
//alert(Globals);
