/* 
Prepare the input for the image rotation algorithms.
This file will load an image to the HTML page. An
ImageData object is taken from this to be used as an
input to the rotation algorithms, as required in the
project spec. Several algorithms compared:

o   Basic algorithm using a series of translations and a
    rotation to implement a Euclidean transformation.
    Uses Canvas API
    -   result displayed in HTML
    -   present for reference
o   Similar algorithm implemented in JavaScript
o   Similar algorithm implemented in Python
o   Rotation carried out by SciPy ndimage.rotate. This
    uses an algorithm based on spline interpolation

JS/Python algorithms are executed by a member function
of a 'Rotator' class defined in the 'rotato.js' file.
'rotateJS()' carries out the implementation in JavaScript
while 'rotatePy()' uses fetch API to pass data to a Flask
server which then calls the Python implementation of the
algorithm. Execution times are displayed on HTML page.
 */



//  Input angle. Convert to radians for rotation algorithm.
const angle = (-30*Math.PI)/180;

//  Create two new canvases for test image input and output. Get their 2D contexts.
let cnvsIn = document.createElement('canvas');
let cntxIn = cnvsIn.getContext('2d');

let cnvsOut = document.createElement('canvas');
let cntxOut = cnvsOut.getContext('2d');

//  Resize input canvas to match test image.
cnvsIn.width = 393;
cnvsIn.height = 501;

//  Instantiate Rotator class. Object will be used later but for now just need resize() method.
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
document.getElementById('canTime').innerText = (performance.now() - startCanv);

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

   let startJS = performance.now();

   let imgOutJS = imgRot.rotateJS(angle);

    //  Display execution time.
    document.getElementById('jsTime').innerText = (performance.now() - startJS);

    /*  End JavaScript Algorithm Implementation */



    /*

    Python Algorithm Implementation

    */
   
    let startPy = performance.now();

    let imgOutPy;

    imgRot.rotatePy(angle)
        .then(result => {
            //  Display execution time.
            document.getElementById('pyTime').innerText = (performance.now() - startPy);
            document.getElementById('pyExTime').innerText = result[1];

            imgOutPy = result[0];
        })
        .catch(new Error('Something went arseways in rotatePy().'));

    /*  End Python Algorithm Implementation */


    /*

    SciPy Algorithm Implementation

    */
   
   let startSciPy = performance.now();

   let imgOutSciPy;

   imgRot.rotateSciPy(angle)
       .then(result => {
           //  Display execution time.
           document.getElementById('scipyTime').innerText = (performance.now() - startPy);
           document.getElementById('scipyExTime').innerText = result[1];

           imgOutSciPy = result[0];
       })
       .catch(new Error('Something went arseways in rotateSciPy().'));

   /*  End Python Algorithm Implementation */    

};

//  Load test image from file to the Image.
testImg.src = 'fish.png';
document.body.appendChild(cnvsIn);
document.body.appendChild(cnvsOut);