//MUST get values from slider and update reset function
//also introduce end function
//finally implement message 


var streams = []; //creating streams array
var fadeInterval = 1.6; //reduces opacity over time
var symbolSize = 20; //font size

let fadeSlider;
let symbolSizeSlider;
let maxSymbolSlider;
let minSymbolSlider;
let minSpeedSlider;
let maxSpeedSlider;

function setup() {
  createCanvas(
    window.innerWidth,
    window.innerHeight
  ); //creates background fullscreen
  background(0); //black background

  fadeSlider = createSlider(1, 4, 2, 0);
  fadeSlider.position(20,20);
  symbolSizeSlider = createSlider(5,40,20,0);
  symbolSizeSlider.position(20,50);
  minSymbolSlider = createSlider(10,25,20,1);
  minSymbolSlider.position(20,80);
  maxSymbolSlider = createSlider(1,9,5,1);
  maxSymbolSlider.position(20,110);
  minSpeedSlider = createSlider(2,6,4,0,);
  minSpeedSlider.position(20,140);
  maxSpeedSlider = createSlider(8,20,15,0);
  maxSpeedSlider.position(20,170);
  fill(255);
  text("fade interval", fadeSlider.x * 2 + fadeSlider.width, 35);
  fill(255);
  text("symbol size", symbolSizeSlider.x * 2 + symbolSizeSlider.width, 65);
  fill(255);
  text("min number of symbols", minSymbolSlider.x * 2 + minSymbolSlider.width, 95);
  fill(255);
  text("max number of symbols", maxSymbolSlider.x * 2 + maxSymbolSlider.width, 125);
  fill(255);
  text("min speed", minSpeedSlider.x * 2 + minSpeedSlider.width, 155);
  fill(255);
  text("max speed", maxSpeedSlider.x * 2 + maxSpeedSlider.width, 185);
  button = createButton('reset');
  button.position(20, 195);
  button.mousePressed(reset);

  var x = 0; //first stream all the way over on far left
  for (var i = 0; i <= width / symbolSize; i++) { //width divided by symbolSize is number of Streams that will be created
    var stream = new Stream();//initialises new stream object
    stream.generateSymbols(x, random(0, height));//generates a symbol at the x position and random height
    streams.push(stream);//adds stream to stream array
    x += symbolSize;//moves to the right
  }

  textFont('Consolas');
  textSize(symbolSize);

  //creating sliders
  //slider arguments: min, max, default, discrete
  //if discrete is 0 slider is continuous, 1 by default means discrete
}

function draw() {
  background(0, 150);
  streams.forEach(function(stream) {
    stream.render();
  });
}

function Symbol(x, y, speed, first, opacity) {
  this.x = x;//initialises Symbol attributes
  this.y = y;
  this.value;

  this.speed = speed;
  this.first = first;
  this.opacity = opacity;

  this.switchInterval = round(random(5, 30)); //sets how many frames required for a new symbol value

  this.setToRandomSymbol = function() {
    var charType = round(random(0, 7)); //creates a random int between 0 and 7
    if (frameCount % this.switchInterval == 0) {
      if (charType > 3) {
        // set it to Russian
        this.value = String.fromCharCode(
          0x0410 + round(random(0, 31))//unicode for a random russian character
        );
      } else if (charType > 1) {
        // set it to Chinese
        this.value = String.fromCharCode(
          0x3400 + round(random(0, 1000))//unicode for some chinese characters
        );
      } else {
        // set it to numeric
        this.value = round(random(0,9));
      }
    }
  }

  this.rain = function() {//causes the falling appearance
    this.y = (this.y >= height) ? 0 : this.y += this.speed;
  }
}
function Stream() {
  this.symbols = [];//create symbols array
  this.totalSymbols = round(random(5, 35));//matrix shoud have a random number
  this.speed = random(5, 15);//random speed

  this.generateSymbols = function(x, y) {
    var opacity = 255;
    var first = round(random(0, 4)) == 1;//1 in 5 chance of first symbol in stream being brighter
    for (var i =0; i < this.totalSymbols; i++) {
      symbol = new Symbol(
        x,
        y,
        this.speed,
        first,
        opacity
      ); //initialise new symbols
      symbol.setToRandomSymbol();//set symbol to have a random value
      this.symbols.push(symbol);//add symbol to array
      opacity -= (255 / this.totalSymbols) / fadeInterval; //reduce opacity each time by factor of the fadeInterval
      y -= symbolSize;//symbol is moved up by the symbol size, first should be lowest down
      first = false;//first is automatically false for all other symbols apart from first one
    }
  }

  this.render = function() {
    this.symbols.forEach(function(symbol) {
      if (symbol.first) { //change brightness based on first variable
        fill(140, 255, 170, symbol.opacity);
      } else {
        fill(0, 255, 70, symbol.opacity);
      }
      text(symbol.value, symbol.x, symbol.y);//show symbol as text
      symbol.rain();//lower and create loop effect;
      symbol.setToRandomSymbol();//change to different symbols
    });
  }
}

function reset() {
  streams = [];
}
