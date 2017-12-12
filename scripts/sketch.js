///<reference path="p5.global-mode.d.ts"/>
///<reference path="PushySquares.d.ts"/>
///<reference path="bridge.d.ts"/>

const borderSize = 8;

function shadeColor(color, percent) {   
  var f=parseInt(color.slice(1),16),t=percent<0?0:255,p=percent<0?percent*-1:percent,R=f>>16,G=f>>8&0x00FF,B=f&0x0000FF;
  return "#"+(0x1000000+(Math.round((t-R)*p)+R)*0x10000+(Math.round((t-G)*p)+G)*0x100+(Math.round((t-B)*p)+B)).toString(16).slice(1);
}


function drawSquareView(w, h, color) {
  var square = createGraphics(w, h);
  var strokeWidth = w / borderSize;
  square.background(color);
  square.strokeWeight(w / borderSize);
  square.stroke(shadeColor(color, 0.2));
  square.line(w-strokeWidth / 2, 0, w-strokeWidth / 2, h-strokeWidth / 2);
  return square;
}

function drawBoard(length) {
  var board = createGraphics(length, length);
  var squareLength = function() {
    return (borderSize * length) / (borderSize * System.Array.getLength(game.Board, 0) + 1);
  };
  var squareViewLength = function() {
    return squareLength() - (squareLength() / borderSize);
  };
  var strokeWidth = function() {
    return squareLength() / borderSize;
  };

  var squareViewPoint = function(position) {
    var pointForPosition = point(position);
    let offset = squareLength / borderSize / 2
    return {x: pointForPosition.x + offset, y: pointForPosition.y + offset};
  };

  var point = function(position) {
    return {x: strokeWidth / 2 + position.x * squareLength(), y: strokeWidth / 2 + position.y * squareLength()};
  };

}

var canvas;
function setup() { 
  canvas = createCanvas(windowWidth, windowHeight);
  console.log(game.toString());
} 

function draw() { 
  background(220);
}