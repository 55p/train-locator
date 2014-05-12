// JavaScript Document
var lst = function() {
  this.find = new finder();
}

lst.prototype.writeObservations = function() {
  var cb = UI.writeObservationList.bind(UI);
  
  this.find.findAllObservations(cb);
  //setTimeout(this.waitForObservations.bind(this), 100);
}
lst.prototype.writeObservationNoGroup = function(obsId) {
  var obs = Globals.getObservationById(obsId);
  if (obs == null) {
    var cb = this.waitOneObservation.bind(this, obsId);
    this.find.findObservation(obsId, cb);
  } else {
    UI.writeNoGroup(obs);
  }
}
lst.prototype.writeObservationUpdate = function(obsId) {
  var obs = Globals.getObservationById(obsId);
  if (obs == null) {
    var cb = this.waitOneObservationUpdate.bind(this, obsId);
    this.find.findObservation(obsId, cb);
  } else {
    UI.updateObservationForm(obs);
  }
}
lst.prototype.deleteObservation = function(obsId) {
  var cb = this.createCallback.bind(this);
  this.find.deleteObservation(obsId, cb);
}

lst.prototype.writeGroupNoDay = function(groupId) {
  var group = Globals.getGroupById(groupId);
  if (group == null) {
    var cb = this.waitOneGroup.bind(this, groupId);
    this.find.findGroup(groupId, cb);
  } else {
    UI.writeNoDay(group);
  }
}

lst.prototype.writeGroupUpdate = function(groupId) {
  var group = Globals.getGroupById(groupId);
  if (group == null) {
    var cb = this.waitOneGroupUpdate.bind(this, groupId);
    this.find.findGroup(groupId, cb);
  } else {
    UI.updateGroupForm(group);
  }
}
lst.prototype.deleteGroup = function(groupId) {
  var group = Globals.getGroupById(groupId);
  if (group == null) {
    var cb = this.deleteGroupDo.bind(this, groupId);
    this.find.findGroup(groupId, cb);
  } else {
    this.deleteGroupDo.bind(groupId);
  }
  
}
lst.prototype.deleteGroupDo = function(groupId) {
  var group = Globals.getGroupById(groupId);
  if (group == null) {
    alert("skupina nenalezena");
    var cb = this.createCallback.bind(this);
    cb();
  } else {
    var cb = this.groupCallback.bind(this, group.observationId);
    this.find.deleteGroup(groupId, cb);
  }
}

lst.prototype.deleteDay = function(dayId) {
  var day = Globals.getDayById(dayId);
  if (day == null) {
    var cb = this.deleteDayDo.bind(this, dayId);
    this.find.findDay(dayId, cb);
  } else {
    this.deleteDayDo(dayId);
  }
}
lst.prototype.deleteDayDo = function(dayId) {
  var day = Globals.getDayById(dayId);
  if (day == null) {
    alert("skupina nenalezena");
    var cb = this.createCallback.bind(this);
    cb();
  } else {
    var cb = this.dayCallback.bind(this, day.groupId);
    this.find.deleteDay(dayId, cb);
  }
}

lst.prototype.deleteTrain = function(trainId) {
  var train = Globals.getTrainById(trainId);
  if (train == null) {
    var cb = this.deleteTrainDo.bind(this, trainId);
    this.find.findTrain(trainId, cb);
  } else {
    this.deleteTrainDo(trainId);
  }
}
lst.prototype.deleteTrainDo = function(trainId) {
  var train = Globals.getTrainById(trainId);
  if (train == null) {
    alert("skupina nenalezena");
    var cb = this.createCallback.bind(this);
    cb();
  } else {
    var cb = this.trainCallback.bind(this, train.dayId);
    this.find.deleteTrain(trainId, cb);
  }
}

lst.prototype.writeDayNoTrain = function(dayId) {
  var day = Globals.getDayById(dayId);
  if (day == null) {
    var cb = this.waitOneDay.bind(this, dayId);
    this.find.findDay(dayId, cb);
  } else {
    UI.writeNoTrain(day);
  }
}
lst.prototype.writeDayUpdate = function(dayId) {
  var day = Globals.getDayById(dayId);
  if (day == null) {
    var cb = this.waitOneDayUpdate.bind(this, dayId);
    this.find.findDay(dayId, cb);
  } else {
    UI.updateDayForm(group);
  }
}
lst.prototype.writeTrainUpdate = function(trainId) {
  var tr = Globals.getTrainById(trainId);
  if (tr == null) {
    var cb = this.waitOneTrainUpdate.bind(this, trainId);
    this.find.findTrain(trainId, cb);
  } else {
    UI.updateTrainForm(group);
  }
}
/*
lst.prototype.deleteGroup = function(groupId) {
  //var group = Globals.getGroupById(groupId);
  var cb = this.groupCallback.bind(this, obsId);
  this.find.deleteObservation(obsId, cb);
}
*/




lst.prototype.writeGroups = function(obsId) {
  var cb = UI.writeGroupList.bind(UI);
  this.find.findGroupsByObservationId(obsId, cb);
}
lst.prototype.writeDays = function(grId) {
  var cb = UI.writeDayList.bind(UI);
  this.find.findDaysByGroupId(grId, cb);
}
lst.prototype.writeTrains = function(dayId) {
  var cb = UI.writeTrainList.bind(UI);
  this.find.findTrainsByDayId(dayId, cb);
}
lst.prototype.writeOneTrain = function(trId) {
  var train = Globals.getTrainById(trId);
  
  if (train == null) {
    var cb = UI.writeOneTrain.bind(UI, trId);
    this.find.findTrain(trId, cb);
  } else {
    UI.writeOneTrain(trId);
  }
  
}

lst.prototype.waitOneObservation = function(observationId) {
  var observ = Globals.getObservationById(observationId);
  if (observ != null) {
    UI.writeNoGroup(observ);
  } else {
    this.writeObservations();
    alert("Sledovačka neexistuje.");
  }
}
lst.prototype.waitOneObservationUpdate = function(observationId) {
  var observ = Globals.getObservationById(observationId);
  if (observ != null) {
    UI.updateObservationForm(observ);
  } else {
    this.writeObservations();
    alert("Sledovačka neexistuje.");
  }
}
lst.prototype.waitOneGroup = function(groupId) {
  var group = Globals.getGroupById(observationId);
  if (observ != null) {
    UI.writeNoDay(group);
  } else {
    alert("Skupina neexistuje.");
  }
}
lst.prototype.waitOneGroupUpdate = function(groupId) {
  var group = Globals.getGroupById(groupId);
  if (group != null) {
    UI.updateGroupForm(group);
  } else {
    alert("Skupina neexistuje.");
  }
}

lst.prototype.waitOneDay = function(dayId) {
  var day = Globals.getDayById(dayId);
  if (day != null) {
    UI.writeNoTrain(day);
  } else {
    alert("Den neexistuje.");
  }
}
lst.prototype.waitOneDayUpdate = function(dayId) {
  var day = Globals.getDayById(dayId);
  if (day != null) {
    UI.updateDayForm(day);
  } else {
    alert("Den neexistuje.");
  }
}
lst.prototype.waitOneTrainUpdate = function(trainId) {
  var train = Globals.getTrainById(trainId);
  if (train != null) {
    UI.updateTrainForm(train);
  } else {
    alert("Vlak neexistuje.");
  }
}


lst.prototype.submitGroup = function(event) {
  event.preventDefault();
  UI.clearError();
  var form = event.target;
  
  var method = this.findByName(form, "method");
  var name = this.findByName(form, "name");
  if (name == "") {
    UI.writeError("Jméno není vyplněno.");
    return;
  }
  
  var group = new Group(null);
  if (method == "POST") {
    var obsId = this.findByName(form, "observationId");
    if (obsId == "") {
      UI.writeError("ID sledovačky nezjištěno.");
      return;
    }
  
    group.name = name;
    group.observationId = obsId;
  
    var cb = this.groupCallback.bind(this, obsId);
    this.find.createGroup(group, cb);
  
  } else if (method == "PUT") {
    var id = this.findByName(form, "id");
    group = Globals.getGroupById(id);
    if (group == null) {
      alert("skupina nenalezena");
    } else {
      group.name = name;
      var cb = this.groupCallback.bind(this, group.observationId);
      this.find.updateGroup(group, cb);
    }
  }
}

lst.prototype.submitDay = function(event) {
  event.preventDefault();
  UI.clearError();
  var form = event.target;
  
  var method = this.findByName(form, "method");
  var name = this.findByName(form, "name");
  if (name == "") {
    UI.writeError("Jméno není vyplněno.");
    return;
  }
  
  var day = new Day(null);
  if (method == "POST") {
    var groupId = this.findByName(form, "groupId");
    if (groupId == "") {
      UI.writeError("ID turnusové skupiny nezjištěno.");
      return;
    }
  
    day.name = name;
    day.groupId = groupId;
  
    var cb = this.dayCallback.bind(this, groupId);
    this.find.createDay(day, cb);
  
  } else if (method == "PUT") {
    var id = this.findByName(form, "id");
    day = Globals.getDayById(id);
    if (day == null) {
      alert("den nenalezen");
    } else {
      day.name = name;
      var cb = this.dayCallback.bind(this, day.groupId);
      this.find.updateDay(day, cb);
    }
  }
}


lst.prototype.submitTrain = function(event) {
  event.preventDefault();
  UI.clearError();
  var form = event.target;
  
  var method = this.findByName(form, "method");

  var number = this.findByName(form, "number");
  var track = this.findByName(form, "track");
  var type = this.findByName(form, "type");
  var limits = this.findByName(form, "limits");

  var train = new Train(null);
  if (method == "POST") {
    var dayId = this.findByName(form, "dayId");
    if (dayId == "") {
      UI.writeError("ID turnusového dne nezjištěno.");
      return;
    }
  
    train.number = number;
    train.type = type;
    train.track = track;
    train.limits = limits;
    train.dayId = dayId;
  
    var cb = this.trainCallback.bind(this, dayId);
    this.find.createTrain(train, cb);
  
  } else if (method == "PUT") {
    var id = this.findByName(form, "id");
    train = Globals.getTrainById(id);
    if (train == null) {
      alert("vlak nenalezen");
    } else {
      train.number = number;
      train.type = type;
      train.track = track;
      train.limits = limits;
    
      var cb = this.trainCallback.bind(this, train.dayId);
      this.find.updateTrain(train, cb);
    }
  }
}


lst.prototype.groupCallback = function(obsId) {
  window.location.hash = 'o-'+obsId;
}
lst.prototype.dayCallback = function(groupId) {
  window.location.hash = 'g-'+groupId;
}
lst.prototype.trainCallback = function(dayId) {
  window.location.hash = 'd-'+dayId;
}

lst.prototype.submitObservation = function(event) {
  event.preventDefault();
  UI.clearError();
  var form = event.target;
  
  var method = this.findByName(form, "method");
  var name = this.findByName(form, "name");
  if (name == "") {
    UI.writeError("Jméno není vyplněno.");
    return;
  }
  var observation = new Observation(null);
  if (method == "POST") {
    observation.name = name;
    var cb = this.createCallback.bind(this);
    this.find.createObservation(observation, cb);
  
  } else if (method == "PUT") {
    var id = this.findByName(form, "id");
    observation = Globals.getObservationById(id);
    if (observation == null) {
      alert("sledovačka nenalezena");
    } else {
      observation.name = name;
      
      var cb = this.createCallback.bind(this);
      this.find.updateObservation(observation, cb);
    }
    
  }
}
lst.prototype.findByName = function (form, name) {
  for (var i = 0; i < form.length; i++) {
    if (form[i].name == name) {
      return form[i].value.trim();
    }
  }
  return null;
}
lst.prototype.createCallback = function () {
  window.location.hash = '';
}

/*
lst.prototype.waitForObservations = function() {
  var messageText = "allObservLoaded";
  if (Globals.isMessage(messageText)) {
    Globals.deleteMessage(messageText);
    UI.writeObservationList();
  } else {
    setTimeout(this.waitForObservations.bind(this), 100);
  }
} 
lst.prototype.waitForObservationNoGroups = function(obsId) {
  var messageText = "oneObservLoaded";
  if (Globals.isMessage(messageText)) {
    Globals.deleteMessage(messageText);
    var observ = Globals.getObservationById(obsId);
    if (observ != null) {
      UI.writeNoGroup(observ);
    } else {
      this.writeObservations();
      UI.writeError("Sledovačka se zadaným ID neexistuje.");
    }
  } else {
    setTimeout(this.waitForObservationNoGroups.bind(this), 100);
  }
} 
lst.prototype.waitForGroups = function() {
  var messageText = "groupByObsLoaded";
  if (Globals.isMessage(messageText)) {
    Globals.deleteMessage(messageText);
//    UI.writeGroupList(Globals.getGroups());
  } else {
    setTimeout(this.waitForGroups.bind(this), 100);
  }
}

lst.prototype.writeTable = function(obsId) {
  
}
*/
