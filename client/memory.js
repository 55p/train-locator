
var memory = function() {
  this.allObservations = null; //reference pole se seznamem vsech pozorovani
  
  this.readedObservation = new Array(); //pole pro pozorovani, u kterych jsou nactena kompletni data.
  this.groups = new Array();
  this.days = new Array();
  this.trains = new Array();
  
  this.recordMemory = new Array(); //pole pro nactena pozorovani.
}

//zjisti, zda jsou zaznamy nacteny, vraci true/false. Key = mesic_rok nebo actual pro aktuální postrehy
memory.prototype.isInMemory = function(observation, key) {
  for (var i = 0; i < this.recordMemory.length; i++) {
    var mem = this.recordMemory[i];
    if (mem.id == observation.id && mem.key == key) {
      return true;
    }
  }
  return false;
}
//vrati nactene zaznamy. Key viz predchozi funkce.
memory.prototype.getRecords = function(observation, key) {
  for (var i = 0; i < this.recordMemory.length; i++) {
    var mem = this.recordMemory[i];
    if (mem.id == observation.id && mem.key == key) {
      return mem.records;
    }
  }
  return null;
}
//ulozi nactene zaznamy. Key viz predchozi funkce.
memory.prototype.addRecords = function(observation, key, records) {
  var index = this.recordMemory.length;
  this.recordMemory[index] = {"id":observation.id, "key": key, "records":records};
}

//prida jeden (prave odeslany) zaznam do seznamu.
memory.prototype.storeRecord = function(record) {
  var observation = this.getTrainById(record.trainId).day.group.observation;
  if (this.isInMemory(observation, "actual")) {
    var rec = this.getRecords(observation, "actual");
    var len = rec.length;
    rec[len] = record;
  }
  var m_y_key = record.month + "_" + record.year;
  if (this.isInMemory(observation, m_y_key)) {
    var rec = this.getRecords(observation, m_y_key);
    var len = rec.length;
    rec[len] = record;
  }
}

//prida pozorovani do seznamu vsech pozorovani.
memory.prototype.addObservation = function(observation) {
  if (this.allObservations == null) {
    this.allObservations = new Array();
  }
  var index = this.allObservations.length;
  this.allObservations[index] = observation;
}

//ulozi pozorovani, ke kteremu jsou nactena ostatni data
memory.prototype.addReadedObservation = function(obs) {
  var index = this.readedObservation.length;
  this.readedObservation[index] = obs;
}
//ulozi turnusovou skupinu
memory.prototype.addGroup = function(gruop) {
  var index = this.groups.length;
  this.groups[index] = gruop;
}
//ulozi turnusovy den.
memory.prototype.addDay = function(day) {
  var index = this.days.length;
  this.days[index] = day;
}
//ulozi vlak.
memory.prototype.addTrain = function(train) {
  var index = this.trains.length;
  this.trains[index] = train;
}

//zjisti, zda je pozorovani nacteno.
memory.prototype.isReadedObservation = function(idObs) {
  for (var i = 0; i < this.readedObservation.length; i++) {
    if (this.readedObservation[i].id == idObs) return true;
  }
  return false;
}
//vrati nactene pozorovani dle ID. 
memory.prototype.getObservationById = function(id) {
  for (var i = 0; i < this.readedObservation.length; i++) {
    if (this.readedObservation[i].id == id) return this.readedObservation[i];
  }
  return null;
}
//vrati nactenou TS dle ID.
memory.prototype.getGroupById = function(id) {
  for (var i = 0; i < this.groups.length; i++) {
    if (this.groups[i].id == id) return this.groups[i];
  }
  return null;
}
//vrati nacteny TD dle ID.
memory.prototype.getDayById = function(id) {
  for (var i = 0; i < this.days.length; i++) {
    if (this.days[i].id == id) return this.days[i];
  }
  return null;
}
//vrati nacteny vlak dle ID.
memory.prototype.getTrainById = function(id) {
  for (var i = 0; i < this.trains.length; i++) {
    if (this.trains[i].id == id) return this.trains[i];
  }
  return null;
}

//zjisti, zda je nacteny den dle sveho ID.
memory.prototype.isReadedDay = function(idDay) {
  for (var i = 0; i < this.days.length; i++) {
    if (this.days[i].id == idDay) return true;
  }
  return false;
}
//zjisti, zda je nacteny vlak dle sveho ID.
memory.prototype.isReadedTrain = function(idTrain) {
  for (var i = 0; i < this.trains.length; i++) {
    if (this.trains[i].id == idTrain) return true;
  }
  return false;
}

//najde vlaky dle cisla vlaku.
memory.prototype.findTrainByNumber = function(nbr, observation) {
  var results = new Array();
  var index = 0;

  for (var i = 0; i < this.trains.length; i++) {
    if (this.trains[i].number == nbr &&
        this.trains[i].day.group.observation.id == observation.id
       ) {
      results[index++] = this.trains[i];
    }
  }
  return results;
}

memory.prototype.removeAll = function() {
  this.allObservations = null; //reference pole se seznamem vsech pozorovani
  
  this.readedObservation = new Array(); //pole pro pozorovani, u kterych jsou nactena kompletni data.
  this.groups = new Array();
  this.days = new Array();
  this.trains = new Array();
  
  this.recordMemory = new Array(); //pole pro nactena pozorovani.
}

var Memory = new memory();
