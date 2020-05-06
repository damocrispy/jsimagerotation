const Rotator = require('./rotato');

test ('Multiplies two matrices', () => {
    const testRotator = new Rotator();
    console.log(testRotator);
    expect(testRotator.matMult([[1, 2], [3, 4]], [[5, 6], [7, 8]])).toEqual([[19, 22], [43, 50]]);
});