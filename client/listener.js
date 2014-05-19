var lst = function() {
  this.rootUri = "http://localhost/locator";
  this.root = "locator/";
  this.UI = new ui();
  
  window.addEventListener('popstate', this.historyChange.bind(this));
}

//pro event typu history change.
lst.prototype.historyChange = function(event) {
  if (event.state != null) {
    var url = event.state.url;
    this.pageNavigator(url);
  }
}

//pro klik na buňku tabulky.
lst.prototype.tableClickListener = function (event) {
  var src = event.target;
  var type = src.getAttribute("data-type");
  var id = src.getAttribute("data-id");
  var date = src.getAttribute("data-date");
  
  var url = this.rootUri + "/" + "insert!" + type + "!" + id + "!" + date + ".html";
  
  window.history.pushState({url: url}, null, url);
  this.pageNavigator(url);
}
//odeslani formulare.
lst.prototype.formSubmitListener = function (event) {
  event.preventDefault();
  var form = event.target;
  
  var date = this.findByName(form, "date");
  var train = this.findByName(form, "train");
  var vlakova = this.findByName(form, "vlakova");
  var ridici = this.findByName(form, "ridici");
  var postrk = this.findByName(form, "postrk");
  var priprez = this.findByName(form, "priprez");
  var comment = this.findByName(form, "comment");
  
  var observationId = this.findByName(form, "observationId");
  var observation = Memory.getObservationById(observationId);
  
  if (observation == null) {
    return;
  }
   
  var trainField = form.querySelector("[name=train]");
  var trainFieldType = trainField.tagName.toLowerCase();
  
  var errorPar = form.querySelector("p");
  errorPar.innerHTML = "";
  
  var moreTrainPar = form.querySelector("p+p");
  
  var error = false;
  var submit = false;
  
  var trainObject = null;
  if (trainFieldType == "input") {
    trainObject = Memory.findTrainByNumber(train, observation);
    if (trainObject.length == 0) {
      this.writeError(errorPar, "Vlak nebyl nalezen.");
    } else if (trainObject.length > 1) {
      trainField.disabled = "disabled";
      if (moreTrainPar.innerHTML == "") {
        this.UI.writeTrains(trainObject);
      }
      
      var trId = this.findRadioValue(form, "trainId");
      if (trId != null) {
        trainObject = Memory.getTrainById(trId);
      } else {
        error = true;
      }
      
    } else {
      trainObject = trainObject[0];
    }
  } else if (trainFieldType == "select") {
    trainObject = Memory.getTrainById(train);
  }
  
  var dateObj = new Date(date);
  
  if (isNaN(dateObj.getTime())) {
    this.writeError(errorPar, "Datum nebylo zadáno ve správném formátu (YYYY-MM-DD).");
    error = true;
  } else if (observation !== null) { //kontrola rozmezi datumu
    var today = new Date();
    var firstInsertDate = new Date();
    firstInsertDate.setDate(today.getDate() - observation.dayBackInsert + 1);
    firstInsertDate.setHours(0);
    firstInsertDate.setMinutes(0);
    firstInsertDate.setSeconds(1);
    
    var lastInsertDate = new Date();
    lastInsertDate.setHours(23);
    lastInsertDate.setMinutes(59);
    lastInsertDate.setSeconds(59);
    
    var ok = dateObj > firstInsertDate && dateObj < lastInsertDate;
    if (!ok) {
      error = true;
      this.writeError(errorPar, "Datum není v povoleném intervalu ("+firstInsertDate.toDMY() + " - " + lastInsertDate.toDMY() + ").");
    }
  }
  
  
  if (vlakova < 100000 || vlakova > 899999) {
    if (vlakova != "" && vlakova != 0) {
      this.writeError(errorPar, "Číslo vlakové lok. je zadáno chybně.");
      error = true;
    } else {
      vlakova = 0;
    }
  } else {
    submit = true;
  }
  if (ridici < 900000 || ridici > 999999) {
    if (ridici != "" && ridici != 0) {
      this.writeError(errorPar, "Číslo řídicího vozu je zadáno chybně. Použili jste šestimístné označení?");
      error = true;
    } else {
      ridici = 0;
    }
  } else {
    submit = true;
  }
  if (postrk < 100000 || postrk > 899999) {
    if (postrk != "" && postrk != 0) {
      this.writeError(errorPar, "Číslo postrkové lok. je zadáno chybně.");
      error = true;
    } else {
      postrk = 0;
    }
  } else {
    submit = true;
  }
  if (priprez < 100000 || priprez > 899999) {
    if (priprez != "" && priprez != 0) {
      this.writeError(errorPar, "Číslo přípřežní lok. je zadáno chybně.");
      error = true;
    } else {
      priprez = 0;
    }
  } else {
    submit = true;
  }
  
  if (comment != "") {
    submit = true;
  }
  
  if (!submit) {
    //nebyl vyplnen zadny zaznam.
    this.writeError(errorPar, "Nebyla vyplněna žádná položka.");
    error = true;
  }
  if (!error) {
    var record = new RecordMap();
    record.setDate(dateObj);
    record.trainId = trainObject.id;
    record.vlakova = vlakova;
    record.ridiciVuz = ridici;
    record.priprez = priprez;
    record.postrk = postrk;
    
    record.comment = comment;
    
    var cb = this.submitCallback.bind(this, observation, true);
    Server.sendRecord(record, cb);
  }
}
lst.prototype.findByName = function (form, name) { //hleda prvek formulare dle zadaneho jmena
  for (var i = 0; i < form.length; i++) {
    if (form[i].name == name) {
      return form[i].value.trim();
    }
  }
  return null;
}
lst.prototype.findRadioValue = function (form, name) { //zjisti hodnotu elementu typu radio.
  var elems = document.getElementsByName(name);
  for (i=0; i < elems.length; i++) {
    if (elems[i].checked==true) {
      return elems[i].value;
    }
  }
  return null;
}
lst.prototype.writeError = function(dst, text) { //vypise chybovou hlasku do zadaneho elementu
  dst.appendChild(document.createTextNode(text));
  dst.appendChild(document.createElement("br"));
}
lst.prototype.submitCallback = function(observation, isSummary) { //callback pro odeslani formulare.
  var summaryString = isSummary ? "summary" : "all";
  var url = observation.id + "!" + "actual" + "!" + summaryString + ".html";
  
  window.history.pushState({url: url}, null, url);
  this.pageNavigator(url);
}

lst.prototype.linkListener = function(event) { //defaultni listener pro vsechny odkazy.
  event.preventDefault();
  var link = event.target;
  
  window.history.pushState({url: link.href}, null, link.href);
  this.pageNavigator(link.href);
}


//podle url zobrazi prislusnou stranku
lst.prototype.pageNavigator = function(url) {
  var split = url.split("/");
  split = split[split.length-1];
  split = split.split(".");
  split = split[0];
  //ted jsme se zbavili adresy a pripony, mame jen vysledny popis zobrazeni stranky.
  
  split = split.split("!"); //rozsekame
  
  var idObs = split[0];
  
  var displayedPage = "actual";
  if (split.length > 1) {
    var displayedPage = split[1];
  }
  
  var isSummary = false;
  if (split.length > 2) {
    isSummary = split[2] == "summary";
  }
  
  if (idObs != "" && idObs != "index" && idObs != "insert") {
    //tak jo, asi mam neco vybraneho.
    this.displayObservation(idObs, displayedPage, isSummary)
  } else if (idObs == "insert") {
    this.displayInsert(split)
  } else {
    this.displaySelect();
  }
}

//zjisti, zda jsou nactena data sledovaky a zkusi ji zobrazit.
lst.prototype.displayObservation = function(idObs, page, isSummary) {
  if (Memory.isReadedObservation(idObs)) {
    //ok, mame data nacteny, tak jen chceme zobrazit...
    this.displayObservationReaded(idObs, page, isSummary);
  } else {
    //nemame, tak si na ne pockame.
    this.UI.loading();
    var cb = this.displayObservationReaded.bind(this, idObs, page, isSummary);
    Server.findObservationData(idObs, cb);
  }
  return true;
}

//vi, ze probehl pokud o nacteni dat sledovaky. Kdyz je nenajde, zobrazi index.
lst.prototype.displayObservationReaded = function (idObs, page, isSummary) {
  var monthYear = page.split("_");
  var displayMonth = false;
  var month = -1;
  var year = -1;
  
  if (monthYear.length > 1) {
    month = parseInt(monthYear[0]);
    year = parseInt(monthYear[1]);
    if (isNaN (month) || isNaN (year)) {
      //aha, chyba, tj. displayMonth = false ==> tj. to uz mame
    } else if (month < 1 || month > 12) {
      //ok, stale
    } else {
      //ano, ano!
      displayMonth = true;
    }
  }
  
  if (Memory.isReadedObservation(idObs)) {
    var obs = Memory.getObservationById(idObs);
    if (displayMonth) {
      if (year < obs.startDate.year) {
        displayMonth = false;
      } else if (year == obs.startDate.year && month < obs.startDate.month) {
        displayMonth = false;
      }
      if (year == obs.endDate.year && month > obs.endDate.month) {
        displayMonth = false;
      } else if (year > obs.endDate.year) {
        displayMonth = false;
      }
    }
    
    if (displayMonth) {
      this.displayMonth(obs, month, year, isSummary);
    } else if (page == "trips") {
      this.displayTrips(obs, isSummary);
    } else {
      this.displayActual(obs, isSummary);
    }
  } else {
    this.displaySelect();
  }
}

//vypise zaznamy ze zadaneho mesice
lst.prototype.displayMonth = function(observation, month, year, isSummary) {
  if (Memory.isInMemory(observation, month+"_"+year)) {
    this.UI.writeMonth(observation, month, year, isSummary);
  } else {
    this.UI.loading();
    var cb = this.UI.writeMonth.bind(this.UI, observation, month, year, isSummary);
    Server.findMonthRecords(observation, month, year, cb);
  }
}

//vypise aktualni zaznamy
lst.prototype.displayActual = function(observation, isSummary) {
  if (Memory.isInMemory(observation, "actual")) {
    this.UI.writeActual(observation, isSummary);
  } else {
    this.UI.loading();
    var cb = this.UI.writeActual.bind(this.UI, observation, isSummary);
    Server.findActualRecords(observation, cb);
  }
}

//vypise formular pro vlozeni dat. parametr jsou parsovana data stranky. Podle toho kam uzivatel klikl, vypise spravny formular a pripadne v nem vybere vlak.
//pokud nejsou nactena data, nacita je.
lst.prototype.displayInsert = function(data) {
  if (data[1] == "observation") {
    if (Memory.isReadedObservation(data[2])) {
      this.displayInsertDo(data);
    } else {
      this.UI.loading();
      var cb = this.displayInsertDo.bind(this, data);
      Server.findObservationData(data[2], cb);
    }
  } else if (data[1] == "day") {
    if (Memory.isReadedDay(data[2])) {
      this.displayInsertDo(data);
    } else {
      this.UI.loading();
      var cb = this.displayInsertDo.bind(this, data);
      Server.findObservationDataByDay(data[2], cb);
    }
  } else if (data[1] == "train") {
    if (Memory.isReadedTrain(data[2])) {
      this.displayInsertDo(data);
    } else {
      this.UI.loading();
      var cb = this.displayInsertDo.bind(this, data);
      Server.findObservationDataByTrain(data[2], cb);
    }
  }
}

//vi, ze probehl pokus o nacteni dat, takze bud vypise formular, nebo titulni stranku.
lst.prototype.displayInsertDo = function(data) {
  if (data[1] == "observation") {
    if (Memory.isReadedObservation(data[2])) {
      this.UI.writeInsertFormObservation(Memory.getObservationById(data[2]));
    } else {
      this.displaySelect();
    }
  } else if (data[1] == "day") {
    if (Memory.isReadedDay(data[2])) {
      this.UI.writeInsertFormDay(Memory.getDayById(data[2]), data[3]);
    } else {
      this.displaySelect();
    }
  } else if (data[1] == "train") {
    if (Memory.isReadedTrain(data[2])) {
      this.UI.writeInsertFormTrain(Memory.getTrainById(data[2]), data[3]);
    } else {
      this.displaySelect();
    }
  }
}

//nevyuzito.
lst.prototype.displayTrips = function(observation, isSummary) {
  console.log("Listener.displayTrips");
  this.displayActual(observation, isSummary);
}

//vypise titulni stranku. Musi ale mit nactena vsechna sledovani.
lst.prototype.displaySelect = function() {
  if (Memory.allObservations == null) {
    this.UI.loading();
    var cb = this.UI.writeTitlePage.bind(this.UI);
    Server.findAllObservations(cb);
  } else {
    this.UI.writeTitlePage();
  }
}

// listener pro prehrani zvuku zavor, prehraje se pouze po prvnim prichodu na titulni stranku.
lst.prototype.playAudio = function() {
  a = document.querySelector("audio");
  if (a == null)
    setTimeout(this.playAudio.bind(this), 250);
  else 
    a.play(); 
}

lst.prototype.clearMemory = function(event) {
  event.preventDefault();
  
  Memory.removeAll();
  Storage.removeAll();
  
  this.pageNavigator(window.location.href);
}