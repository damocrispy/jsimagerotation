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

      if(acols != brows){
         console.log('Cannot multiply matrices.');
         console.log('Check dimensions.');
         return;
      }

      // Build empty resulting matrix of correct dimensions.
      let result = new Array(arows);
      for(let row = 0; row < arows; row++){
         result[row] = new Array(bcols);
      }

      // For every element in the resulting matrix calculate its value.
      // Similar to what this guy did: https://www.codewithc.com/matrix-multiplication-in-c/
      let element = 0;
      for(let r = 0; r < arows; r++){
         for(let c = 0; c < bcols; c++){
            for(let k = 0; k < acols; k++){
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
       */

      let start = performance.now();

      this.theta = angle;

      // Find dimensions of output image.
      let width = (this.imgIn.height*Math.sin(this.theta)) + (this.imgIn.width*Math.cos(this.theta));
      let height = (this.imgIn.width*Math.sin(this.theta)) + (this.imgIn.height*Math.cos(this.theta));
      width = Math.round(width);
      height = Math.round(height);
      // Create empty Uint8ClampedArray representing data of ImageData output object.
      let arrayOut = new Uint8ClampedArray(width * height * 4);
      
      // Coordinates of centre of image. Structure as a matrix i.e. array of arrays.
      let cntrX = width / 2;
      let cntrY = height / 2;
      
      for(let y = 0; y < height; y++){
         for(let x = 0; x < width; x++){

            // Coordinates of a pixel in the output image.
            let pxlCoord = [[x], [y], [1]];

            // Form transformation matrices.
            let transToOrigin = [[1, 0, -cntrX],
               [0, 1, -cntrY],
               [0, 0, 1]];

            let rotMat = [[Math.cos(this.theta), -Math.sin(this.theta), 0],
               [Math.sin(this.theta), Math.cos(this.theta), 0],
               [0, 0, 1]];

            let transFromOrigin = [[1, 0, cntrX],
               [0, 1, cntrY],
               [0, 0, 1]];

            // 1. Translate pixel (vector) so that rotation is about origin.
            let pxlTrans = this.matMult(transToOrigin, pxlCoord);

            // 2. Rotate pixel about origin.
            let pxlRot = this.matMult(rotMat, pxlTrans);

            // 3. Reverse original translation.
            let pxlSrc = this.matMult(transFromOrigin, pxlRot);

            // 4. Round to nearest pixel. This is the source of the current pixel.
            pxlSrc[0] = Math.round(pxlSrc[0]);
            pxlSrc[1] = Math.round(pxlSrc[1]);

            /* // 1. Distance of current pixel from image centre.
            let dist = Math.hypot((x - cntrX), (y - cntrY));
            // 2. Angle of current pixel form horizontal.
            let psi = Math.atan(y/x);
            // 3. Angle of source pixel from horizontal.
            let ro = this.theta - psi;
            // 4. X-coordinate of source pixel. Rounded to nearest pixel.
            let srcX = Math.round( dist * Math.cos(ro) );
            // 5. Y-coordinate of source pixel. Rounded to nearest pixel.
            let srcY = Math.round( dist * Math.sin(ro) ); */

            // Assign values from nearest matching source pixel to current output pixel
            for(let i = 0; i < 4; i++){
               arrayOut[((y * width) + x) * 4 + i] = this.imgIn.data[((pxlSrc[1] * width) + pxlSrc[0]) * 4 + 0];
            }
            

            // Loop structure inspired by: https://stackoverflow.com/a/9138593
            // Find four byte value of a pixel.
/*             this.imgOut.data[((x * width) + y) * 4 + 0]  // R
            this.imgOut.data[((x * width) + y) * 4 + 1]  // G
            this.imgOut.data[((x * width) + y) * 4 + 2]  // B
            this.imgOut.data[((x * width) + y) * 4 + 3]  // A */
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