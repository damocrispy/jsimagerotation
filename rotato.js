class Rotator{
   constructor (imgIn) {
      this.imgIn = imgIn;
   }

   matMult(a, b){

      // Matrix multiplication. A matrix is represented as an array of arays.

      // Dimensions of input matrices.
      let arows = a.size;  // Number of rows.
      let acols = a[0].size;  // Number of columns.
      let brows = b.size;
      let bcols = b[0].size;

      if(acols != brows){
         console.log('Cannot multiply matrices.');
         console.log('Check dimensions.');
         return;
      }

      // Build empty resulting matrix of correct dimensions.
      let result = [];
      let emptyRow = new Array(bcols);
      for(let row = 0; row < arows; row++){
         result.push(emptyRow);
      }

      // For every element in the resulting matrix calculate its value.
      // Similar to what this guy did: https://www.codewithc.com/matrix-multiplication-in-c/
      let element = 0;
      for(let r = 0; r < arows; r++){
         for(let c = 0; c < bcols; c++){
            for(let k = 0; k < acols; k++){
               element = element + a[r][k] * b[k][c];
               result[r][c] = element;
            }

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
      console.log(this.imgIn.data);
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
      let cntr = [[cntrX], [cntrY], [1]];

      // Loop structure inspired by: https://stackoverflow.com/a/9138593

      
      for(let y = 0; y < height; y++){
         for(let x = 0; x < width; x++){

            let pxlCoord = [[x], [y], [1]];

            // 1. Translate pixel so that rotation is about origin.
            this.matMult(cntr, pxlCoord);

            // 2. Rotate pixel about origin.
            // 3. Translate pixel back to original position.

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
            /* for(let i = 0; i < 4; i++){
               arrayOut[((x * width) + y) * 4 + i] = this.imgIn.data[((srcX * width) + srcY) * 4 + 0];
            } */
            
            // Find four byte value of a pixel.
/*             this.imgOut.data[((x * width) + y) * 4 + 0]  // R
            this.imgOut.data[((x * width) + y) * 4 + 1]  // G
            this.imgOut.data[((x * width) + y) * 4 + 2]  // B
            this.imgOut.data[((x * width) + y) * 4 + 3]  // A */
         }
      }
      console.log(arrayOut);
      console.log(width);
      console.log(height);
      // Create output ImageData object with reconstructed data and correct dimensions.
      this.imgOut = new ImageData(arrayOut, width, height);
      
      let finish = performance.now();
      console.log((finish - start) + 'ms to execute.');

      return this.imgOut;
   }
}

/* export { Rotator }; */