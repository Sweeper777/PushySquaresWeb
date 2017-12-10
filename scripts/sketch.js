///<reference path="p5.global-mode.d.ts"/>
///<reference path="PushySquares.d.ts"/>
///<reference path="bridge.d.ts"/>

const borderSize = 8;

var canvas;
function setup() { 
  canvas = createCanvas(windowWidth, windowHeight);
  console.log(game.toString());
} 

function draw() { 
  background(220);
}