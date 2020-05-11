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

//  Create a new canvas for test image input. Get it's 2D context.
let cnvsIn = document.createElement('canvas');
let cntxIn = cnvsIn.getContext('2d');
//  Resize canvas to match test image.
cnvsIn.width = 393;
cnvsIn.height = 501;

let imgRot = new Rotator(new ImageData(cnvsIn.width, cnvsIn.height));

//  Create a new canvas for test image output. Get it's 2D context.
let cnvsOut = document.createElement('canvas');
let cntxOut = cnvsOut.getContext('2d');

//  Resize canvas to fit rotated image.
let newDims = imgRot.resize(cnvsIn.width, cnvsIn.height, angle);
cnvsOut.width = newDims[0];
cnvsOut.height = newDims[1];

//  Create an image object.
let testImg = new Image();
//  When test image is loaded wait for it to load before continuing.
testImg.onload = function() {
    //  Push the Image object to the input canvas.
    cntxIn.drawImage(testImg, 0, 0)

    //  Pull an ImageData object from the input canvas.
    //  This will be the input to the image rotation algorithm.
    let imgDataIn = cntxIn.getImageData(0, 0, cnvsIn.width, cnvsIn.height);

    //  Run rotation algorithm on the ImageData object.
    //let imgRot = new Rotator(imgDataIn);
    imgRot.imgIn = imgDataIn;

    let start = performance.now();
    //let imgDataOut = imgRot.rotate(angle);
    imgRot.rotate(angle)
        .then(imgDataOut => {
            let finish = performance.now();
            document.getElementById('status').innerText = (finish - start) + 'ms to execute.';
            console.log(imgDataOut);

            //  Push resulting ImageData object to the output canvas.
            cntxOut.putImageData(imgDataOut, 0, 0);
            document.body.appendChild(cnvsOut);
        })
        .catch(new Error('Something went arseways there.'));//err => console.log('Nope. Not that time.'))
    

    
    

};

//  Load test image from file to the Image.
testImg.src = 'fish.png';
document.body.appendChild(cnvsIn);