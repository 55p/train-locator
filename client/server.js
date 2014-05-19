// JavaScript Document

var server = function() {
  this.source = "http://localhost:8888/"; //adresa serveru
}

server.prototype.findAllObservations = function(callback) { //vyhleda vsechna pozorovani Pokud jsou v local storage, tak je nacte.
  if (Storage.isStored("all_observation")) {
    var object = Storage.load("all_observation"); 
    this.processAllObservationData(JSON.parse(object));
    if (callback != null) {
      callback();
    }
    return;
  }
  
  var xhr = new XMLHttpRequest();
  xhr.open("GET", this.source+"observation", true);
  
  var fdr = this;
  xhr.addEventListener("readystatechange", function(event) {
    fdr.acceptAllObservations(event, callback)
  }, true);
  xhr.send("");
}
server.prototype.acceptAllObservations = function(event, callback) { //prijme vsechna pozorovani. 
  var xhr = event.target;
  if (xhr.readyState != 4) {
    return;
  }
  if (xhr.status == 200) {
    var object = JSON.parse(xhr.responseText);
    
    var expire = new Date();
    expire.setDate(expire.getDate()+3);
    Storage.save("all_observation", xhr.responseText, expire);
    
    this.processAllObservationData(object);
  } else {
    Notify.displayError("Seznam sledovaček nebyl úspěšně přijat.");
  }
  if (callback != null) {
    callback();
  }
}
server.prototype.processAllObservationData = function(object) { //prevede na objekty a nahazi je do pameti
  for (var i = 0; i < object.length; i++) {
    var obs = new Observation(object[i]);
    Memory.addObservation(obs);
  }
}


server.prototype.findObservationData = function(obsId, callback) { //vyhleda data pozorovani. Pokud jsou v local storage, tak je nacte.
//parametr: ID sledovacky
  if (Storage.isStored(obsId)) {
    var object = Storage.load(obsId); 
    this.processObservationData(JSON.parse(object));
    if (callback != null) {
      callback();
    }
    return;
  }
  
  var xhr = new XMLHttpRequest();
  xhr.open("GET", this.source+"observation/" +obsId+"/data", true);
  
  var fdr = this;
  xhr.addEventListener("readystatechange", function(event) {
    fdr.acceptObservationData(event, callback)
  }, true);
  xhr.send("");
}
server.prototype.findObservationDataByDay = function(dayId, callback) { //vyhleda data pozorovani. Nelze nacitat z local storage.
//parametr: ID turnusoveho dne.
  var xhr = new XMLHttpRequest();
  xhr.open("GET", this.source+"day/" +dayId+ "/data", true);
  
  var fdr = this;
  xhr.addEventListener("readystatechange", function(event) {
    fdr.acceptObservationData(event, callback)
  }, true);
  xhr.send("");
}
server.prototype.findObservationDataByTrain = function(trainId, callback) {//vyhleda data pozorovani. Nelze nacitat z local storage.
//parametr: ID vlaku
  var xhr = new XMLHttpRequest();
  xhr.open("GET", this.source+"train/" +trainId+ "/data", true);
  
  var fdr = this;
  xhr.addEventListener("readystatechange", function(event) {
    fdr.acceptObservationData(event, callback)
  }, true);
  xhr.send("");
}
server.prototype.acceptObservationData = function(event, callback) {//Prijme data pozorovani, ulozi je do local storage.
  var xhr = event.target;
  if (xhr.readyState != 4) {
    return;
  }
  if (xhr.status == 200) {
    var object = JSON.parse(xhr.responseText);
    var observation = new Observation(object.observation);
    
    var expire = new Date();
    expire.setDate(expire.getDate()+3);
    Storage.save(observation.id, xhr.responseText, expire);
    
    this.processObservationData(object);
  } else {
    Notify.displayError("Obsah sledovačky nebylo možné přijmout.");
  }
  if (callback != null) {
    callback();
  }
}
server.prototype.processObservationData = function (object) { //zparsuje data pozorovani na objekty a ulozi je do pameti.
  var observation = new Observation(object.observation);
  
  Memory.addReadedObservation(observation);
  
  for (var i = 0; i < object.groups.length; i++) {
    var group = new Group(object.groups[i]);
    Memory.addGroup(group);
  }
  for (var i = 0; i < object.days.length; i++) {
    var day = new Day(object.days[i]);
    Memory.addDay(day);
  }
  for (var i = 0; i < object.trains.length; i++) {
    var train = new Train(object.trains[i]);
    Memory.addTrain(train);
  }
}

server.prototype.findActualRecords = function(observation, callback) { //posle pozadavek na aktualni zaznamy, pokud nejsou v local storage.
  if (Storage.isStored(observation.id + "_actual")) {
    var object = Storage.load(observation.id + "_actual");
    this.processRecords(observation, "actual", JSON.parse(object));
    if (callback != null) {
      callback();
    }
    return;
  }
  
  var xhr = new XMLHttpRequest();
  xhr.open("GET", this.source+"record/observation/"+observation.id+"/actual/"+observation.actualDay, true);
  
  var fdr = this;
  xhr.addEventListener("readystatechange", function(event) {
    fdr.acceptRecords(observation, "actual", event, callback)
  }, true);
  xhr.send("");
}
server.prototype.findMonthRecords = function(observation, month, year, callback) { //posle pozadavek na zaznamy z daneho mesice, pokud nejsou v local storage. 
  var key = month+"_"+year;
  if (Storage.isStored(observation.id + "_" + key)) {
    var object = Storage.load(observation.id + "_" + key);
    this.processRecords(observation, key, JSON.parse(object));
    if (callback != null) {
      callback();
    }
    return;
  }
  
  var xhr = new XMLHttpRequest();
  xhr.open("GET", this.source+"record/observation/"+observation.id+"/"+year+"/"+month, true);
  
  var fdr = this;
  xhr.addEventListener("readystatechange", function(event) {
    fdr.acceptRecords(observation, key, event, callback)
  }, true);
  xhr.send("");
}
server.prototype.acceptRecords = function(observation, key, event, callback) { //prijme zaznamy a ulozi je do local storage.
  var xhr = event.target;
  if (xhr.readyState != 4) {
    return;
  }
  if (xhr.status == 200) {
    var object = JSON.parse(xhr.responseText);
    
    var expire = new Date();
    expire.setMinutes(expire.getMinutes()+20);
    Storage.save(observation.id + "_" + key, xhr.responseText, expire);
    
    this.processRecords(observation, key, object);
  } else {
    Notify.displayError("Záznamy pozorování se nepodařilo přijmout.");
  }
  if (callback != null) {
    callback();
  }
}
server.prototype.processRecords = function(observation, key, parsedJSON) { //zpracuje zaznamy a ulozi je do Memory. 
  var records = new Array();
  
  for (var i = 0; i < parsedJSON.length; i++) {
    var rec = new Record(parsedJSON[i]);
    records[i] = rec;
  }
  
  Memory.addRecords(observation, key, records);
}

server.prototype.sendRecord = function(record, callback) { //odesle zaznam na server 
  var xhr = new XMLHttpRequest();
  xhr.open("POST", this.source+"record/", true);
  var body = JSON.stringify(record);
  
  xhr.setRequestHeader("Content-type", "application/json");
  xhr.setRequestHeader("Content-length", body.length);
  
  xhr.setRequestHeader("Accept", "application/json");
  
  var fdr = this;
  xhr.addEventListener("readystatechange", function(event) {
    fdr.sendRecordResponse(event, callback)
  }, true);
  
  xhr.send(body);
}
server.prototype.sendRecordResponse = function(event, callback) { //prijme zaznam ze serveru a ulozi jej do Memory.
  var xhr = event.target;
  if (xhr.readyState != 4) {
    return;
  }
  if (xhr.status == 200) {
    var object = JSON.parse(xhr.responseText);
    var rec = new Record(object);
    var recMap = new RecordMap();
    recMap.setBy(rec);
    Memory.storeRecord(rec);
    Storage.storeRecord(rec.train.day.group.observation.id, recMap);
    Notify.displayNotify("Záznam byl uložen.");
  } else {
    Notify.displayError("Záznam se nepodařilo uložit.");
  }
  if (callback != null) {
    callback();
  }
}

server.prototype.sendMoreRecord = function(records, callback) { //odesle zaznamy na server 
  var xhr = new XMLHttpRequest();
  xhr.open("POST", this.source+"record/multiple", true);
  var body = JSON.stringify(records);
  
  xhr.setRequestHeader("Content-type", "application/json");
  xhr.setRequestHeader("Content-length", body.length);
  
  xhr.setRequestHeader("Accept", "application/json");
  
  var fdr = this;
  xhr.addEventListener("readystatechange", function(event) {
    fdr.sendMoreRecordResponse(event, callback)
  }, true);
  
  xhr.send(body);
}
server.prototype.sendMoreRecordResponse = function(event, callback) { //prijme zaznamy ze serveru a ulozi je do Memory.
  var xhr = event.target;
  if (xhr.readyState != 4) {
    return;
  }
  if (xhr.status == 200) {
    var object = JSON.parse(xhr.responseText);
    for (var i = 0; i < object.length; i++) {
      var rec = new Record(object[i]);
      Memory.storeRecord(rec);
      Storage.storeRecord(rec);
    }
  } else {
    Notify.displayError("Záznamy nebyly uloženy.");
  }
  if (callback != null) {
    callback();
  }
}


var Server = new server();
