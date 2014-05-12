// JavaScript Document

var finder = function() {
  this.source = "http://localhost:8888/";
}

finder.prototype.findAllObservations = function(callback) {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", this.source+"observation", true);
  
  var fdr = this;
  xhr.addEventListener("readystatechange", function(event) {
    fdr.acceptObservation(event, callback)
  }, true);
  xhr.send("");
}
finder.prototype.findObservation = function(obsId, callback) {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", this.source+"observation/"+obsId, true);
  
  var fdr = this;
  xhr.addEventListener("readystatechange", function(event) {
    fdr.acceptOneObservation(event, callback)
  }, true);
  xhr.send("");
}
finder.prototype.findGroup = function(grId, callback) {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", this.source+"group/"+grId, true);
  
  var fdr = this;
  xhr.addEventListener("readystatechange", function(event) {
    fdr.acceptOneGroup(event, callback)
  }, true);
  xhr.send("");
}
finder.prototype.findDay = function(dayId, callback) {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", this.source+"day/"+dayId, true);
  
  var fdr = this;
  xhr.addEventListener("readystatechange", function(event) {
    fdr.acceptOneDay(event, callback)
  }, true);
  xhr.send("");
}
finder.prototype.findTrain = function(trainId, callback) {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", this.source+"train/"+trainId, true);
  
  var fdr = this;
  xhr.addEventListener("readystatechange", function(event) {
    fdr.acceptOneTrain(event, callback)
  }, true);
  xhr.send("");
}
finder.prototype.findGroupsByObservationId = function(obsId, callback) {
  var observation = Globals.getObservationById(obsId);
  if (observation == null) {
    var cb = this.createGroupRequest.bind(this, obsId, callback);
    this.findObservation(obsId, cb);
  } else {
    this.createGroupRequest(obsId, callback);
  }
}
finder.prototype.findDaysByGroupId = function(groupId, callback) {
  var group = Globals.getGroupById(groupId);
  if (group == null) {
    var cb = this.createDayRequest.bind(this, groupId, callback);
    this.findGroup(groupId, cb);
  } else {
    this.createDayRequest(groupId, callback);
  }
}
finder.prototype.findTrainsByDayId = function(dayId, callback) {
  var day = Globals.getDayById(dayId);
  if (day == null) {
    var cb = this.createTrainRequest.bind(this, dayId, callback);
    this.findDay(dayId, cb);
  } else {
    this.createTrainRequest(dayId, callback);
  }
}

finder.prototype.createGroupRequest = function (obsId,callback) {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", this.source+"observation/"+obsId+"/group", true);
  
  var fdr = this;
  xhr.addEventListener("readystatechange", function(event) {
    fdr.acceptGroup(event, callback)
  }, true);
  xhr.send("");
}
finder.prototype.createDayRequest = function (groupId, callback) {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", this.source+"group/"+groupId+"/day", true);
  
  var fdr = this;
  xhr.addEventListener("readystatechange", function(event) {
    fdr.acceptDay(event, callback)
  }, true);
  xhr.send("");
}
finder.prototype.createTrainRequest = function (dayId, callback) {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", this.source+"day/"+dayId+"/train", true);
  
  var fdr = this;
  xhr.addEventListener("readystatechange", function(event) {
    fdr.acceptTrain(event, callback)
  }, true);
  xhr.send("");
}

finder.prototype.acceptObservation = function(event, callback) {
  var xhr = event.target;
  if (xhr.readyState != 4) {
    return;
  }
  if (xhr.status == 200) {
    var object = JSON.parse(xhr.responseText);
    
    Globals.clearObservation();
    for (i = 0; i < object.length; i++) {
      var obs = new Observation(object[i]);
      Globals.addObservation(obs);
    }
  }
  if (callback != null) {
    callback();
  }
}
finder.prototype.acceptOneObservation = function(event, callback) {
  var xhr = event.target;
  if (xhr.readyState != 4) {
    return;
  }
  if (xhr.status == 200) {
    var object = JSON.parse(xhr.responseText);
    var obs = new Observation(object);
    
    Globals.addObservation(obs);
  }
  if (callback != null) {
    callback();
  }
}
finder.prototype.acceptOneGroup = function(event, callback) {
  var xhr = event.target;
  if (xhr.readyState != 4) {
    return;
  }
  if (xhr.status == 200) {
    var object = JSON.parse(xhr.responseText);
    var group = new Group(object);
    
    Globals.addGroup(group);
  }
  if (callback != null) {
    callback();
  }
}
finder.prototype.acceptOneDay = function(event, callback) {
  var xhr = event.target;
  if (xhr.readyState != 4) {
    return;
  }
  if (xhr.status == 200) {
    var object = JSON.parse(xhr.responseText);
    var day = new Day(object);
    
    Globals.addDay(day);
  }
  if (callback != null) {
    callback();
  }
}
finder.prototype.acceptOneTrain = function(event, callback) {
  var xhr = event.target;
  if (xhr.readyState != 4) {
    return;
  }
  if (xhr.status == 200) {
    var object = JSON.parse(xhr.responseText);
    var train = new Train(object);
    
    Globals.addTrain(train);
  }
  if (callback != null) {
    callback();
  }
}

finder.prototype.acceptGroup = function(event, callback) {
  var xhr = event.target;
  if (xhr.readyState != 4) {
    return;
  }
  if (xhr.status == 200) {
    var object = JSON.parse(xhr.responseText);
    
    Globals.clearGroup();
    for (i = 0; i < object.length; i++) {
      var group = new Group(object[i]);
      Globals.addGroup(group);
    }
  }
  if (callback != null) {
    callback();
  }
}
finder.prototype.acceptDay = function(event, callback) {
  var xhr = event.target;
  if (xhr.readyState != 4) {
    return;
  }
  if (xhr.status == 200) {
    var object = JSON.parse(xhr.responseText);
    
    Globals.clearDay();
    for (i = 0; i < object.length; i++) {
      var day = new Day(object[i]);
      Globals.addDay(day);
    }
  }
  if (callback != null) {
    callback();
  }
}
finder.prototype.acceptTrain = function(event, callback) {
  var xhr = event.target;
  if (xhr.readyState != 4) {
    return;
  }
  if (xhr.status == 200) {
    var object = JSON.parse(xhr.responseText);
    
    Globals.clearTrain();
    for (i = 0; i < object.length; i++) {
      var train = new Train(object[i]);
      Globals.addTrain(train);
    }
  }
  if (callback != null) {
    callback();
  }
}

finder.prototype.createObservation = function(observation, callback) {
  var xhr = new XMLHttpRequest();
  xhr.open("POST", this.source+"observation", true);
  var body = JSON.stringify(observation);
  
  xhr.setRequestHeader("Content-type", "application/json");
  xhr.setRequestHeader("Content-length", body.length);
  
  xhr.setRequestHeader("Accept", "application/json");
  
  var fdr = this;
  xhr.addEventListener("readystatechange", function(event) {
    fdr.createObservationResponse(event, callback)
  }, true);
  
  xhr.send(body);
}
finder.prototype.createObservationResponse = function(event, callback) {
  var xhr = event.target;
  if (xhr.readyState != 4) {
    return;
  }
  if (xhr.status == 200 || xhr.status == 201) {
    alert("Sledovačka byla vytvořena.");
  } else {
    alert("Sledovačku se nepodařilo vytvořit.");
  }
  if (callback != null) {
    callback();
  }
}

finder.prototype.updateObservation = function(observation, callback) {
  var xhr = new XMLHttpRequest();
  xhr.open("PUT", this.source+"observation/"+observation.id, true);
  var body = JSON.stringify(observation);
  
  xhr.setRequestHeader("Content-type", "application/json");
  xhr.setRequestHeader("Content-length", body.length);
  
  xhr.setRequestHeader("Accept", "application/json");
  
  var fdr = this;
  xhr.addEventListener("readystatechange", function(event) {
    fdr.updateObservationResponse(event, callback)
  }, true);
  
  xhr.send(body);
}
finder.prototype.updateObservationResponse = function(event, callback) {
  var xhr = event.target;
  if (xhr.readyState != 4) {
    return;
  }
  if (xhr.status == 200) {
    alert("Sledovačka byla upravena.");
  } else {
    alert("Sledovačku se nepodařilo upravit.");
  }
  if (callback != null) {
    callback();
  }
}

finder.prototype.deleteObservation = function(observationId, callback) {
  var xhr = new XMLHttpRequest();
  xhr.open("DELETE", this.source+"observation/"+observationId, true);
  
  var fdr = this;
  xhr.addEventListener("readystatechange", function(event) {
    fdr.deleteObservationResponse(event, callback)
  }, true);
  
  xhr.send("");
}
finder.prototype.deleteObservationResponse = function(event, callback) {
  var xhr = event.target;
  if (xhr.readyState != 4) {
    return;
  }
  if (xhr.status == 204) {
    alert("Sledovačka byla smazána.");
  } else {
    alert("Sledovačku se nepodařilo smazat.");
  }
  if (callback != null) {
    callback();
  }
}

finder.prototype.deleteGroup = function(GroupId, callback) {
  var xhr = new XMLHttpRequest();
  xhr.open("DELETE", this.source+"group/"+GroupId, true);
  
  var fdr = this;
  xhr.addEventListener("readystatechange", function(event) {
    fdr.deleteGroupResponse(event, callback)
  }, true);
  
  xhr.send("");
}
finder.prototype.deleteGroupResponse = function(event, callback) {
  var xhr = event.target;
  if (xhr.readyState != 4) {
    return;
  }
  if (xhr.status == 204) {
    alert("Skupina byla smazána.");
  } else {
    alert("Skupinu se nepodařilo smazat.");
  }
  if (callback != null) {
    callback();
  }
}

finder.prototype.deleteDay = function(dayId, callback) {
  var xhr = new XMLHttpRequest();
  xhr.open("DELETE", this.source+"day/"+dayId, true);
  
  var fdr = this;
  xhr.addEventListener("readystatechange", function(event) {
    fdr.deleteDayResponse(event, callback)
  }, true);
  
  xhr.send("");
}
finder.prototype.deleteDayResponse = function(event, callback) {
  var xhr = event.target;
  if (xhr.readyState != 4) {
    return;
  }
  if (xhr.status == 204) {
    alert("Den byl smazán.");
  } else {
    alert("Den se nepodařilo smazat.");
  }
  if (callback != null) {
    callback();
  }
}

finder.prototype.deleteTrain = function(trainId, callback) {
  var xhr = new XMLHttpRequest();
  xhr.open("DELETE", this.source+"train/"+trainId, true);
  
  var fdr = this;
  xhr.addEventListener("readystatechange", function(event) {
    fdr.deleteTrainResponse(event, callback)
  }, true);
  
  xhr.send("");
}
finder.prototype.deleteTrainResponse = function(event, callback) {
  var xhr = event.target;
  if (xhr.readyState != 4) {
    return;
  }
  if (xhr.status == 204) {
    alert("Vlak byl smazán.");
  } else {
    alert("Vlak se nepodařilo smazat.");
  }
  if (callback != null) {
    callback();
  }
}


finder.prototype.createGroup = function(group, callback) {
  var xhr = new XMLHttpRequest();
  xhr.open("POST", this.source+"group", true);
  var body = JSON.stringify(group.getMapping());
  console.log(body);
  xhr.setRequestHeader("Content-type", "application/json");
  xhr.setRequestHeader("Content-length", body.length);
  
  xhr.setRequestHeader("Accept", "application/json");
  
  var fdr = this;
  xhr.addEventListener("readystatechange", function(event) {
    fdr.createGroupResponse(event, callback)
  }, true);
  
  xhr.send(body);
}
finder.prototype.createGroupResponse = function(event, callback) {
  var xhr = event.target;
  if (xhr.readyState != 4) {
    return;
  }
  if (xhr.status == 200 || xhr.status == 201) {
    alert("Skupina byla vytvořena.");
  } else {
    alert("Skupinu se nepodařilo vytvořit.");
  }
  if (callback != null) {
    callback();
  }
}

finder.prototype.updateGroup = function(group, callback) {
  var xhr = new XMLHttpRequest();
  xhr.open("PUT", this.source+"group/"+group.id, true);
  var body = JSON.stringify(group.getMapping());
  
  xhr.setRequestHeader("Content-type", "application/json");
  xhr.setRequestHeader("Content-length", body.length);
  
  xhr.setRequestHeader("Accept", "application/json");
  
  var fdr = this;
  xhr.addEventListener("readystatechange", function(event) {
    fdr.updateGroupResponse(event, callback)
  }, true);
  
  xhr.send(body);
}
finder.prototype.updateGroupResponse = function(event, callback) {
  var xhr = event.target;
  if (xhr.readyState != 4) {
    return;
  }
  if (xhr.status == 200) {
    alert("Skupina byla upravena.");
  } else {
    alert("Skupinu se nepodařilo upravit.");
  }
  if (callback != null) {
    callback();
  }
}


finder.prototype.createDay = function(day, callback) {
  var xhr = new XMLHttpRequest();
  xhr.open("POST", this.source+"day", true);
  var body = JSON.stringify(day.getMapping());
  console.log(body);
  xhr.setRequestHeader("Content-type", "application/json");
  xhr.setRequestHeader("Content-length", body.length);
  
  xhr.setRequestHeader("Accept", "application/json");
  
  var fdr = this;
  xhr.addEventListener("readystatechange", function(event) {
    fdr.createDayResponse(event, callback)
  }, true);
  
  xhr.send(body);
}

finder.prototype.createDayResponse = function(event, callback) {
  var xhr = event.target;
  if (xhr.readyState != 4) {
    return;
  }
  if (xhr.status == 200 || xhr.status == 201) {
    alert("Den byl vytvořen.");
  } else {
    alert("Den se nepodařilo vytvořit.");
  }
  if (callback != null) {
    callback();
  }
}

finder.prototype.updateDay = function(day, callback) {
  var xhr = new XMLHttpRequest();
  xhr.open("PUT", this.source+"day/"+day.id, true);
  var body = JSON.stringify(day.getMapping());
  
  xhr.setRequestHeader("Content-type", "application/json");
  xhr.setRequestHeader("Content-length", body.length);
  
  xhr.setRequestHeader("Accept", "application/json");
  
  var fdr = this;
  xhr.addEventListener("readystatechange", function(event) {
    fdr.updateDayResponse(event, callback)
  }, true);
  
  xhr.send(body);
}
finder.prototype.updateDayResponse = function(event, callback) {
  var xhr = event.target;
  if (xhr.readyState != 4) {
    return;
  }
  if (xhr.status == 200) {
    alert("Den byl upraven.");
  } else {
    alert("Den se nepodařilo upravit.");
  }
  if (callback != null) {
    callback();
  }
}

finder.prototype.createTrain = function(train, callback) {
  var xhr = new XMLHttpRequest();
  xhr.open("POST", this.source+"train", true);
  var body = JSON.stringify(train.getMapping());
  console.log(body);
  xhr.setRequestHeader("Content-type", "application/json");
  xhr.setRequestHeader("Content-length", body.length);
  
  xhr.setRequestHeader("Accept", "application/json");
  
  var fdr = this;
  xhr.addEventListener("readystatechange", function(event) {
    fdr.createTrainResponse(event, callback)
  }, true);
  
  xhr.send(body);
}

finder.prototype.createTrainResponse = function(event, callback) {
  var xhr = event.target;
  if (xhr.readyState != 4) {
    return;
  }
  if (xhr.status == 200 || xhr.status == 201) {
    alert("Vlak byl vytvořen.");
  } else {
    alert("Vlak se nepodařilo vytvořit.");
  }
  if (callback != null) {
    callback();
  }
}

finder.prototype.updateTrain = function(train, callback) {
  var xhr = new XMLHttpRequest();
  xhr.open("PUT", this.source+"train/"+train.id, true);
  var body = JSON.stringify(train.getMapping());
  
  xhr.setRequestHeader("Content-type", "application/json");
  xhr.setRequestHeader("Content-length", body.length);
  
  xhr.setRequestHeader("Accept", "application/json");
  
  var fdr = this;
  xhr.addEventListener("readystatechange", function(event) {
    fdr.updateTrainResponse(event, callback)
  }, true);
  
  xhr.send(body);
}
finder.prototype.updateTrainResponse = function(event, callback) {
  var xhr = event.target;
  if (xhr.readyState != 4) {
    return;
  }
  if (xhr.status == 200) {
    alert("Vlak byl upraven.");
  } else {
    alert("Vlak se nepodařilo upravit.");
  }
  if (callback != null) {
    callback();
  }
}

