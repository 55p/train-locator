
var cv = function() {
  this.ctx = document.querySelector("canvas").getContext("2d");
  this.toLeft = false;
  this.x = 40;
  this.T = Date.now();
  this.speed = 0.08;
  
  this.changes = 0;
  
  this.paint();
}

//prekresli lokomotivu
cv.prototype.paint = function() {
  this.ctx.clearRect(this.x-5, 0, 70, 60);
  
  if (this.x < 30) {
    this.toLeft = false;
    this.changes++;
  }
  if (this.x > 700) {
    this.toLeft = true;
  }
  
  var t = Date.now();
  var change = (t - this.T) * this.speed;
  if (this.toLeft) {
    change *= -1;
    change *= (3/4);
  }
  this.x += change;
  this.T = t;
  
  this.paintImage(this.x,0);
  
  if (this.changes < 10) {
    requestAnimationFrame(this.paint.bind(this));
  }
}

//nakresli lokomotivu na souradnice x,y
cv.prototype.paintImage = function(x,y) {
  this.ctx.strokeStyle = "black";
  this.ctx.fillStyle = "black";
  
  this.ctx.beginPath(); //predni sberac
  if (this.toLeft) {
    this.ctx.moveTo(x+45, y+5);
    this.ctx.lineTo(x+50, y+3);
    this.ctx.moveTo(x+50, y+3);
    this.ctx.lineTo(x+45, y+1);
  } else {
    this.ctx.moveTo(x+45, y+5);
    this.ctx.lineTo(x+50, y+4);
    this.ctx.moveTo(x+50, y+4);
    this.ctx.lineTo(x+45, y+3);
  }
  this.ctx.closePath();
  this.ctx.stroke();
  
  this.ctx.beginPath(); //zadni sberac
  if (this.toLeft || this.changes > 9) {
    this.ctx.moveTo(x+15, y+5);
    this.ctx.lineTo(x+10, y+4);
    this.ctx.moveTo(x+10, y+4);
    this.ctx.lineTo(x+15, y+3);
  } else {
    this.ctx.moveTo(x+15, y+5);
    this.ctx.lineTo(x+10, y+3);
    this.ctx.moveTo(x+10, y+3);
    this.ctx.lineTo(x+15, y+1);
  }
  this.ctx.closePath();
  this.ctx.stroke();
  
  this.ctx.beginPath(); //kola
  this.ctx.arc(x+16, y+29, 3, 0, 2*Math.PI, true);
  this.ctx.arc(x+ 9, y+29, 3, 0, 2*Math.PI, true);
  this.ctx.arc(x+44, y+29, 3, 0, 2*Math.PI, true);
  this.ctx.arc(x+51, y+29, 3, 0, 2*Math.PI, true);
  this.ctx.closePath();
  this.ctx.fill();

  this.ctx.fillStyle = "#808080"; //strecha
  this.ctx.fillRect(x+16, y+3, 28, 2);

  this.ctx.fillStyle = "#49AB3F";//zelene "telo"
  this.ctx.fillRect(x+8, y+5, 44, 8);
  this.ctx.fillRect(x, y+13, 60, 3);
  this.ctx.fillRect(x, y+20, 60, 6);
  
  this.ctx.fillStyle = "#F9FC87 "; //zluty pruh
  this.ctx.fillRect(x, y+16, 60, 4);
  
  this.ctx.fillStyle = "#007AAE"; //okna
  this.ctx.beginPath();
  this.ctx.moveTo(x, y+13);
  this.ctx.lineTo(x+8, y+13);
  this.ctx.lineTo(x+8, y+5);
  this.ctx.closePath();
  this.ctx.fill();
  
  this.ctx.beginPath();
  this.ctx.moveTo(x+52, y+5);
  this.ctx.lineTo(x+52, y+13);
  this.ctx.lineTo(x+60, y+13);
  this.ctx.closePath();
  this.ctx.fill();
}
