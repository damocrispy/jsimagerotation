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
const angle = (10*Math.PI)/180;

//  Create canvas to display test image.
let cnvsIn = document.createElement('canvas');
let cntxIn = cnvsIn.getContext('2d');

//  Create an canvases to display results of each algorithm.
let cnvsCan = document.createElement('canvas');
let cntxCan = cnvsCan.getContext('2d');
let cnvsJS = document.createElement('canvas');
let cntxJS = cnvsJS.getContext('2d');
let cnvsPy = document.createElement('canvas');
let cntxPy = cnvsPy.getContext('2d');
let cnvsSciPy = document.createElement('canvas');
let cntxSciPy = cnvsSciPy.getContext('2d');

//  Resize input canvas to match test image.
cnvsIn.width = 393;
cnvsIn.height = 501;

//  Instantiate Rotator class. Object will be used later but for now just need resize() method.
let imgRot = new Rotator(new ImageData(cnvsIn.width, cnvsIn.height));

//  Resize canvas to fit rotated image.
let newDims = imgRot.resize(cnvsIn.width, cnvsIn.height, angle);
cnvsCan.width = newDims[0];
cnvsCan.height = newDims[1];

/*

Canvas API

*/

let startCanv = performance.now();

//  Similar series of rotation and translations as used in rotatePy/rotateJS algorithm.
//  This rotates the image about its centre.
cntxCan.translate((cnvsCan.width / 2), (cnvsCan.height / 2));
cntxCan.rotate(angle);
cntxCan.translate((-cnvsIn.width / 2), (-cnvsIn.height / 2));

//  Display execution time.
document.getElementById('canTime').innerText = (performance.now() - startCanv);

//  Mean squared error not applicable.
document.getElementById('canMSE').innerText = "-";

/* End Canvas API   */



//  Create an image object.
let testImg = new Image();

//  Wait for test image to load before continuing.
testImg.onload = function() {
    //  Push the Image object to the two canvases.
    cntxIn.drawImage(testImg, 0, 0);    //  Input canvas.
    cntxCan.drawImage(testImg, 0, 0);   //  Canvas API output canvas.

    //  Pull an ImageData object from the input canvas.
    let imgDataIn = cntxIn.getImageData(0, 0, cnvsIn.width, cnvsIn.height);
    //  Pull an ImageData object from the output canvas as rotated by the Canvas API.
    //  Algorithm outputs will be compared to this.
    let imgOutCnv = cntxCan.getImageData(0, 0, cnvsCan.width, cnvsCan.height);

    //  Assign this to the input property of the image rotation object.
    imgRot.imgIn = imgDataIn;

    /*

    JavaScript Algorithm Implementation

    */

    //  Create an instance of Rotator for JS rotation.
    let imgRotJS = new Rotator(imgDataIn);

    let startJS = performance.now();
        
    //  Perform rotation
    let imgOutJS = imgRotJS.rotateJS(angle);

    //  Calculate and display execution time.
    document.getElementById('jsTime').innerText = (performance.now() - startJS);

    //  Calculate and display mean squared error with Canvas API rotation as reference.
    document.getElementById('jsMSE').innerText = imgRotJS.mse(imgOutCnv);

    //  Resize result canvas to match resulting image.
    cnvsJS.width = imgOutJS.width;
    cnvsJS.height = imgOutJS.height;
    cntxJS.putImageData(imgOutJS, 0, 0);

    /*  End JavaScript Algorithm Implementation */



    /*

    Python Algorithm Implementation

    */

    //  Create an instance of Rotator for JS rotation.
    let imgRotPy = new Rotator(imgDataIn);
   
    let startPy = performance.now();

    let imgOutPy;

    //  Perform rotation
    imgRotPy.rotatePy(angle)
        .then(result => {
            //  Display execution time.
            document.getElementById('pyTime').innerText = (performance.now() - startPy);
            document.getElementById('pyExTime').innerText = result[1];

            imgOutPy = result[0];

            //  Calculate and display mean squared error with Canvas API rotation as reference.
            document.getElementById('pyMSE').innerText = imgRotPy.mse(imgOutCnv);
            document.getElementById('pyExMSE').innerText = 'As above';

            //  Resize result canvas to match resulting image.
            cnvsPy.width = imgOutPy.width;
            cnvsPy.height = imgOutPy.height;
            cntxPy.putImageData(imgOutPy, 0, 0);
        })
        .catch(new Error('Something went arseways in rotatePy().'));

    /*  End Python Algorithm Implementation */


    /*

    SciPy Algorithm Implementation

    */

    //  Create an instance of Rotator for JS rotation.
    let imgRotSciPy = new Rotator(imgDataIn);
   
   let startSciPy = performance.now();

   let imgOutSciPy;

   imgRotSciPy.rotateSciPy(angle)
       .then(result => {
           //  Display execution time.
           document.getElementById('scipyTime').innerText = (performance.now() - startSciPy);
           document.getElementById('scipyExTime').innerText = result[1];

           imgOutSciPy = result[0];

           //  Calculate and display mean squared error with Canvas API rotation as reference.
           document.getElementById('scipyMSE').innerText = imgRotSciPy.mse(imgOutCnv);
           document.getElementById('scipyExMSE').innerText = 'As above';

           //  Resize result canvas to match resulting image.
           cnvsSciPy.width = imgOutSciPy.width;
           cnvsSciPy.height = imgOutSciPy.height;
           cntxSciPy.putImageData(imgOutSciPy, 0, 0);
       })
       .catch(new Error('Something went arseways in rotateSciPy().'));  

   /*  End Python Algorithm Implementation */    

};

//  Create Headers and image canvases for test input and algorithm outputs.
testImg.src = 'fish.png';

let inHead = document.createElement('h2');
inHead.appendChild(document.createTextNode('Test Input'));
document.body.appendChild(inHead);
document.body.appendChild(cnvsIn);

let canHead = document.createElement('h2');
canHead.appendChild(document.createTextNode('Canvas API Result'));
document.body.appendChild(canHead);
document.body.appendChild(cnvsCan);

let jsHead = document.createElement('h2');
jsHead.appendChild(document.createTextNode('Euclidean Transformation (JavaScript) Result'));
document.body.appendChild(jsHead);
document.body.appendChild(cnvsJS);

let pyHead = document.createElement('h2');
pyHead.appendChild(document.createTextNode('Euclidean Transformation (Python) Result'));
document.body.appendChild(pyHead);
document.body.appendChild(cnvsPy);

let scipyHead = document.createElement('h2');
scipyHead.appendChild(document.createTextNode('SciPy (Python) Result'));
document.body.appendChild(scipyHead);
document.body.appendChild(cnvsSciPy);