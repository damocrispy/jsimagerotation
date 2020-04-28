/* import Rotator from "rotato"; */

//  Input angle. Convert to radians for rotation algorithm.
const angle = (135*Math.PI)/180;

//  Create a new canvas for test image input. Get it's 2D context.
let cnvsIn = document.createElement('canvas');
let cntxIn = cnvsIn.getContext('2d');
//  Resize canvas to match test image.
cnvsIn.width = 393;
cnvsIn.height = 501;

//  Create a new canvas for test image output. Get it's 2D context.
let cnvsOut = document.createElement('canvas');
let cntxOut = cnvsOut.getContext('2d');
//  Resize canvas to fit rotated image.
cnvsOut.width = Math.abs(cnvsIn.height*Math.sin(angle)) + Math.abs(cnvsIn.width*Math.cos(angle));
cnvsOut.height = Math.abs(cnvsIn.width*Math.sin(angle)) + Math.abs(cnvsIn.height*Math.cos(angle));
cnvsOut.width = Math.round(cnvsOut.width);
cnvsOut.height = Math.round(cnvsOut.height);

//  Create an image object.
testImg = new Image();
//  When test image is loaded wait for it to load before continuing.
testImg.onload = function() {
    //  Push the Image object to the input canvas.
    cntxIn.drawImage(testImg, 0, 0)

    //  Pull an ImageData object from the input canvas.
    //  This will be the input to the image rotation algorithm.
    let imgDataIn = cntxIn.getImageData(0, 0, cnvsIn.width, cnvsIn.height);

    //  Run rotation algorithm on the ImageData object.
    imgRot = new Rotator(imgDataIn);
    imgDataOut = imgRot.rotate(angle);

    //  Push resulting ImageData object to the output canvas.
    cntxOut.putImageData(imgDataOut, 0, 0);
    document.body.appendChild(cnvsOut);
};

//  Load test image from file to the Image.
testImg.src = 'fish.png';
document.body.appendChild(cnvsIn);