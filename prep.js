/* import rotate from 'http://127.0.0.1:5500/rotato.js'; */

const angle = (30*Math.PI)/180;

//  Create an image object using the test image.
testImg = new Image();
testImg.src = 'fish.png';

//  Get canvas element from HTML page and it's 2D context.
let cnvsIn = document.getElementById('input');
let cntx = cnvsIn.getContext('2d');
//  Put test image into the canvas and pull the ImageData from it.
cntx.drawImage(testImg, 0, 0);
let imgData = cntx.getImageData(0, 0, cnvsIn.width, cnvsIn.height);

//  Resize canvas to fit rotated image.
let oldx = cnvsIn.width;
let newx = (cnvsIn.height*Math.sin(angle)) + (cnvsIn.width*Math.cos(angle));
let newy = (cnvsIn.width*Math.sin(angle)) + (cnvsIn.height*Math.cos(angle));
cnvsIn.width = newx;
cnvsIn.height = newy;

//  Run rotation algorithm on the ImageData object.
//  rotate(imgData)