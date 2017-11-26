var canvas;
function setup() { 
  canvas = createCanvas(400, 400);
   var title = document.getElementById("title");
  var frame = title.getBoundingClientRect();
  var width = frame.right - frame.left;
  
  canvas.position(width / 2 - 200);
} 

function draw() { 
  background(220);
     var title = document.getElementById("title");
  var frame = title.getBoundingClientRect();
  var width = frame.right - frame.left;
  
  canvas.position(width / 2 - 200);
}