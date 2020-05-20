const Rotator = require('./rotato');
const Canvas = require('canvas');

//  Create a test input ImageData object.
let imgData = Uint8ClampedArray.from(new Array(250 * 650 * 4).fill(1));
let imgDataIn = new Canvas.ImageData(imgData, 250, 650);
//  Create a test Rotator object using test ImageData
let testRotator = new Rotator(imgDataIn);

let angle = 1.05;    //  Radians.

//  Create an expected output ImageData object.
imgData = Uint8ClampedArray.from(new Array(688 * 540 * 4).fill(0));
let imgDataOut = new Canvas.ImageData(imgData, 688, 540);

/* test ('Rotate image by specified angle', async () => {
    //expect.assertions(1);
    expect(await testRotator.rotateJS(angle)).resolves.toEqual(imgDataOut);
    }); */

test ('Find new width and height of a rotated recatngle', () => {
    expect(testRotator.resize(250, 650, 1.05)).toEqual([688, 540]);
});

test ('Find mean squared error of two images', () => {
    expect(testRotator.mse(imgDataOut)).toEqual(1);
})