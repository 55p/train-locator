var Observation = function(JSONobject) {  
  this.id = JSONobject.id;
  this.name = JSONobject.name;
    
  this.startDate = {"day": 15, "month":12, "year":2013};
  this.endDate = {"day": 13, "month":12, "year":2014};
  //this.headMiddle = 15; //po kolikatem dni se vypise znovu hlavicka, pri vypisu celeho mesice - nevyuzito
  this.headBottom = true; //zda se vypisuje hlavicka dole
  this.dateMiddle = false; //zda se vypisuje datum mezi sledovackami nebo dny sledovacky
  this.actualDay = 6; //kolik dni zpet se zobrazuje v aktualnich postrezich
  this.futureDay = 2; //kolik dni do budoucna se zobrazuje v aktualnich postrezich - zatim nema smysl, server neumi predpoklady 
  this.dayBackInsert = 5; //za kolik dni zpet lze vlozit zaznam
  this.minutesBetween = 15; //kolik minut pred odjezdem lze vlozit zaznam - nevyuzito
  this.summaryTodayTrains = true; //zda se v hlavicce tabulky shrnuti vypisuji jen dnesni vlaky - nevyuzito
  this.summaryLineLength = 4; //kolik vlaku se zobrazi na radku tabulky shrnuti
  this.summaryWriteType = false; //zda se v hlavicce shrnuti vypise typ vlaku.
  this.contactEmail = "sledovani.072@centrum.cz"; //kontaktni email
  
  this.groups = new Array();
}
Observation.prototype.addGroup = function(group) {
  var index = this.groups.length;
  this.groups[index] = group;
}
Observation.prototype.getStartDate = function(group) {
  return new Date(this.startDate.year, this.startDate.month-1, this.startDate.day, 12); 
}
Observation.prototype.getEndDate = function(group) {
  return new Date(this.endDate.year, this.endDate.month-1, this.endDate.day, 12); 
}
Observation.prototype.getTrainCount = function() { //pocet sledovanych vlaku ve sledovacce.
  var count = 0;
  for (var i = 0; i < this.groups.length; i++) {
    count += this.groups[i].trainCount();
  }
  return count;
}

//turnusova skupina
var Group = function(JSONobject) {
  this.id = JSONobject.id;
  this.name = JSONobject.name;
  this.observation = Memory.getObservationById(JSONobject.observationId);
  
  this.observation.addGroup(this);
  this.days = new Array();
}
Group.prototype.addDay = function(day) {
  var index = this.days.length;
  this.days[index] = day;
}
Group.prototype.trainCount = function() { //vrati poet vlaku
  var sum = 0; 
  for (var i = 0; i < this.days.length; i++) {
    sum += this.days[i].trains.length;
  }
  return sum;
}

//turnusovy den
var Day = function(JSONobject) {
  this.id = JSONobject.id;
  this.name = JSONobject.name;
  this.group = Memory.getGroupById(JSONobject.groupId);
  
  this.group.addDay(this);
  this.trains = new Array();
}
Day.prototype.addTrain = function(train) {
  var index = this.trains.length;
  this.trains[index] = train;
}
Day.prototype.isFromDay = function(trainId) { //zjisti, zda vlak s ID je z tohoto dne. Vyuzito pri vypisu shrnuti, kdy se vlaky kupi dle turnusovych dni. 
  for (var i = 0; i < this.trains.length; i++) {
    if (this.trains[i].id == trainId) {
      return true;
    }
  }
  return false;
}


var Train = function(JSONobject) {
  this.id = JSONobject.id;
  this.number = JSONobject.number;
  this.type = JSONobject.type;
  this.limits = JSONobject.limits;
  this.track = JSONobject.track;
  this.day = Memory.getDayById(JSONobject.dayId);
  
  this.day.addTrain(this);
}

var Record = function(JSONobject) {
  this.id = JSONobject.id;
  
  this.day = JSONobject.day;
  this.month = JSONobject.month;
  this.year = JSONobject.year;
  
  this.trainId = JSONobject.trainId;
  
  this.vlakova = JSONobject.vlakova;
  this.ridiciVuz = JSONobject.ridiciVuz;
  this.priprez = JSONobject.priprez;
  this.postrk = JSONobject.postrk;
  
  this.comment = JSONobject.comment;
  this.insertDate = JSONobject.insertDate;
  
  this.train = Memory.getTrainById(this.trainId);
}
Record.prototype.equals = function(other) { //porovna zaznamy pro vypis, tj. zobrazene stroje.
  if (this.vlakova != other.vlakova) return false;
  if (this.ridiciVuz != other.ridiciVuz) return false;
  if (this.priprez != other.priprez) return false;
  if (this.postrk != other.postrk) return false;
  return true;
}
Record.prototype.equalsAll = function(other) { //porovna zaznamy kompletne, tj. vcetne poznamky. Vyuzito pri vypisu poznamek. 
  if (this.vlakova != other.vlakova) return false;
  if (this.ridiciVuz != other.ridiciVuz) return false;
  if (this.priprez != other.priprez) return false;
  if (this.postrk != other.postrk) return false;
  if (this.comment != other.comment) return false;
  return true;
}

var RecordMap = function() {
  var today = new Date();
  this.day = today.getDate();
  this.month = today.getMonth()+1;
  this.year = today.getFullYear;
  
  this.trainId = "";
  
  this.vlakova = 0;
  this.ridiciVuz = 0;
  this.priprez = 0;
  this.postrk = 0;
  
  this.comment = "";
}
RecordMap.prototype.setDate = function(date) { //nastavi datum.
  this.day = date.getDate();
  this.month = date.getMonth()+1;
  this.year = date.getFullYear;
}
RecordMap.prototype.setBy = function(JSONobject) {
  this.id = JSONobject.id;
  
  this.day = JSONobject.day;
  this.month = JSONobject.month;
  this.year = JSONobject.year;
  
  this.trainId = JSONobject.trainId;
  
  this.vlakova = JSONobject.vlakova;
  this.ridiciVuz = JSONobject.ridiciVuz;
  this.priprez = JSONobject.priprez;
  this.postrk = JSONobject.postrk;
  
  this.comment = JSONobject.comment;
  this.insertDate = JSONobject.insertDate;
}