class Rotator{
   constructor (imgIn) {
      this.imgIn = imgIn;
   }

   matMult(a, b){

      // Matrix multiplication. A matrix is represented as an array of arays.
      
      // Dimensions of input matrices.
      let arows = a.length;  // Number of rows.
      let acols = a[0].length;  // Number of columns.
      let brows = b.length;
      let bcols = b[0].length;

      if(acols != brows) {
         console.log('Cannot multiply matrices.');
         console.log('Check dimensions.');
         return;
      }

      // Build empty resulting matrix of correct dimensions.
      let result = new Array(arows);
      for(let row = 0; row < arows; row++) {
         result[row] = new Array(bcols);
      }

      // For every element in the resulting matrix calculate its value.
      // Similar to what this guy did: https://www.codewithc.com/matrix-multiplication-in-c/
      let element = 0;
      for(let r = 0; r < arows; r++) {
         for(let c = 0; c < bcols; c++) {
            for(let k = 0; k < acols; k++) {
               element += a[r][k] * b[k][c];            
            }
            result[r][c] = element;
            element = 0;
         }
      }

      return result;
   }

   rotate(angle){

      /* 
      This rotation algorithm is based on the idea of inverse mapping - taking an output pixel
      and calculating it's most likely input pixel, then copying RBA data from input to output.
      This is dicussed further at the links below.
      https://pythontic.com/image-processing/pillow/rotate

      Mapping is done by first translating a pixel (i.e. a vector) such that it is in a new
      coordinate frame where the rotation required will be aboubt the origin. Rotation is then
      carried out. Resulting vector is then translated back its position relative to the centre
      of the imput image.
      More on rotation and translation matrices here:
      https://en.wikipedia.org/wiki/Rotation_(mathematics)
      https://en.wikipedia.org/wiki/Translation_(geometry)

      Matrices are left-multiplied to create a single trandformation matrix. More on this
      combination of matrices to model a series of transformations here:
      https://www.mauriciopoppe.com/notes/computer-graphics/transformation-matrices/combining-transformations/
       */

      let start = performance.now();

      // Input angle. Required to be in radians.
      this.theta = angle;
      
      // Find dimensions of output image.
      let width = Math.abs(this.imgIn.height*Math.sin(this.theta)) + Math.abs(this.imgIn.width*Math.cos(this.theta));
      let height = Math.abs(this.imgIn.width*Math.sin(this.theta)) + Math.abs(this.imgIn.height*Math.cos(this.theta));
      width = Math.floor(width);
      height = Math.floor(height);

      // Create empty Uint8ClampedArray representing data of ImageData output object.
      let arrayOut = new Uint8ClampedArray(width * height * 4);
      
      // Coordinates of centre of image.
      let cntrX = width / 2;
      let cntrY = height / 2;

      // Form transformation matrices.
      // 1. Translate pixel (vector) so that rotation is about origin.
      let transToOrigin = [[1, 0, -cntrX],
         [0, 1, -cntrY],
         [0, 0, 1]];

      // 2. Rotate pixel about origin.
      let rotMat = [[Math.cos(this.theta), Math.sin(this.theta), 0],
         [-Math.sin(this.theta), Math.cos(this.theta), 0],
         [0, 0, 1]];

      // 3. Reverse original translation.
      let transFromOrigin = [[1, 0, this.imgIn.width / 2],
         [0, 1, this.imgIn.height / 2],
         [0, 0, 1]];

      // 4. Multiply the above transformations to find combined transformation matrix.
      let transRot = this.matMult(rotMat, transToOrigin);
      let transMat = this.matMult(transFromOrigin, transRot);
     
      // For each pixel in output image, find corresponding pixel in input and copy pixel value.
      for(let y = 0; y < height; y++) {
         for(let x = 0; x < width; x++) {

            // Coordinates of a pixel in the output image.
            let pxlOut = [[x], [y], [1]];
            // Coordinates after transformation.
            var pxlIn = this.matMult(transMat, pxlOut);

            // Round to nearest pixel. This is the source of the current pixel.
            pxlIn[0] = Math.round(pxlIn[0]);
            pxlIn[1] = Math.round(pxlIn[1]);
            
            // Assign values from source pixel to current output pixel.
            for(let i = 0; i < 4; i++) {
               // If calculated source pixels fall outside source image, set values to 0.
               if(pxlIn[0] >= 0 && pxlIn[0] < this.imgIn.width && pxlIn[1] >= 0 && pxlIn[1] < this.imgIn.height) {
                  arrayOut[((y * width) + x) * 4 + i] = this.imgIn.data[((pxlIn[1] * this.imgIn.width) + pxlIn[0]) * 4 + i];
               } else {
                  arrayOut[((y * width) + x) * 4 + i] = 0;
               }
            }
         }
      }
      
      // Create output ImageData object with reconstructed data and correct dimensions.
      this.imgOut = new ImageData(arrayOut, width, height);

      let finish = performance.now();
      console.log((finish - start) + 'ms to execute.');

      return this.imgOut;
   }
}

/* export { Rotator }; */