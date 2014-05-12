// JavaScript Document

var Writer = function() {
  this.content = document.getElementById("content");
  this.error = document.getElementById("error");
  this.defaultTitle = "Sledování nasazení vozidel";
}
Writer.prototype.writeError = function (text) {
  var par = document.createElement("p");
  this.error.appendChild(par);
  par.innerHTML = text;
}
Writer.prototype.clearError = function() {
  this.error.innerHTML = "";
}

Writer.prototype.newGroup = function(obsId) {
  this.error.innerHTML = "";
  this.content.innerHTML = "";
  
  this.writeTitle("Nová turnusová skupina");
  var form = this.createGroupForm(null);
  
  var obsId = this.createHiddenInput("observationId", obsId);
  form.appendChild(obsId);
  var method = this.createHiddenInput("method", "POST");
  form.appendChild(method);
  
  this.content.appendChild(form);
}
Writer.prototype.updateGroupForm = function(group) {
  this.error.innerHTML = "";
  this.content.innerHTML = "";
  
  this.writeTitle("Upravit skupinu");
  var form = this.createGroupForm(group);
  
  var method = this.createHiddenInput("method", "PUT");
  var id = this.createHiddenInput("id", group.id);

  form.appendChild(method);
  form.appendChild(id);
  
  this.content.appendChild(form);
}
Writer.prototype.createGroupForm = function(group) {
  var form = document.createElement("form");
  form.addEventListener("submit", listener.submitGroup.bind(listener), true);
  form.addEventListener("reset", function(e) {
    window.history.back();
  }, true);
  
  var par = this.createPIn(form);
  
  var nameText = "";
  if (group != null) {
    nameText = group.name;
  }
  
  var name = this.createTextInput("Jméno", "name", nameText);
  par.appendChild(name);
  this.appendLine(par);
  
  var submit = document.createElement("input");
  submit.type = "submit";
  submit.value = "odeslat";
  par.appendChild(submit);
  
  var reset = document.createElement("input");
  reset.type = "reset";
  reset.value = "storno";
  par.appendChild(reset);
  
  return form;
}

Writer.prototype.newDay = function(groupId) {
  this.error.innerHTML = "";
  this.content.innerHTML = "";
  
  this.writeTitle("Nový turnusový den");
  var form = this.createDayForm(null);
  
  var obsId = this.createHiddenInput("groupId", groupId);
  form.appendChild(obsId);
  var method = this.createHiddenInput("method", "POST");
  form.appendChild(method);
  
  this.content.appendChild(form);
}
Writer.prototype.updateDayForm = function(day) {
  this.error.innerHTML = "";
  this.content.innerHTML = "";
  
  this.writeTitle("Upravit turnusový den");
  var form = this.createDayForm(day);
  
  var method = this.createHiddenInput("method", "PUT");
  var id = this.createHiddenInput("id", day.id);

  form.appendChild(method);
  form.appendChild(id);
  
  this.content.appendChild(form);
}
Writer.prototype.createDayForm = function(day) {
  var form = document.createElement("form");
  form.addEventListener("submit", listener.submitDay.bind(listener), true);
  form.addEventListener("reset", function(e) {
    window.history.back();
  }, true);
  
  var par = this.createPIn(form);
  
  var nameText = "";
  if (day != null) {
    nameText = day.name;
  }
  
  var name = this.createTextInput("Jméno", "name", nameText);
  par.appendChild(name);
  this.appendLine(par);
  
  var submit = document.createElement("input");
  submit.type = "submit";
  submit.value = "odeslat";
  par.appendChild(submit);
  
  var reset = document.createElement("input");
  reset.type = "reset";
  reset.value = "storno";
  par.appendChild(reset);
  
  return form;
}

Writer.prototype.newTrain = function(dayId) {
  this.error.innerHTML = "";
  this.content.innerHTML = "";
  
  this.writeTitle("Nový vlak");
  var form = this.createTrainForm(null);
  
  var obsId = this.createHiddenInput("dayId", dayId);
  form.appendChild(obsId);
  var method = this.createHiddenInput("method", "POST");
  form.appendChild(method);
  
  this.content.appendChild(form);
}
Writer.prototype.updateTrainForm = function(train) {
  this.error.innerHTML = "";
  this.content.innerHTML = "";
  
  this.writeTitle("Upravit turnusový den");
  var form = this.createTrainForm(train);
  
  var method = this.createHiddenInput("method", "PUT");
  var id = this.createHiddenInput("id", train.id);

  form.appendChild(method);
  form.appendChild(id);
  
  this.content.appendChild(form);
}
Writer.prototype.createTrainForm = function(train) {
  var form = document.createElement("form");
  form.addEventListener("submit", listener.submitTrain.bind(listener), true);
  form.addEventListener("reset", function(e) {
    window.history.back();
  }, true);
  
  var par = this.createPIn(form);
  
  
  var numberText = "";
  if (train != null) {
    numberText = train.number;
  }
  var typeText = "";
  if (train != null) {
    typeText = train.type;
  }
  var trackText = "";
  if (train != null) {
    trackText = train.track;
  }
  var limitsText = "";
  if (train != null) {
    limitsText = train.limits;
  }
  
  var number = this.createIntegerInput("Číslo", "number", numberText);
  par.appendChild(number);
  this.appendLine(par);
  
  var type = this.createTextInput("Typ vlaku", "type", typeText);
  par.appendChild(type);
  this.appendLine(par);
  var track = this.createTextInput("Trasa vlaku", "track", trackText);
  par.appendChild(track);
  this.appendLine(par);
  var limits = this.createTextInput("Omezení jízdy", "limits", limitsText);
  par.appendChild(limits);
  this.appendLine(par);
  
  var submit = document.createElement("input");
  submit.type = "submit";
  submit.value = "odeslat";
  par.appendChild(submit);
  
  var reset = document.createElement("input");
  reset.type = "reset";
  reset.value = "storno";
  par.appendChild(reset);
  
  return form;
}

Writer.prototype.newObservation = function() {
  this.error.innerHTML = "";
  this.content.innerHTML = "";
  
  this.writeTitle("Nová sledovačka");
  var form = this.createObservationForm(null);
  
  var method = this.createHiddenInput("method", "POST");
  form.appendChild(method);
  
  this.content.appendChild(form);
}
Writer.prototype.updateObservationForm = function(observation) {
  this.error.innerHTML = "";
  this.content.innerHTML = "";
  
  this.writeTitle("Upravit sledovačku");
  var form = this.createObservationForm(observation);
  
  var method = this.createHiddenInput("method", "PUT");
  var id = this.createHiddenInput("id", observation.id);
  form.appendChild(method);
  form.appendChild(id);
  
  
  this.content.appendChild(form);
}

Writer.prototype.createObservationForm = function(observation) {
  var form = document.createElement("form");
  form.addEventListener("submit", listener.submitObservation.bind(listener), true);
  form.addEventListener("reset", function(e) {
    window.history.back();
  }, true);
  
  var par = this.createPIn(form);
  
  var nameText = "";
  if (observation != null) {
    nameText = observation.name;
  }
  
  var name = this.createTextInput("Jméno", "name", nameText);
  par.appendChild(name);
  this.appendLine(par);
  
  var submit = document.createElement("input");
  submit.type = "submit";
  submit.value = "odeslat";
  par.appendChild(submit);
  
  var reset = document.createElement("input");
  reset.type = "reset";
  reset.value = "storno";
  par.appendChild(reset);
  
  return form;
}
Writer.prototype.createTextInput = function(labelText, name, value) {
  var input = document.createElement("input");
  input.type = "text";
  input.name = name;
  input.value = value;
  
  var label = document.createElement("label");
  label.innerHTML = labelText;
  label.appendChild(input);
  
  return label;
}
Writer.prototype.createIntegerInput = function(labelText, name, value) {
  var input = document.createElement("input");
  input.type = "number";
  input.name = name;
  input.value = value;
  
  var label = document.createElement("label");
  label.innerHTML = labelText;
  label.appendChild(input);
  
  return label;
}
Writer.prototype.createHiddenInput = function(name, value) {
  var input = document.createElement("input");
  input.type = "hidden";
  input.name = name;
  input.value = value;
  
  return input;
}

Writer.prototype.writeObservationList = function() {
  this.error.innerHTML = "";
  this.content.innerHTML = "";
  
  this.writeTitle(this.defaultTitle);
  var list = Globals.getObservations();
  
  var par = this.createP();
  if (list.length > 0) {
    for (var i = 0; i < list.length; i++) {
      this.writeObservation(par, list[i]);
    }
  } else {
    par.innerHTML = "Žádná sledovačka nenalezena.";
  }
  var par2 = this.createP();
  
  var link = document.createElement("a");
  link.href="";
  link.addEventListener("click", this.createObservation.bind(this), true);
  link.innerHTML = "nová sledovačka";
  par2.appendChild(link);
}
Writer.prototype.writeObservation = function(dest, obs) {
  var link = document.createElement("a");
  link.href = "";
  link.setAttribute("data-id", obs.id);
  link.addEventListener("click", this.linkGroups.bind(this), true);
  link.innerHTML = obs.name;
  
  dest.appendChild(link);
  this.appendLine(dest);
}

Writer.prototype.writeGroupList = function() {
  var list = Globals.getGroups();
  if (list.length == 0) {
    var id = Globals.getIdFromHash();
    listener.writeObservationNoGroup(id);
  } else {
    this.error.innerHTML = "";
    this.content.innerHTML = "";
    this.writeTitle(list[0].observation.name);
    
    var par = this.createP();
    if (list.length > 0) {
      for (var i = 0; i < list.length; i++) {
        this.writeGroup(par, list[i]);
      }
    }
    
    this.writeGroupCommons(list[0].observation);
  }
}
Writer.prototype.writeGroup = function(dest, group) {
  var link = document.createElement("a");
  link.href = "";
  link.setAttribute("data-id", group.id);
  link.addEventListener("click", this.linkDays.bind(this), true);
  link.innerHTML = group.name;
  
  dest.appendChild(link);
  this.appendLine(dest);
}
Writer.prototype.writeNoGroup = function (obs) {
  this.error.innerHTML = "";
  this.content.innerHTML = "";
  this.writeTitle(obs.name);
  var p = this.createP();
  this.appendText(p, "Ve sledovačce není žádná skupina.");
  this.appendLine(p);
  
  var linkDelete = document.createElement("a");
  linkDelete.href="";
  linkDelete.setAttribute("data-id", obs.id);
  linkDelete.addEventListener("click", this.deleteObservation.bind(this), true);
  linkDelete.innerHTML = "smazat sledovačku";
  p.appendChild(linkDelete);
  
  this.writeGroupCommons(obs);
}

Writer.prototype.writeGroupCommons = function (obs) {
  var p2 = this.createP();
  var linkCreate = document.createElement("a");
  linkCreate.href="";
  linkCreate.setAttribute("data-id", obs.id);
  linkCreate.addEventListener("click", this.createGroup.bind(this), true);
  linkCreate.innerHTML = "vytvořit novou skupinu";
  p2.appendChild(linkCreate);
  
  this.appendLine(p2);
  
  var linkUpdate = document.createElement("a");
  linkUpdate.href="";
  linkUpdate.setAttribute("data-id", obs.id);
  linkUpdate.addEventListener("click", this.updateObservation.bind(this), true);
  linkUpdate.innerHTML = "upravit sledovačku";
  p2.appendChild(linkUpdate);
  
  var p3 = this.createP();
  var link = document.createElement("a");
  link.href="";
  link.addEventListener("click", this.allObservation.bind(this), true);
  link.innerHTML = "zpět na sledovačky";
  
  p3.appendChild(link);
}

Writer.prototype.writeTrainList = function() {
  var list = Globals.getTrains();
  if (list.length == 0) {
    var id = Globals.getIdFromHash();
    listener.writeDayNoTrain(id);
  } else {
    this.error.innerHTML = "";
    this.content.innerHTML = "";
    this.writeTitle(list[0].day.name);
    
    var par = this.createP();
    if (list.length > 0) {
      for (var i = 0; i < list.length; i++) {
        this.writeTrain(par, list[i]);
      }
    }
    
    this.writeTrainCommons(list[0].day);
  }
}

Writer.prototype.writeOneTrain = function(trainId) {
  var train = Globals.getTrainById(trainId);
  if (train == null) {
    console.log("train je null");
    //var id = Globals.getIdFromHash();
    //listener.writeDayNoTrain(id);
  } else {
    this.error.innerHTML = "";
    this.content.innerHTML = "";
    this.writeTitle(train.type + " " + train.number);
    
    var par = this.createP();
    this.appendText(par, "trasa: ");
    this.appendText(par, train.track);
    this.appendLine(par);
    this.appendText(par, "omezení jízdy: ");
    this.appendText(par, train.limits);
    this.appendLine(par);
    
    
    var linkDelete = document.createElement("a");
    linkDelete.href="";
    linkDelete.setAttribute("data-id", train.id);
    linkDelete.addEventListener("click", this.deleteTrain.bind(this), true);
    linkDelete.innerHTML = "smazat vlak";
    par.appendChild(linkDelete);
  
    
    var p2 = this.createP();
    var linkUpdate = document.createElement("a");
    linkUpdate.href="";
    linkUpdate.setAttribute("data-id", train.id);
    linkUpdate.addEventListener("click", this.updateTrain.bind(this), true);
    linkUpdate.innerHTML = "upravit vlak";
    p2.appendChild(linkUpdate);
    
    var p3 = this.createP();
    var link = document.createElement("a");
    link.href="";
    link.setAttribute("data-id", train.dayId);
    link.addEventListener("click", this.linkTrains.bind(this), true);
    link.innerHTML = "zpět na turnusové dny";
    
    p3.appendChild(link);
  }
}
Writer.prototype.writeTrain = function(dest, train) {
  var link = document.createElement("a");
  link.href = "";
  link.setAttribute("data-id", train.id);
  link.addEventListener("click", this.linkOneTrains.bind(this), true);
  link.innerHTML = train.type + " " + train.number;
  
  dest.appendChild(link);
  this.appendLine(dest);
}
Writer.prototype.writeNoTrain = function (day) {
  this.error.innerHTML = "";
  this.content.innerHTML = "";
  this.writeTitle(day.name);
  var p = this.createP();
  this.appendText(p, "Ve dni není žádný vlak.");
  this.appendLine(p);
  
  var linkDelete = document.createElement("a");
  linkDelete.href="";
  linkDelete.setAttribute("data-id", day.id);
  linkDelete.addEventListener("click", this.deleteDay.bind(this), true);
  linkDelete.innerHTML = "smazat turnusový den";
  p.appendChild(linkDelete);
  
  this.writeTrainCommons(day);
}
Writer.prototype.writeTrainCommons = function (day) {
  var p2 = this.createP();
  var linkCreate = document.createElement("a");
  linkCreate.href="";
  linkCreate.setAttribute("data-id", day.id);
  linkCreate.addEventListener("click", this.createTrain.bind(this), true);
  linkCreate.innerHTML = "vytvořit nový vlak";
  p2.appendChild(linkCreate);
  
  this.appendLine(p2);
  
  var linkUpdate = document.createElement("a");
  linkUpdate.href="";
  linkUpdate.setAttribute("data-id", day.id);
  linkUpdate.addEventListener("click", this.updateDay.bind(this), true);
  linkUpdate.innerHTML = "upravit turnusový den";
  p2.appendChild(linkUpdate);
  
  var p3 = this.createP();
  var link = document.createElement("a");
  link.href="";
  link.setAttribute("data-id", day.groupId);
  link.addEventListener("click", this.linkDaysFromTrain.bind(this), true);
  link.innerHTML = "zpět na turnusové dny";
  
  p3.appendChild(link);
}

Writer.prototype.writeDayList = function() {
  var list = Globals.getDays();
  if (list.length == 0) {
    var id = Globals.getIdFromHash();
    listener.writeGroupNoDay(id);
  } else {
    this.error.innerHTML = "";
    this.content.innerHTML = "";
    this.writeTitle(list[0].group.name);
    
    var par = this.createP();
    if (list.length > 0) {
      for (var i = 0; i < list.length; i++) {
        this.writeDay(par, list[i]);
      }
    }
    
    this.writeDayCommons(list[0].group);
  }
}
Writer.prototype.writeDay = function(dest, day) {
  var link = document.createElement("a");
  link.href = "";
  link.setAttribute("data-id", day.id);
  link.addEventListener("click", this.linkTrains.bind(this), true);
  link.innerHTML = day.name;
  
  dest.appendChild(link);
  this.appendLine(dest);
}
Writer.prototype.writeNoDay = function (group) {
  this.error.innerHTML = "";
  this.content.innerHTML = "";
  this.writeTitle(group.name);
  var p = this.createP();
  this.appendText(p, "Ve skupině není žádný den.");
  this.appendLine(p);
  
  var linkDelete = document.createElement("a");
  linkDelete.href="";
  linkDelete.setAttribute("data-id", group.id);
  linkDelete.addEventListener("click", this.deleteGroup.bind(this), true);
  linkDelete.innerHTML = "smazat turnusovou skupinu";
  p.appendChild(linkDelete);
  
  this.writeDayCommons(group);
}

Writer.prototype.writeDayCommons = function (group) {
  var p2 = this.createP();
  var linkCreate = document.createElement("a");
  linkCreate.href="";
  linkCreate.setAttribute("data-id", group.id);
  linkCreate.addEventListener("click", this.createDay.bind(this), true);
  linkCreate.innerHTML = "vytvořit nový turnusový den";
  p2.appendChild(linkCreate);
  
  this.appendLine(p2);
  
  var linkUpdate = document.createElement("a");
  linkUpdate.href="";
  linkUpdate.setAttribute("data-id", group.id);
  linkUpdate.addEventListener("click", this.updateGroup.bind(this), true);
  linkUpdate.innerHTML = "upravit skupinu";
  p2.appendChild(linkUpdate);
  
  var p3 = this.createP();
  var link = document.createElement("a");
  link.href="";
  link.setAttribute("data-id", group.observationId);
  link.addEventListener("click", this.linkGroupsFromDay.bind(this), true);
  link.innerHTML = "zpět na skupiny";
  
  p3.appendChild(link);
}



Writer.prototype.allObservation = function(e) {
  e.preventDefault();
  window.location.hash = "";
}
Writer.prototype.linkGroups = function(e) {
  e.preventDefault();
  var id = e.target.getAttribute("data-id");
  window.location.hash = "o-"+id;
}
Writer.prototype.linkGroupsFromDay = function(e) {
  e.preventDefault();
  var id = e.target.getAttribute("data-id");
  window.location.hash = "o-"+id;
}
Writer.prototype.linkDaysFromTrain = function(e) {
  e.preventDefault();
  var id = e.target.getAttribute("data-id");
  window.location.hash = "g-"+id;
}
Writer.prototype.linkDays = function(e) {
  e.preventDefault();
  var id = e.target.getAttribute("data-id");
  window.location.hash = "g-"+id;
}
Writer.prototype.linkTrains = function(e) {
  e.preventDefault();
  var id = e.target.getAttribute("data-id");
  window.location.hash = "d-"+id;
}
Writer.prototype.linkOneTrains = function(e) {
  e.preventDefault();
  var id = e.target.getAttribute("data-id");
  window.location.hash = "t-"+id;
}

Writer.prototype.createObservation = function(e) {
  e.preventDefault();
  window.location.hash = "c-observation";
}
Writer.prototype.updateObservation = function(e) {
  e.preventDefault();
  var id = e.target.getAttribute("data-id");
  window.location.hash = "u-observation-"+id;
}
Writer.prototype.deleteObservation = function(e) {
  e.preventDefault();
  var id = e.target.getAttribute("data-id");
  window.location.hash = "del-observation-"+id;
}

Writer.prototype.createGroup = function(e) {
  e.preventDefault();
  var id = e.target.getAttribute("data-id");
  window.location.hash = "c-group-"+id;
}
Writer.prototype.updateGroup = function(e) {
  e.preventDefault();
  var id = e.target.getAttribute("data-id");
  window.location.hash = "u-group-"+id;
}
Writer.prototype.deleteGroup = function(e) {
  e.preventDefault();
  var id = e.target.getAttribute("data-id");
  window.location.hash = "del-group-"+id;
}


Writer.prototype.createDay = function(e) {
  e.preventDefault();
  var id = e.target.getAttribute("data-id");
  window.location.hash = "c-day-"+id;
}
Writer.prototype.updateDay = function(e) {
  e.preventDefault();
  var id = e.target.getAttribute("data-id");
  window.location.hash = "u-day-"+id;
}
Writer.prototype.deleteDay = function(e) {
  e.preventDefault();
  var id = e.target.getAttribute("data-id");
  window.location.hash = "del-day-"+id;
}


Writer.prototype.createTrain = function(e) {
  e.preventDefault();
  var id = e.target.getAttribute("data-id");
  window.location.hash = "c-train-"+id;
}
Writer.prototype.updateTrain = function(e) {
  e.preventDefault();
  var id = e.target.getAttribute("data-id");
  window.location.hash = "u-train-"+id;
}
Writer.prototype.deleteTrain = function(e) {
  e.preventDefault();
  var id = e.target.getAttribute("data-id");
  window.location.hash = "del-train-"+id;
}


Writer.prototype.appendLine = function(dst) {
  dst.appendChild(document.createElement("br"));
}
Writer.prototype.writeTitle = function(title) {
  var h1 = document.createElement("h1");
  h1.innerHTML = title;
  this.content.appendChild(h1);
}
Writer.prototype.createP = function() {
  var par = document.createElement("p");
  this.content.appendChild(par);
  return par;
}
Writer.prototype.createPIn = function(dst) {
  var par = document.createElement("p");
  dst.appendChild(par);
  return par;
}
Writer.prototype.appendText = function(dst, text) {
  var textNode = document.createTextNode(text);
  dst.appendChild(textNode);
}

