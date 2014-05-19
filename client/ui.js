// JavaScript Document
var ui = function() {
  this.monthNavigator = document.querySelector("nav").querySelector("div");
  this.navigator = document.querySelector("nav").querySelector("div+div");
  this.content = document.querySelector("article");
}

//vypise navigaci.
ui.prototype.writeNavigators = function (observation, isSummary, linkText) {
  if (observation === undefined) {
    //neni pozorovani. Mazu.
    this.monthNavigator.innerHTML = "";
    this.navigator.innerHTML = "";
    return;
  }
  if (linkText === undefined) {
    linkText = "actual";
  }
  
  var summaryString = isSummary ? "summary" : "all";
  var summaryOpposite = isSummary ? "all" : "summary";
  
  if (this.navigator.innerHTML == "") {
    var summaryLinkText = isSummary ? "úplný výpis" : "shrnutí";
    
    var titles = ["aktuální nasazení", /*"přehled výkonů",*/ "vložit záznam", summaryLinkText, "jiná sledování", "správce tabulky: " + observation.contactEmail];
    var hrefs = [observation.id+"!actual!"+summaryString, /*observation.id+"!trips!"+summaryString,*/ "insert!observation!"+observation.id, observation.id+"!"+linkText+"!"+summaryOpposite, "index", null];
    
    var ul = document.createElement("ul");
    for (var i = 0; i < titles.length; i++) {
      var li = document.createElement("li");
      if (hrefs[i] != null) {
        var link = document.createElement("a");
        link.href = hrefs[i] + ".html";
        
        link.addEventListener("click", Listener.linkListener.bind(Listener), true);
        link.innerHTML = titles[i];
        li.appendChild(link);
      } else {
        var span = document.createElement("span");
        span.innerHTML = titles[i];
        li.appendChild(span);
      }
      ul.appendChild(li);
    }
    this.navigator.appendChild(ul);
  }
  
  if (this.monthNavigator.innerHTML == "") {
    var ul = document.createElement("ul");
    for (var m = observation.startDate.month, y = observation.startDate.year; y < observation.endDate.year || m <= observation.endDate.month; m++) {
      if (m > 12) {
        m = m % 12;
        y++;
      }
      var link = document.createElement("a");
      link.href = observation.id + "!" + m + "_" + y + "!" + summaryString + ".html";
      link.setAttribute("data-id", observation.id);
      link.setAttribute("data-type", summaryString);
      
      link.innerHTML = Date.getMonthString(m-1) + " " + y;
      link.addEventListener("click", Listener.linkListener.bind(Listener), true);
      
      var li = document.createElement("li");
      li.appendChild(link);
      ul.appendChild(li);
    }
    this.monthNavigator.appendChild(ul);
    //vypisuji
    
  } else {
    //jen kontroluji href odkazu
    var a = this.monthNavigator.querySelector("a");
    
    if (a.getAttribute("data-id") != observation.id || a.getAttribute("data-type") != summaryString) {
      this.monthNavigator.innerHTML = "";
      this.navigator.innerHTML = "";
      this.writeNavigators(observation, isSummary);
    } else {
      a = this.navigator.querySelectorAll("a")[2];
      a.href = observation.id + "!" + linkText + "!" + summaryOpposite + ".html";
    }
  }
}

//vypise tabulku aktualnich zaznamu
ui.prototype.writeActual = function(observation, isSummary) {
  this.writeNavigators(observation, isSummary);
  this.content.innerHTML = "";
  
  var record = Memory.getRecords(observation, "actual");
  this.writeTitle("Aktuální postřehy");

  var today = new Date();
  var observationStart = observation.getStartDate();
  var observationEnd = observation.getEndDate();
  
  var startDate = new Date();
  startDate.setDate(today.getDate() - (observation.actualDay) + 1);
  
  var endDate = new Date();
  endDate.setDate(today.getDate() + (observation.futureDay));
  
  if (startDate < observationStart) {
    startDate = observationStart; //nevypisujeme pred zacatkem sledovani.
    endDate.setDate(startDate.getDate() + observation.actualDay + observation.futureDay-1);
  }
  
  if (endDate > observationEnd) {
    endDate = observationEnd; //nevypisujeme po konci sledovani
    endDate.setDate(endDate.getDate() + 1);
  }
  
  if (endDate > startDate) {
    this.writeTable(observation, startDate, endDate, record, isSummary);
  } else {
    //pokud uz neni co vypisovat, tak vypiseme cely mesic.
    if (startDate == observationStart) {
      Listener.displayMonth(observation, startDate.getMonth()+1, startDate.getFullYear(), isSummary);
    } else {
      Listener.displayMonth(observation, endDate.getMonth()+1, endDate.getFullYear(), isSummary);
    }
  }
}

//vypiseme cely mesic
ui.prototype.writeMonth = function (observation, month, year, isSummary) {
  this.writeNavigators(observation, isSummary, month+"_"+year);
  this.content.innerHTML = "";
  
  var record = Memory.getRecords(observation, month+"_"+year);
  this.writeTitle(Date.getMonthString(month-1) + " " + year);
  
  var today = new Date();
  var link = false;
  var startI = 1;
  var endI = Date.daysInMonth(month,year);
  
  if (year == observation.startDate.year && month == observation.startDate.month) {
    startI = observation.startDate.day; //bacha na konec a zacatek sledovani
  }
  if (year == observation.endDate.year && month == observation.endDate.month) {
    endI = observation.endDate.day;
  }
  
  this.writeTable(observation, new Date(year, month-1, startI, 12,0,0,0), new Date(year, month-1, endI+1), record, isSummary);
}

//vypise celou tabulku od-do
ui.prototype.writeTable = function (observation, dateStart, dateEnd, records, isSummary) {
  if (observation.getTrainCount() == 0) {
    var p = document.createElement("p");
    p.innerHTML = "Ve zvolené sledovačce není žádný vlak.";
    this.content.appendChild(p);
    return;
  }
  
  var table = document.createElement("table");
  if (isSummary) {
    this.writeTableHeadSummary(table, observation, true);
  } else {
    this.writeTableHead(table, observation, true);
  }
  
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
  var notes = new Array(); //pole, kam budou ukladany poznamky z tabulky.
  
  //vypisuje radky tabulky.
  for (; dateStart <= dateEnd; dateStart.setDate(dateStart.getDate()+1)) {
    var date = dateStart; 
    var link = date > firstInsertDate && date < lastInsertDate; 
   
    if (isSummary) {
      this.writeTableRowSummary(table, observation, date, records, notes, link);
    } else {
      this.writeTableRow(table, observation, date, records, notes, link);
    }
  }
  
  if (observation.headBottom) {
    if (isSummary) {
      this.writeTableHeadSummary(table, observation, false);
    } else {
      this.writeTableHead(table, observation, false);
    }
  }
  
  var div = document.createElement("div");
  div.appendChild(table);
  this.content.appendChild(div);
  this.writeNotes(notes); //vypsani poznamek.
} 

//vypise radek tabulky uplneho vypisu.
ui.prototype.writeTableRow = function (table, observation, date, records, notes, link) {
  var tr = document.createElement("tr");
  table.appendChild(tr);
  if (date.isToday()) {
    tr.className = "today";
  }
  
  var dateTD = document.createElement("td");
  dateTD.className = "date";
  dateTD.innerHTML = date.toDMString();
  dateTD.title = date.toDMYString();
  
  tr.appendChild(dateTD);
  var dark = false;
  
  for (var i = 0; i < observation.groups.length; i++) { 
    for (var j = 0; j < observation.groups[i].days.length; j++) {
      for (var k = 0; k < observation.groups[i].days[j].trains.length; k++) {
        var cell = document.createElement("td"); //kazdy vlak ma svou bunku.

        this.writeTrainRecord(cell, observation.groups[i].days[j].trains[k].id, date, records, notes);
        
        tr.appendChild (cell); 
        if (link) { //pokud je odkaz, tak ulozi parametry odkazu do data-X atributu.
          cell.className = "link";
          cell.setAttribute("data-id", observation.groups[i].days[j].trains[k].id);
          cell.setAttribute("data-type", "train");
          cell.setAttribute("data-date", Math.round(date.getTime() / 1000));
          cell.addEventListener("click", Listener.tableClickListener.bind(Listener), true);
        }
        if (dark) {
          cell.className = cell.className + " dark"; //jsou tam shluky bunek, co jsou vedle sebe a maji stejnou barvu, jsou to ruzne nedefinovane pocty bunek.
        }
      }
      dark = !dark;
      
      if (observation.dateMiddle) { //pokud se vypisuje datum uprostred radku za kazdym TD
        var dateTD2 = document.createElement("td");
        dateTD2.title = date.toDMYString();
        dateTD2.innerHTML = date.toDMString();
        dateTD2.className = "date";
        tr.appendChild(dateTD2);
      }
      
    }
    if (!observation.dateMiddle) { //pokud se datum nevypisuje uprostred radku, tak ho vypisujeme jen mezi TS.
      var dateTD2 = document.createElement("td");
      dateTD2.innerHTML = date.toDMString();
      dateTD2.className = "date";
      dateTD2.title = date.toDMYString();
      tr.appendChild(dateTD2);
    }
  }  
}
//vypise jeden zaznam vlaku.
ui.prototype.writeTrainRecord = function(dstCell, trainId, date, records, notes) {
  var d = date.getDate();
  var m = date.getMonth()+1;
  var y = date.getFullYear();
  
  var hereRecords = new Array();
  var index = 0;

  if (records != null)  
  for (var i = 0; i < records.length; i++) {
    var rec = records[i];
    
    if (d != rec.day) continue;
    if (m != rec.month) continue;
    if (y != rec.year) continue;
    if (trainId != rec.trainId) continue; //vyhazeni zaznamu pro jiny den a jine vlaky.
    hereRecords[index++] = rec;
  }
  if (index == 0) {
    return;
  }
  
  var maxDate = 0;
  var maxIndex = -1;
  for (var i = 0; i < index; i++) {
    if (hereRecords[i].insertDate > maxDate) {
      maxIndex = i;
      maxDate = hereRecords[i].insertDate; //hledame nejnovejsi zaznam
    }
  }
  this.writeRecord(dstCell, hereRecords[maxIndex]);
  
  var note = hereRecords[maxIndex].comment; //poznamka
  if (note != "") {
    var linkNbr = this.storeNote(note, notes);
    var link = document.createElement("span");
    link.innerHTML = "["+linkNbr+"]";
    link.title = note;
    dstCell.appendChild(link);
  }
}
ui.prototype.writeRecord = function(dstCell, record, separator) { //vypise cisla stroju na vlaku.  
  this.writeNumber(dstCell, record.priprez, "př");
  this.writeNumber(dstCell, record.vlakova);
  this.writeNumber(dstCell, record.ridiciVuz);
  this.writeNumber(dstCell, record.postrk, "pk");
}
ui.prototype.writeNumber = function(dst, number, comment) { //vypise jedno cislo. V DB je cislo ve formatu XXXYYY, vypisuje se ve formatu XXX.YYY
  if (number > 0) {
    number += "";
    var nbr = /^(\d{3})(\d{3})$/;
    number = number.replace(nbr,"$1.$2");
    
    this.appendText(dst, number);
    if (comment != null && comment != "") {
      this.appendText(dst, comment);
    }
    this.appendLine(dst);
  }
}

//vypise jeden radek tabulky shrnuti.
ui.prototype.writeTableRowSummary = function (table, observation, date, records, notes, link) {
  var tr = document.createElement("tr");
  table.appendChild(tr);
  if (date.isToday()) {
    tr.className = "today";
  }
  
  var dateTD = document.createElement("td");
  dateTD.className = "date";
  dateTD.innerHTML = date.toDMString();
  dateTD.title = date.toDMYString();
  
  tr.appendChild(dateTD);
  var dark = false;
  
  for (var i = 0; i < observation.groups.length; i++) { 
    for (var j = 0; j < observation.groups[i].days.length; j++) {
      var cell = document.createElement("td"); //jedna bunka je jeden turnusovy den.
      this.writeTrainRecordSummary(cell, observation.groups[i].days[j], date, records, notes); //vypise tam vlaky.
      
      tr.appendChild (cell); 
      if (link) { //pokud je odkaz, tak ulozi parametry odkazu do data-X atributu.
        cell.className = "link";
        cell.setAttribute("data-id", observation.groups[i].days[j].id);
        cell.setAttribute("data-type", "day");
        cell.setAttribute("data-date", Math.round(date.getTime() / 1000));
        cell.addEventListener("click", Listener.tableClickListener.bind(Listener), true);
      }
      if (dark) {
        cell.className = cell.className + " dark"; 
      }
      dark = !dark;
    }
      
    if (observation.dateMiddle || i == observation.groups.length-1) { //pokud vypisujeme datum uprostred, tak se vypise za kazdou turnusovou skupinu. jinak jen za posledni (na konec tabulky)
      var dateTD2 = document.createElement("td");
      dateTD2.title = date.toDMYString();
      dateTD2.innerHTML = date.toDMString();
      dateTD2.className = "date";
      tr.appendChild(dateTD2);
    }
      
  }
}
//vypise seznam vlaku dle turnusoveho dne. 
ui.prototype.writeTrainRecordSummary = function(dstCell, day, date, records, notes) {
  var d = date.getDate();
  var m = date.getMonth()+1;
  var y = date.getFullYear();
  
  var hereRecords = new Array();
  var index = 0;

  if (records != null)  
  for (var i = 0; i < records.length; i++) {
    var rec = records[i];
    
    if (d != rec.day) continue;
    if (m != rec.month) continue;
    if (y != rec.year) continue; //vlaky z jinych dni
    if (!day.isFromDay(rec.trainId)) {
      continue; //vlaky z jinych turnusovych dni.
    } 
    hereRecords[index++] = rec;
  }
  
  if (index == 0) {
    return; //nic nemame :(
  }
  
  var filtred = new Array(); //od kazdeho vlaku si nechame jen nejnovejsi zaznam.
  for (var i = 0; i < index; i++) {
    var rec = hereRecords[i];
    if (filtred[rec.trainId] === undefined) {
      filtred[rec.trainId] = rec;
    } else {
      if (rec.insertDate > filtred[rec.trainId].insertDate) {
        filtred[rec.trainId] = rec;
      } 
    }
  }
  
  var sorted = new Array();
  var trains = day.trains;
  var s_index = 0;
  
  for (var j = 0; j < trains.length; j++) { //radi vlaky dle seznamu vlaku (predpokladame, ze ten je serazeny.) 
    for (var i in filtred) {
      if (i == trains[j].id) {
        sorted[s_index++] = filtred[i];
        
        if (filtred[i].ridiciVuz > 0 && filtred[i].vlakova == 0 && filtred[i].postrk > 0) {
          //pokud je zaznam ve formatu "ridici vuz + postrk", tak ho prevedeme na "vlakova lok. + ridici vuz".
          filtred[i].vlakova = filtred[i].postrk;
          filtred[i].postrk = 0;
        } 
      }
    }
  }
  
  this.writeRecordSummary(dstCell, sorted[0]); //vypise prvni zaznam
  this.appendLine(dstCell);
  for (var k = 1; k < s_index; k++) { //vypise zbyvajici zaznamy, ale nevypisuje ty zaznamy, ktere jsou shodne s predchozimi.
    if (sorted[k].equals(sorted[k-1])) {
      continue;
    }
    this.writeRecordSummary(dstCell, sorted[k]);
    this.appendLine(dstCell);
  }
  
  var text = this.createNoteSummary(sorted);
  if (text != "") {
    //pokud mame text, tak zobrazime odkaz.
    var linkNbr = this.storeNote(text, notes);
    var link = document.createElement("span");
    link.innerHTML = "["+linkNbr+"]";
    link.title = text;
    dstCell.appendChild(link);
  }
}
ui.prototype.createNoteSummary = function(sortedRecord) { //vytvori text poznamky.
  var span = document.createElement("span");
  var noteCreator = new Array(); //pole pro seskupene zaznamy
  
  for (var k = 0; k < sortedRecord.length; k++) {
    var found = false;
    for (var i = 0; i < noteCreator.length; i++) {
      if (sortedRecord[k].equalsAll(noteCreator[i].record)) {
        noteCreator[i].trains[noteCreator[i].trains.length] = sortedRecord[k].train.number;
        found = true;
        //zjisti, ze zaznam je stejny, jako nejaky jiny, takze jen "privesi" k nemu cislo vlaku.
        break;
      }
    }
    if (!found) {
      //zaznam tam jeste nebyl, takze ho pridame.
      note = {record: sortedRecord[k], trains: new Array()};
      note.trains[0] = sortedRecord[k].train.number;
      noteCreator[noteCreator.length] = note;
    }
  }
  
  if (noteCreator.length > 1 || (noteCreator.length == 1 && noteCreator[0].record.comment != "")) {
    //kdyz tam jsou dve ruzne soupravy (dva ruzne zaznamy) a nebo jeden zaznam, ktery ma nejakou pozamku.
    //tak se tvori text
    for (var i = 0; i < noteCreator.length; i++) {
      if (noteCreator.length > 1) {
        this.writeTrainNumbers(span, noteCreator[i].trains);
        this.appendText(span, ": ");
      }
      this.writeRecordSummary(span, noteCreator[i].record);
      if (noteCreator[i].record.comment != "") {
        this.appendText(span, ", pozn.: "+noteCreator[i].record.comment);
      }
      this.appendText(span, "\n");
    }
  }
  
  var text = span.innerHTML; //ten span tam je, aby se vyuzily uz existjici funkce.
  return text;
}

ui.prototype.writeTrainNumbers = function(dstCell, trains) {
  //vypise cisla vlaku pro poznamky.
  if (trains.length == 1) {
    this.appendText(dstCell, "vlak "+trains[0]);
    return;
  }
  var text = trains[0];
  
  for (var i = 1; i < trains.length - 1; i++) {
    text = text + ", " + trains[i];
  }
  text = text + " a " + trains[trains.length - 1];
  
  this.appendText(dstCell, "vlaky " + text);
}

//vypise soupravu (zaznamy) vlaku pro shrnuri.
ui.prototype.writeRecordSummary = function(dstCell, record) {  
  var text = "";
  
  text = this.writeNumberSummary(text, record.priprez, "př");
  text = this.writeNumberSummary(text, record.vlakova);
  text = this.writeNumberSummary(text, record.ridiciVuz);
  text = this.writeNumberSummary(text, record.postrk, "pk");
  
  this.appendText(dstCell, text.substr(3));
}
ui.prototype.writeNumberSummary = function(dst, number, comment) { //cislo vozidla pro shrnuti, jsou spojena pomoci "+"
  if (number > 0) {
    dst = dst + " + ";
    number += "";
    var nbr = /^(\d{3})(\d{3})$/;
    number = number.replace(nbr,"$1.$2");
    
    dst = dst + number;
    
    if (!(comment === undefined)) {
      dst += comment;
    }
  }
  return dst;
}

ui.prototype.storeNote = function(text, notes) { //ulozi poznamku a vrati jeji klic. pokud uz tam poznamka je, tak vrati exisutjici klic.
  var size = notes.length
  for (var i = 0; i < size; i++) {
    if (notes[i] == text) return i+1;
  }
  notes[size] = text;
  return size+1;
}
ui.prototype.writeNotes = function(notes) { //vypise poznamky.
  var size = notes.length;
  if (size == 0) return;
  
  var aside = document.createElement("aside");
  for (var i = 0; i < size; i++) {
    var p = document.createElement("p");
    var nbr = "["+(i+1)+"]";
    var text = notes[i];
    
    var span = document.createElement("span");
    var span2 = document.createElement("span");
    
    this.appendText(span, nbr);
    p.appendChild(span);
    p.appendChild(span2);
    var spText = text.split("\n");
    for (var j = 0; j < spText.length; j++) {
      if (spText[j] == "") continue;
      this.appendText(span2, spText[j]);
      this.appendLine(span2);
    }
    
    aside.appendChild(p);
  }
  this.content.appendChild(aside);
}

ui.prototype.writeTableHead = function (table, observation, normalDirection) {
  //vypise hlavicku tabulky "uplny vypis"
  var thead = document.createElement("thead");
  var tr1 = document.createElement("tr");
  var tr2 = document.createElement("tr");
  var tr3 = document.createElement("tr");
  table.appendChild(thead);
  if (normalDirection) {
    thead.appendChild(tr1);
    thead.appendChild(tr2);
    thead.appendChild(tr3);
  } else {
    thead.appendChild(tr3);
    thead.appendChild(tr2);
    thead.appendChild(tr1);
  }
  
  var dateColumn = document.createElement("th");
  dateColumn.innerHTML = "datum";
  dateColumn.rowSpan = 3;
  if (normalDirection) {
    tr1.appendChild (dateColumn);
  } else {
    tr3.appendChild (dateColumn);
  }
    
  for (var i = 0; i < observation.groups.length; i++) {
    var th1 = document.createElement("th");
    th1.innerHTML = observation.groups[i].name;
    th1.colSpan = observation.groups[i].trainCount(); //turnusova skupina je pres vsechny cisla vlaku.
    
    if (observation.dateMiddle) {
      th1.colSpan += observation.groups[i].days.length - 1 ;
    }
    
    tr1.appendChild (th1);
    
    for (var j = 0; j < observation.groups[i].days.length; j++) {
      var th2 = document.createElement("th");
      th2.innerHTML = observation.groups[i].days[j].name;
      th2.colSpan   = observation.groups[i].days[j].trains.length;
      
      tr2.appendChild (th2);
      for (var k = 0; k < observation.groups[i].days[j].trains.length; k++) {
        var train = observation.groups[i].days[j].trains[k];
        var th3 = document.createElement("th");
        th3.innerHTML = train.type + " " + train.number;
        th3.title = train.track + "\n" + train.limits;
        
        tr3.appendChild (th3);  
      }
      
      if (observation.dateMiddle && j < observation.groups[i].days.length-1) {
        var th1 = document.createElement("th");
        th1.innerHTML = "datum";
        th1.rowSpan = 2;
        
        if (normalDirection) {
          tr2.appendChild (th1);
        } else {
          tr3.appendChild (th1);
        }
      }
    }
  
    var th1 = document.createElement("th");
    th1.innerHTML = "datum";
    th1.rowSpan = 3;
    
    if (normalDirection) {
      tr1.appendChild (th1);
    } else {
      tr3.appendChild (th1);
    }  
  }
}
ui.prototype.writeTableHeadSummary = function (table, observation, normalDirection) {
//vypise hlavicku tabulky "skrnuti"
  var thead = document.createElement("thead");
  var tr1 = document.createElement("tr");
  var tr2 = document.createElement("tr");
  var tr3 = document.createElement("tr");
  table.appendChild(thead);
  if (normalDirection) {
    thead.appendChild(tr1);
    thead.appendChild(tr2);
    thead.appendChild(tr3);
  } else {
    thead.appendChild(tr3);
    thead.appendChild(tr2);
    thead.appendChild(tr1);
  }
  
  var dateColumn = document.createElement("th");
  dateColumn.innerHTML = "datum";
  dateColumn.rowSpan = 3;
  if (normalDirection) {
    tr1.appendChild (dateColumn);
  } else {
    tr3.appendChild (dateColumn);
  }
    
  for (var i = 0; i < observation.groups.length; i++) {
    var th1 = document.createElement("th");
    th1.innerHTML = observation.groups[i].name;
    th1.colSpan = observation.groups[i].days.length;
    
    tr1.appendChild (th1);
    
    for (var j = 0; j < observation.groups[i].days.length; j++) {
      var th2 = document.createElement("th");
      th2.innerHTML = observation.groups[i].days[j].name;
      tr2.appendChild (th2);
      
      var th3 = document.createElement("th");
      
      for (var k = 0; k < observation.groups[i].days[j].trains.length; k++) {
        var train = observation.groups[i].days[j].trains[k];
        var span = document.createElement("span");
        if (observation.summaryWriteType) {
          span.innerHTML = train.type + " " + train.number;
        } else {
          span.innerHTML = train.number;
        }
        
        span.title = train.type + " " + train.number + "\n" + train.track + "\n" + train.limits;
        th3.appendChild (span);
        if (k < observation.groups[i].days[j].trains.length-1) {
          this.appendText(th3, "/");  
        }
        
        if (k % observation.summaryLineLength == observation.summaryLineLength-1) {
          this.appendLine(th3);
        }
      }
      tr3.appendChild(th3);
    }
    if (observation.dateMiddle || i == observation.groups.length - 1) {
      var th1 = document.createElement("th");
      th1.innerHTML = "datum";
      th1.rowSpan = 3;
      
      if (normalDirection) {
        tr1.appendChild (th1);
      } else {
        tr3.appendChild (th1);
      }  
    }
  }
}

ui.prototype.writeInsertFormObservation = function(observation) {
//pokud se vklada klikem na odkaz z menu.
  this.writeNavigators(observation, true);
  this.content.innerHTML = "";
  
  this.writeTitle("Vložit záznam");
  
  var train = this.createIntegerInput("Číslo vlaku:", "train", "", true);
  this.writeInsertForm(observation, train, Math.round(Date.now()/1000));
}


ui.prototype.writeInsertFormDay = function(day, timestamp) {
//pokud se vklada klikem taublku shrnuti - do turnusoveho dne.
  this.writeNavigators(day.group.observation, true);
  this.content.innerHTML = "";
  this.writeTitle("Vložit záznam");
  
  var train = this.createSelect("Číslo vlaku:", "train", day.trains, null);
  this.writeInsertForm(day.group.observation, train, timestamp);
}
ui.prototype.writeInsertFormTrain = function(train, timestamp) {
//pokud se vklada klikem taublku shrnuti - do turnusoveho dne s vybranym vlakem
  this.writeNavigators(train.day.group.observation, true);
  this.content.innerHTML = "";
  
  this.writeTitle("Vložit záznam");
  var trainElement = this.createSelect("Číslo vlaku:", "train", train.day.trains, train.id);
  this.writeInsertForm(train.day.group.observation, trainElement, timestamp);
}

ui.prototype.writeTrains = function (trains) {  //vypise cisla vlaku a jejich trasy, pokud z cisla vlaku nejde urcit konkretni vlak (cislo se muze opakovat)
  var dst = document.querySelector("form").querySelector("p+p");
  
  dst.innerHTML = "Ze zadaného čísla vlaku nelze jednoznačně určit konkrétní vlak.";
  dst.appendChild(document.createElement("br"));
  
  for (var i = 0; i < trains.length; i++) {
    var label = document.createElement("label");
    var input = document.createElement("input");
    input.type = "radio";
    input.name = "trainId";
    input.value = trains[i].id;
    
    label.appendChild(input);
    
    label.appendChild(document.createTextNode(trains[i].type + " " + trains[i].number + ": " + trains[i].track));
    label.appendChild(document.createElement("br"));
    label.appendChild(document.createTextNode(trains[i].limits));
    
    dst.appendChild(label);
  }
}
ui.prototype.writeInsertForm = function(observation, trainSelectElement, timestamp) {
//vypise cely formular pro vlozeni zaznamu. timestamp je den (datum), do ktereho se vklada zaznm.
//trainSelectElement je element i s popiskem pro vyber vlaku.  
  var form = document.createElement("form");
  form.method = "POST";
  form.action = "";
  form.addEventListener("submit", Listener.formSubmitListener.bind(Listener), true);
  form.addEventListener("reset", function(e) {
    window.history.back();
  }, true);
  
  var lastDate = new Date();
  lastDate.setDate(lastDate.getDate() - observation.dayBackInsert + 1);
  
  var date = this.createDateInput("Datum:", "date", new Date(timestamp*1000), lastDate, new Date(), true);
  
  var vlakova = this.createIntegerInput("Vlaková lok.:", "vlakova", "");
  var ridici = this.createIntegerInput("Řídicí vůz:", "ridici", "");
  var priprez = this.createIntegerInput("Přípřež:", "priprez", "");
  var postrk = this.createIntegerInput("Postrk:", "postrk", "");
    
  var comment = this.createTextInput("Poznámka:", "comment", "", false, "Upřesnění záznamu");
  
  var observationId = this.createHiddenInput("observationId", observation.id);
  
  var errorPar = document.createElement("p");
  form.appendChild(errorPar);
  
  var moreTrainPar = document.createElement("p");
  form.appendChild(moreTrainPar);
  
  var par = document.createElement("p");
  form.appendChild(par);
  
  par.appendChild(date);
  par.appendChild(trainSelectElement);
  this.appendLine(par);
  
  par.appendChild(vlakova);
  par.appendChild(ridici);
  par.appendChild(postrk);
  par.appendChild(priprez);
  par.appendChild(comment);
  par.appendChild(observationId);
  
  var par2 = document.createElement("p");
  
  var submit = document.createElement("input");
  submit.type = "submit";
  submit.value = "Odeslat";
  par2.appendChild(submit);
  
  var reset = document.createElement("input");
  reset.type = "reset";
  reset.value = "Zpět";
  par2.appendChild(reset);
  
  var par3 = document.createElement("p");
  form.appendChild(par3);
  this.appendText(par3, "Číslo vozidla zadejte dohromady, tj. bez teček, pomlček, mezer a bez kontrolní číslice. Např: 162011 pro lok. 162.011-1.");
  this.appendLine(par3);
  this.appendText(par3, 'U řídicích vozů použijte staré tříčíselné označení (954, 961, ...). U vlaků, které mají v čele řídicí vůz, můžete zadat do pole "řídicí vůz" číslo ŘV a číslo lokomotivy do pole "postrk". V případě složitější kombinace použijte prosím poznámku.');  
  this.appendLine(par3);
  this.appendText(par3, "Při odeslání formuláře se archivuje čas odeslání a IP adresa PC.");

  form.appendChild(par2);
  
  form.querySelector("input").autofocus = "autofocus";
  form.querySelector("input").focus();
  
  this.content.appendChild(form);
}

//vypise titulni stranku
ui.prototype.writeTitlePage = function () {
  this.content.innerHTML = "";
  this.writeNavigators();
  this.writeTitle("Sledování nasazení vozidel");
  var observations = Memory.allObservations;
  
  var par = document.createElement("p");
  this.content.appendChild(par);
  
  if (observations != null && observations.length > 0) {
    for (var i = 0; i < observations.length; i++) {
      this.writeObservation(par, observations[i]);
    }
  } else {
    par.innerHTML = "Žádná sledovačka nebyla nenalezena. Jste připojeni k internetu?";
  }
  
  var audio = document.createElement("audio");
  audio.controls = "true";
  
  var src1 = document.createElement("source");
  src1.src = "zavory.mp3";
  src1.type = "audio/mpeg";
  var src2 = document.createElement("source");
  src2.src = "zavory.ogg";
  src2.type = "audio/ogg";
  var src3 = document.createElement("source");
  src3.src = "zavory.wav";
  src3.type = "audio/wave";
  
  audio.appendChild(src1);
  audio.appendChild(src2);
  audio.appendChild(src3);
  this.content.appendChild(audio);
}
//vypise jedno pozorovani na titulni stranku
ui.prototype.writeObservation = function(dest, obs) {
  var link = document.createElement("a");
  link.href = obs.id + "!actual!summary.html";
  link.setAttribute("data-id", obs.id);
  link.addEventListener("click", Listener.linkListener.bind(Listener), true);
  link.innerHTML = obs.name;
  
  dest.appendChild(link);
  this.appendLine(dest);
}

ui.prototype.loading = function() {
  this.content.innerHTML = "";
  
  var div = document.createElement("div");
  div.id = "loading";
  
  this.content.appendChild(div);
}

//--------
//obecne funkce
ui.prototype.createSelect = function (labelText, name, allValues, selectedValue) {
  //vytvori select element s hodnotami.
  var select = document.createElement("select");
  select.name = name;
  
  for (var i = 0; i < allValues.length; i++) {
    var opt = document.createElement("option");
    opt.value = allValues[i].id;
    opt.innerHTML = allValues[i].type + " " + allValues[i].number + ": " + allValues[i].track + "";
    
    select.appendChild(opt);
  }
  select.value = selectedValue;

  var label = document.createElement("label");
  label.innerHTML = labelText;
  label.appendChild(select);
  
  return label;
}

ui.prototype.createDateInput = function(labelText, name, value, first, last, required) {
  //vytvori <input type=date>.
  if (value === undefined) value = new Date();
  
  var input = document.createElement("input");
  input.type = "date";
  input.name = name;
  if (required) {
    input.required = "";
  }
  
  input.min = first.toInputValue();
  input.max = last.toInputValue();
  
  input.value = value.toInputValue();
  
  var label = document.createElement("label");
  label.innerHTML = labelText;
  label.appendChild(input);
  
  return label;
}

ui.prototype.createTextInput = function(labelText, name, value, required, placeholder) {
//vytvori <input type=text>
  if (value === undefined) value = "";
  
  var input = document.createElement("input");
  input.type = "text";
  input.name = name;
  input.value = value;
  if (required) {
    input.required = "";
  }
  if (!(placeholder === undefined)) {
    input.placeholder = placeholder;
  }
  
  var label = document.createElement("label");
  label.innerHTML = labelText;
  label.appendChild(input);
  
  return label;
}
ui.prototype.createIntegerInput = function(labelText, name, value, required, placeholder) {
//vytvori <input type=number>.
  if (value === undefined) value = "";

  var input = document.createElement("input");
  input.type = "number";
  input.name = name;
  input.value = value;
  if (required) {
    input.required = "";
  }
  
  var label = document.createElement("label");
  label.innerHTML = labelText;
  label.appendChild(input);
  
  return label;
}
ui.prototype.createHiddenInput = function(name, value) {//vytvori skryty input
  var input = document.createElement("input");
  input.type = "hidden";
  input.name = name;
  input.value = value;
  
  return input;
}

ui.prototype.appendText = function(dst, text) { //pripoji text do elementu
  var textNode = document.createTextNode(text);
  dst.appendChild(textNode);
}
ui.prototype.appendLine = function(dst) { //pripoji linku do elementu
  dst.appendChild(document.createElement("br"));
}
ui.prototype.writeTitle = function(title) { //vypise titulek stranky.
  var h1 = document.createElement("h1");
  h1.innerHTML = title;
  this.content.appendChild(h1);
}
