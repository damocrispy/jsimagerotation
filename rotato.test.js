const Rotator = require('./rotato');

const testRotator = new Rotator();

test ('Multiplies two matrices', () => {
    expect(testRotator.matMult([[1, 2], [3, 4]], [[5, 6], [7, 8]])).toEqual([[19, 22], [43, 50]]);
});

test ('Finds new width and height of a rotated recatngle', () => {
    expect(testRotator.resize(250, 650, 1.05)).toEqual([688, 540]);
})