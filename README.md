# JavaScript Image Rotation

Implementation the project detailed in 'Rotation Task.pdf'. Brief is to write an algorithm in JavaScript that takes an ImageData object as an input and outputs the image rotated by a given angle about the centre point of the image.

## Algorithm

Algorithm uses inverse mapping as discussed [here](https://pythontic.com/image-processing/pillow/rotate) and [here](https://blogs.mathworks.com/steve/2006/05/05/spatial-transformations-inverse-mapping/) - iteration is over the pixels of the output image and source pixel from input image is found. The algorithm uses a series of matrix multiplications to transform output pixel to input pixel. Due to the offset of the centre of the image from the pixel coordinate frame origin three transformations are performed:

1. a translation of the centre of the image to the origin
2. a rotation about the origin by the given angle
3. a translation of the centre of the image back from the origin

## Development
The codebase was developed in Visual Studio Code using the Live Server Extension to serve associated files ('/accenture/index.html' served on default port 5500). The algorithm was developed using a HTML page (included in repo) for input/output. This was viewed/processed in Firefox. The algorithm itself does not require a browser and can be exported for use in Node.js. Unit testing is performed by Jest. This requires that the algorithm can in fact be executed outside a browser.

## Status
It has it's flaws. Don't we all? This is temporary.
