const Rotator = require('./rotato');

const testRotator = new Rotator();

//  Build test case input object - mimic structure of ImageData object.
/* let angle = 1.05;    //  Radians.
testRotator.imgIn = {
    'data': [0] * 250 * 650 * 4,
    'width': 250,
    'height': 650
};

imgOut = {
    'data': [0] * 688 * 540 * 4,
    'width': 688,
    'height': 540
};

test ('Rotates image by specified angle', async () => {
    expect.assertions(1);
    expect(await testRotator.rotate(angle)).resolves.toEqual(imgOut);
    }); */

test ('Finds new width and height of a rotated recatngle', () => {
    expect(testRotator.resize(250, 650, 1.05)).toEqual([688, 540]);
});