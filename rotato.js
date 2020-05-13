class Rotator {
   constructor (imgIn) {
      this.imgIn = imgIn;
      this.imgOut;
   }

   rotatePy = function (theta) {
      // This function needs to return a promise so that the code that runs it will wait for it to complete.
      return new Promise((resolve, reject) => {

         // Convert from Uint8ClampedArray to regular array.
         let imgData = Array.from(this.imgIn.data);

         // POST the input ImageData object to Flask as a JSON frame that includes the rotation angle.
         fetch('http://127.0.0.1:5000/', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
               theta: theta,
               image: {
                  data: imgData,
                  width: this.imgIn.width,
                  height: this.imgIn.height
               }
            })
         })
         // Parse response as JSON.
         .then(response => {
            return response.json();
         })
         // Give us a look at the lovely JSON.
         .then(json => {
            var timeElapsed = json['time_elapsed'];

            var imgData = Uint8ClampedArray.from(json['image']['data']);
            var imgWidth = json['image']['width'];
            var imgHeight = json['image']['height'];
            var imgOut = new ImageData(imgData, imgWidth, imgHeight);

            // Test to see if function has run successfully and return promise based on that.
            if (imgOut.constructor.name == 'ImageData') {
               resolve([imgOut, timeElapsed]);
            }
            else {
               reject(new Error('Something went arseways there.'));
            }
            //return [imgOut, timeElapsed];
         });
      });
   }

   resize = function (width, height, angle) {
      // Find minimum enclosing dimensions of rotated rectangle.
      let newWidth = Math.abs(height*Math.sin(angle)) + Math.abs(width*Math.cos(angle));
      let newHeight = Math.abs(width*Math.sin(angle)) + Math.abs(height*Math.cos(angle));
      
      // Round to nearest integer. This function calculates pixel coordinates.
      newWidth = Math.round(newWidth);
      newHeight = Math.round(newHeight);
      
      return [newWidth, newHeight];
   }
}

/* 
Attempt to export the class 'Rotator'.
This will only be possible if running in NodeJS, e.g. in testing.
If run in browser, this will not export but the script being
included in index.html will allow it to be included anyway.
 */
try {
   console.log('Exporting...');
   module.exports = Rotator;
   console.log('Exported.');
}
catch(e) {
   console.log('Failed to export. You running this in-browser? That\'s yer problem there.');
}