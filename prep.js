/* import Rotator from "rotato"; */

const angle = (30*Math.PI)/180;

//  Create a new canvas for test image input. Get it's 2D context.
let cnvsIn = document.createElement('canvas');
let cntxIn = cnvsIn.getContext('2d');
//  Create an image object using the test image.
testImg = new Image();
testImg.src = 'fish.png';
//  Resize canvas to match test image.
cnvsIn.width = 393;
cnvsIn.height = 501;
//  When test image is loaded, push to canvas and add canvas to HTML page.
testImg.onload = function() {cntxIn.drawImage(testImg, 0, 0)};
document.body.appendChild(cnvsIn);

//  Pull an ImageData object from the canvas containing the data of thetest image.
//  This will be the imput to the image rotation algorithm.
let imgDataIn = cntxIn.getImageData(0, 0, cnvsIn.width, cnvsIn.height);

//  Create a new canvas for test image input. Get it's 2D context.
let cnvsOut = document.createElement('canvas');
let cntxOut = cnvsOut.getContext('2d');

//  Resize canvas to fit rotated image and add to HTML page.
cnvsOut.width = (cnvsIn.height*Math.sin(angle)) + (cnvsIn.width*Math.cos(angle));
cnvsOut.height = (cnvsIn.width*Math.sin(angle)) + (cnvsIn.height*Math.cos(angle));
document.body.appendChild(cnvsOut);

//  Run rotation algorithm on the ImageData object.
imgRot = new Rotator(imgDataIn);
imgDataOut = imgRot.rotate(angle);

cntxOut.putImageData(imgDataOut, 0, 0);