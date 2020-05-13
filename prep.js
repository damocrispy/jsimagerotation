/* 
Prepare the input for the image rotation algorithm.
This file will pull an image fromt he HTML page,
pull out the ImageData object that is required
as an input to the algorithm in the project spec
and then pass it as an argument to the rotation algorithm.
This algorithm is executed by a member function of a
'Rotator' class defined in the 'rotato.js' file.
The algorithm returns an ImageData object which is pushed to
the HTML page thus showing input and output side-by-side.
 */

//  Input angle. Convert to radians for rotation algorithm.
const angle = (60*Math.PI)/180;

//  Create two new canvases for test image input and output. Get their 2D contexts.
let cnvsIn = document.createElement('canvas');
let cntxIn = cnvsIn.getContext('2d');

let cnvsOut = document.createElement('canvas');
let cntxOut = cnvsOut.getContext('2d');

//  Resize canvases to match test image.
cnvsIn.width = 393;
cnvsIn.height = 501;

let imgRot = new Rotator(new ImageData(cnvsIn.width, cnvsIn.height));

//  Resize canvas to fit rotated image.
let newDims = imgRot.resize(cnvsIn.width, cnvsIn.height, angle);
cnvsOut.width = newDims[0];
cnvsOut.height = newDims[1];

/*

Canvas API

*/

let startCanv = performance.now();

//  Similar series of rotation and translations as used in rotatePy/rotateJS algorithm.
//  This rotates the image about its centre.
cntxOut.translate((cnvsOut.width / 2), (cnvsOut.height / 2));
cntxOut.rotate(angle);
cntxOut.translate((-cnvsIn.width / 2), (-cnvsIn.height / 2));

//  Display execution time.
let canvasTime = performance.now() - startCanv;
document.getElementById('status1').innerText = 'Canvas API (result displayed): ' + canvasTime + 'ms.';

/* End Canvas API   */



//  Create an image object.
let testImg = new Image();
//  When test image is loaded wait for it to load before continuing.
testImg.onload = function() {
    //  Push the Image object to the two canvases.
    cntxIn.drawImage(testImg, 0, 0);    //  Input canvas.
    cntxOut.drawImage(testImg, 0, 0);   //  Canvas API output canvas.

    //  Pull an ImageData object from the input canvas.
    let imgDataIn = cntxIn.getImageData(0, 0, cnvsIn.width, cnvsIn.height);

    //  Assign this to the input property of the image rotation object.
    imgRot.imgIn = imgDataIn;

    /*

    JavaScript Algorithm Implementation

    */



    /*  Python Algorithm Implementation */

    let startJS = performance.now();

    imgOutJS = imgRot.rotateJS(angle);
    console.log(imgOutJS);

    /*

    Python Algorithm Implementation

    */
   
    let startPy = performance.now();

    imgRot.rotatePy(angle)
        .then(imgDataOut => {
            //  Display execution time.
            document.getElementById('status3').innerText = 'Python, including transport: ' + (performance.now() - startPy) + 'ms.';
            document.getElementById('status4').innerText = 'Python, processing only: ' + imgDataOut[1] + 'ms.';
        })
        .catch(new Error('Something went arseways there.'));

    /*  End Python Algorithm Implementation */

};

//  Load test image from file to the Image.
testImg.src = 'fish.png';
document.body.appendChild(cnvsIn);
document.body.appendChild(cnvsOut);