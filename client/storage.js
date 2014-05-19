// JavaScript Document
var storage = function() {
  this.isEnabled = window.localStorage || false; //rika, zda je local storage dostupna.
  if (this.isEnabled) {
    this.store = window.localStorage;
  }
  this.prefix = "loc_"; //prefix pro vsechny prvky teto aplikace. Podle nej se pak prvky mazou.
}

//ulozi data dle klice, nastavi jim expiraci
storage.prototype.save = function(key, data, expires) {
  if (this.isEnabled) {
    this.store.setItem(this.prefix + key, data);
    this.store.setItem(this.prefix + key+"_timestamp", expires.getTime());
  }
}

//zjisti, zda jsou ulozena data dle klice a zda uz nevyprsely. Pokud neni znama expirace, tak data nejsou.
storage.prototype.isStored = function(key) {
  var result = false;
  if (this.isEnabled) {
    if (this.store.getItem(this.prefix + key) != null) {
      var tst = this.store.getItem(this.prefix + key+"_timestamp")
      result = tst != null && tst > Date.now();
    }
    if (!result) {
      this.store.removeItem(this.prefix + key);
      this.store.removeItem(this.prefix + key + "_timestamp");
    }
  }
  return result;
}

//vrati ulozena data dle klice, pokud uz nevyprsely. Pokud neni znama expirace, tak data nejsou.
storage.prototype.load = function (key) {
  if (this.isEnabled) {
    var item = this.store.getItem(this.prefix + key); 
    if (item != null) {
      var tst = this.store.getItem(this.prefix + key+"_timestamp")
      if (tst != null && tst > Date.now()) {
        return item;
      } else {
        this.store.removeItem(this.prefix + key);
        this.store.removeItem(this.prefix + key + "_timestamp");
      }
    }
  }
  return null;
}

storage.prototype.storeRecord = function(idObs, record) {
  if (!this.isEnabled) return;
  
  var rec = this.store.getItem(this.prefix + idObs+"_actual");
  if (rec != null) {
    var loaded = JSON.parse(rec);
    loaded[loaded.length] = record;
    var string = JSON.stringify(loaded);
    this.store.setItem(this.prefix + idObs+"_actual", string);
  }
  
  rec = this.store.getItem(this.prefix + idObs + "_" + record.month + "_" + record.year);
  if (rec != null) {
    var loaded = JSON.parse(rec);
    loaded[loaded.length] = record;
    var string = JSON.stringify(loaded);
    this.store.setItem(this.prefix + idObs + "_" + record.month + "_" + record.year, string);
  }
}

storage.prototype.removeAll = function() { //odstrani vsechny prvky ze storage, co zacinaji prefixem.
  if (!this.isEnabled) return;
  
  var length = this.store.length;
  var keyIndex = 0;
  
  for (var i = 0; i < length; i++) {
    var key = this.store.key(keyIndex);
    
    if (key.startsWith(this.prefix)) {
      this.store.removeItem(key);
    } else {
      keyIndex++;
    }
  } 
}

var Storage = new storage();
