String.prototype.trim = function() { //trim pro string
  return this.replace(/(^\s*)|(\s*$)/g, "")
};
String.prototype.startsWith = function (str) {
  return this.slice(0, str.length) == str;
};

if (!Date.now) { //zajisteni date.now
  Date.now = function() {
    return new Date().getTime();
  }
}

Date.prototype.toMonthString = function() { //vrati mesic slovne
  return Date.getMonthString(this.getMonth());
} 
Date.prototype.toDMString = function() { //vrati kratky nazev dne, den a mesic.
  return Date.getShortDayString(this.getDay()) + " " + this.getDate() + ". " + (1+this.getMonth()) + ".";
}
Date.prototype.toDMYString = function() { //vrati uplny nazev dne, mesic a rok.
  return Date.getDayString(this.getDay()) + " " + this.getDate() + ". " + (1+this.getMonth()) + ". " + this.getFullYear();
}
Date.prototype.toDMY = function() { //vrati den, mesic a rok.
  return this.getDate() + ". " + (1+this.getMonth()) + ". " + this.getFullYear();
}
Date.daysInMonth = function(month, year) { //zjisti pocet dnu v mesici roku.
  return new Date(year, month, 0).getDate();
}
Date.prototype.isToday = function() { //zjisti, zda je datum dnesni.
  var date = new Date();
  return date.getDate() == this.getDate() && date.getMonth() == this.getMonth() && date.getFullYear() == this.getFullYear();
}
Date.prototype.toInputValue = function () { //prevede datum na format YYYY-MM-DD vyuzity pro min,max a value ve <input type="date" ... />
  var val = this.getFullYear()+"-";
  
  var month = (this.getMonth()+1);
  if (month < 10) {
    val = val+"0"+month+"-";
  } else {
    val = val+month+"-";
  }
  
  var date = this.getDate();
  if (date < 10) {
    val = val+"0"+date;
  } else {
    val = val+date;
  }
  
  return val;
}
Date.getDayString = function(i) { //prevede den v tydnu na retezec
  if (i == 0 || i == 7) {
    return "neděle";
  }
  if (i == 1) {
    return "pondělí";
  }
  if (i == 2) {
    return "úterý";
  }
  if (i == 3) {
    return "středa";
  }
  if (i == 4) {
    return "čtvrtek";
  }
  if (i == 5) {
    return "pátek";
  }
  if (i == 6) {
    return "sobota";
  }
}
Date.getShortDayString = function(i) { //prevede den v tydnu na kratky retezec
  if (i == 0 || i == 7) {
    return "ne";
  }
  if (i == 1) {
    return "po";
  }
  if (i == 2) {
    return "út";
  }
  if (i == 3) {
    return "st";
  }
  if (i == 4) {
    return "čt";
  }
  if (i == 5) {
    return "pá";
  }
  if (i == 6) {
    return "so";
  }
}
Date.getMonthString = function(i) { //vyjadri mesic slovne, prijma hodnoty 0-11
  switch(i) {
    case 0:
      return "leden";
    case 1:
      return "únor";
    case 2:
      return "březen";
    case 3:
      return "duben";
    case 4:
      return "květen";
    case 5:
      return "červen";
    case 6:
      return "červenec";
    case 7:
      return "srpen";
    case 8:
      return "září";
    case 9:
      return "říjen";
    case 10:
      return "listopad";
    case 11:
      return "prosinec";
  }
}
