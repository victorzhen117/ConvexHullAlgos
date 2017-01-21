var canvas;
var context;
var stackX = []; //for holding previous x value points.
var stackY = []; //for holding previous y value points.
var currX = 0;
var currY = 0;
var colors = '0123456789ABCEDF';

/*
List of TODOS:
css please.
proper clear button
a timer to compare the speeds of the algorithms.
make background black, with light colored dots.e
add link to site in the readme.md
do not allow for more dots to be drawn after first convex hull
one degenerate edge case where the poinst are on the line. fix for jarvis march.

time permitted:
draw the lines during the algorithm. mad work tho
*/

function init(){
  canvas = document.getElementById("canvas");
  context = canvas.getContext("2d");
  canvas.addEventListener("mousedown", function(e){
    currX = e.clientX - canvas.offsetLeft;
    currY = e.clientY - canvas.offsetTop;
    stackX.push(currX);
    stackY.push(currY);

    context.beginPath();
    context.arc(currX, currY, 4, 0, 2 * Math.PI, false);
    context.fillStyle = '#' + generateRandomColorString();
    context.fill();
    //context.lineWidth = 5;
    //context.strokeStyle = randomColor;
    //context.stroke();
  });
}

function generateRandomColorString(){
  var toReturn = "";
  for(var i=0; i<6; i++){
    toReturn += colors[Math.floor(Math.random()*16)];
  }
  return toReturn;
}

function clear(){
  stackX = [];
  stackY = [];
  context.clearRect(0,0,canvas.width, canvas.height);
}

$(document).ready(init());

function measureDistance(a, b){
  return Math.sqrt(Math.pow((a.x-b.x),2) + Math.pow((a.y-b.y),2));
}

function Point(x, y){
  this.x = x;
  this.y = y;
}

function computeJMSetUp(){
  var pointArray = [];
  //now add the points into the array, and then sort.
  for(var i=0; i<stackX.length; i++){
    pointArray.push(new Point(stackX[i], stackY[i]));
  }
  computeJM(pointArray);
}

function computeGSSetUp(){
  var pointArray = [];
  //now add the points into the array, and then sort.
  for(var i=0; i<stackX.length; i++){
    pointArray.push(new Point(stackX[i], stackY[i]));
  }
  computeGS(pointArray);
}

function computeCASetUp(){
  var pointArray = [];
  //now add the points into the array, and then sort.
  for(var i=0; i<stackX.length; i++){
    pointArray.push(new Point(stackX[i], stackY[i]));
  }
  computeCA(pointArray);
}

function computeJM(pointArray){
  //we have the stackx and stacky arrays to help find the convex hull.
  /*pointArray.sort(function(a,b){
    if(a.x<b.x)
      return b.x-a.x;
    return a.x-b.x;
  });
  */
  //now we perform the jarvis march algorithm!
  //1. get leftmost point.
  //to get leftmost point, just keep a variable leftmin that tracks the leftmost point
  var left = pointArray[0].x;
  var leftIndex = 0;
  for(var i=1; i<pointArray.length; i++){
    if(pointArray[i].x<left){
      left = pointArray[i].x;
      leftIndex = i;
    }
  }

  //the leftmost point is at the ith position. yasss
  //now we compare this ith point to every other to find the smallest exterior angle.
  //as can be seen here:
  //"https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Jarvis_march
  //_convex_hull_algorithm_diagram.svg/280px-Jarvis_march_convex_hull_algorithm_diagram.svg.png"
  var previousPoint = new Point(pointArray[leftIndex].x, canvas.height);
  var startPoint = pointArray[leftIndex];
  var currentPoint = pointArray[leftIndex];
  var currentPointIndex = leftIndex;
  var previousPointIndex = -1;
  //prepare a variable that constantly changes.
  var exteriorAngle, firstSide, secondSide, thirdSide;
  var convexHullArray = [];
  convexHullArray.push(startPoint);

  while((convexHullArray.length===1 || convexHullArray[0]!==convexHullArray[convexHullArray.length-1])){
    var maxIntAngle = 0;
    var currentIntAngle;
    var temp = currentPointIndex;
    for(var i=0; i<pointArray.length; i++){
      if(i===currentPointIndex || i===previousPointIndex)
        continue;
      else{
        //now we do math to find the maximum interior* angle, law of cosines is our friend here
        //its the same thing, minimum exterior angle, maxmimum interior angle, xdddd
        firstSide = measureDistance(previousPoint, currentPoint);
        secondSide = measureDistance(currentPoint, pointArray[i]);
        thirdSide = measureDistance(previousPoint, pointArray[i]);
        currentIntAngle = Math.acos(((Math.pow(thirdSide,2)) - Math.pow(secondSide,2) - Math.pow(firstSide,2))/(-2*secondSide*firstSide));
        if(currentIntAngle>maxIntAngle){
          currentPointIndex = i;
          maxIntAngle = currentIntAngle;
        }
      }
    }
    previousPointIndex = temp;
    //push the point onto convexhullarray
    convexHullArray.push(pointArray[currentPointIndex]);
    //also update current point.
    previousPoint.x = currentPoint.x;
    previousPoint.y = currentPoint.y;
    currentPoint = pointArray[currentPointIndex];
  }

  //now we have an array that holds the points of the convex hull.
  context.beginPath();
  context.moveTo(convexHullArray[0].x, convexHullArray[0].y);
  context.strokeStyle = '#000000';
  context.lineWidth = 1;
  for(var i=1; i<convexHullArray.length; i++){
    context.lineTo(convexHullArray[i].x, convexHullArray[i].y);
    context.stroke();
  }

  return;
}

function GrahamObject(point, angle){
  this.x = point.x;
  this.y = point.y;
  this.angle = angle;
}

function isCCW(a, b, c){
  var x = ((b.x-a.x)*(c.y-a.y) - (b.y-a.y)*(c.x-a.x));
  if(x<=0)
    return false;
  return true;
}

function computeGS(pointArray){
  //get bottomost point.
  var bottomPoint = pointArray[0];
  bottomPointIndex = 0;
  for(var i=0; i<pointArray.length; i++){
    if(pointArray[i].y>bottomPoint.y){
      bottomPoint = pointArray[i];
      bottomPointIndex = i;
    }
  }

  var grahamScanArray = [];
  var interiorAngleFinder = new Point(canvas.width, bottomPoint.y);
  grahamScanArray.push(new GrahamObject(bottomPoint, 0));
  for(var i=0; i<pointArray.length; i++){
    if(i===bottomPointIndex)
      continue;
    var toPush = new GrahamObject(pointArray[i], 0);
    //update the angle using math.
    var firstSide = measureDistance(interiorAngleFinder, bottomPoint);
    var secondSide = measureDistance(bottomPoint, pointArray[i]);
    var thirdSide = measureDistance(interiorAngleFinder, pointArray[i]);
    toPush.angle = Math.acos(((Math.pow(thirdSide,2)) - Math.pow(secondSide,2) - Math.pow(firstSide,2))/(-2*secondSide*firstSide));
    grahamScanArray.push(toPush);
  }
  grahamScanArray.sort(function(a,b){
    if(a.angle<=b.angle)
      return -1;
    return 1;
  });

  //to make a cycle of points, for the algorithm later to work properly.
  grahamScanArray.push(grahamScanArray[0]);

  //now we do math to determine what goes in the convexhull or not.
  //if it isnt, splice it from the array.
  //we can try something cool with matrices.
  //the first two values are definite;y in the convex hull.
  var convexHullArray = [];
  convexHullArray.push(grahamScanArray[0]);
  convexHullArray.push(grahamScanArray[1]);
  for(var i=2; i<grahamScanArray.length; i++){
    var currentPoint = convexHullArray.pop();
    while(isCCW(convexHullArray[convexHullArray.length-1], currentPoint, grahamScanArray[i])){
      currentPoint = convexHullArray.pop();
    }
    convexHullArray.push(currentPoint);
    convexHullArray.push(grahamScanArray[i]);
  }

  //now draw lines.
  context.beginPath();
  context.moveTo(convexHullArray[0].x, convexHullArray[0].y);
  context.strokeStyle = '#000000';
  context.lineWidth = 1;
  for(var i=1; i<convexHullArray.length; i++){
    context.lineTo(convexHullArray[i].x, convexHullArray[i].y);
    context.stroke();
  }
}
