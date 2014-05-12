// JavaScript Document

var Observation = function(JSONobject) {
  if (JSONobject != null) {
    this.id = JSONobject.id;
    this.name = JSONobject.name;
  } else {
    this.id = "";
    this.name = "";
  }
}

Observation.prototype.setName = function(name) {
  this.name = name;
}

var Group = function(JSONobject) {
  if (JSONobject != null) {
    this.id = JSONobject.id;
    this.name = JSONobject.name;
    this.observation = Globals.getObservationById(JSONobject.observationId);
    this.observationId = JSONobject.observationId;
  } else {
    this.id = "";
    this.name = "";
    this.observation = null;
    this.observationId = "";
  }
}
Group.prototype.setObservation = function(obs) {
  this.observation = obs;
  this.observationId = obs.id;
}

Group.prototype.getMapping = function() {
  return new GroupMap(this);
}

var GroupMap = function(gr) {
  this.name = gr.name;
  this.id = gr.id;
  this.observationId = gr.observationId;
}

var Day = function(JSONobject) {
  if (JSONobject != null) {
    this.id = JSONobject.id;
    this.name = JSONobject.name;
    this.group = Globals.getGroupById(JSONobject.groupId);
    this.groupId = JSONobject.groupId;
  } else {
    this.id = "";
    this.name = "";
    this.group = null;
    this.groupId = "";
  }
}
Day.prototype.setGroup = function(group) {
  this.group = group;
  this.groupId = group.id;
}

Day.prototype.getMapping = function() {
  return new DayMap(this);
}

var DayMap = function(day) {
  this.name = day.name;
  this.id = day.id;
  this.groupId = day.groupId;
}

var Train = function(JSONobject) {
  if (JSONobject != null) {
    this.id = JSONobject.id;
    this.number = JSONobject.number;
    this.type = JSONobject.type;
    this.limits = JSONobject.limits;
    this.track = JSONobject.track;
    this.day = Globals.getDayById(JSONobject.dayId);
    this.dayId = JSONobject.dayId;
  } else {
    this.id = "";
    this.number = "";
    this.type = "";
    this.limits = "";
    this.track = "";
    this.day = "";
    this.dayId = "";
  }
}

Train.prototype.getMapping = function() {
  return new TrainMap(this);
}

var TrainMap = function(train) {
  this.number = train.number;
  this.type = train.type;
  this.limits = train.limits;
  this.track = train.track;
  this.dayId = train.dayId;
}