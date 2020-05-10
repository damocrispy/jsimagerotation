from flask import Flask, request
from flask_cors import CORS
import numpy as np

app = Flask(__name__)
CORS(app)

@app.route('/', methods=['POST', 'GET'])
def getInput():
    if request.method == 'POST':
        img_in = request.get_json()
        
        img_out = rotate(img_in)

        return img_out, 200

    else:
        return 'Shoulda sent a GET.', 200

def rotate(img_in):
   
   # Find dimensions of output image.
   new_dims = resize(img_in)

   #  Pull values from received img_in JSON object which contains angle and the JS ImageData object.
   #  Assign them more readable variable names.
   theta = img_in['theta']
   data_in = img_in['image']['data']
   width_in = img_in['image']['width']
   height_in = img_in['image']['height']

   # Create empty list representing data of ImageData output object.
   data_out = [] * (new_dims[0] * new_dims[1] * 4)

   # Coordinates of centre of image.
   cntr_x = new_dims[0] / 2
   cntr_y = new_dims[1] / 2

   # Form transformation matrices.
   # 1. Translate pixel (vector) so that rotation is about origin.
   trans_to_origin = [[1, 0, -cntr_x],
      [0, 1, -cntr_y],
      [0, 0, 1]]

   # 2. Rotate pixel about origin.
   rot_mat = [[np.cos(theta), np.sin(theta), 0],
      [-np.sin(theta), np.cos(theta), 0],
      [0, 0, 1]]

   # 3. Reverse original translation.
   trans_from_origin = [[1, 0, width_in / 2],
      [0, 1, height_in / 2],
      [0, 0, 1]]

   # 4. Multiply the above transformations to find combined transformation matrix.
   trans_rot = np.matmul(rot_mat, trans_to_origin)
   trans_mat = np.matmul(trans_from_origin, trans_rot)

   # For each pixel in output image, find corresponding pixel in input and copy pixel value.
   for y in range(new_dims[1]):
      for x in range(new_dims[0]):

         # Coordinates of a pixel in the output image.
         pxl_out = [[x], [y], [1]]
         # Coordinates after transformation.
         pxl_in = np.matmul(trans_mat, pxl_out)

         # Round to nearest pixel. This is the source of the current pixel.
         pxl_in[0] = np.around(pxl_in[0])
         pxl_in[1] = np.around(pxl_in[1])

         # Assign values from source pixel to current output pixel.
         for i in range(4):
            
            # If calculated source pixels fall outside source image, set values to 0.
            if (pxl_in[0] >= 0 and pxl_in[0] < width_in and pxl_in[1] >= 0 and pxl_in[1] < height_in):
               data_out[((y * new_dims[0]) + x) * 4 + i] = data_in[((pxl_in[1] * width_in) + pxl_in[0]) * 4 + i]
            else:
               data_out[((y * new_dims[0]) + x) * 4 + i] = 0
                                          
   # Initialise output ImageData object with reconstructed data and correct dimensions.
   img_out = {
      'data': data_out,
      'width': new_dims[0],
      'height': new_dims[1]
   }
   
   return img_out

def resize(img_data):
   
    # Find minimum enclosing dimensions of rotated rectangle.
    newWidth = np.absolute(img_data['image']['height'] * np.sin(img_data['image']['theta'])) + np.absolute(img_data['image']['width'] * np.cos(img_data['image']['theta']))
    newHeight = np.absolute(img_data['image']['width'] * np.sin(img_data['image']['theta'])) + np.absolute(img_data['image']['height'] * np.cos(img_data['image']['theta']))
    
    # Round to nearest integer. This function calculates pixel coordinates.
    newWidth = np.around(newWidth)
    newHeight = np.around(newHeight)
    
    return [newWidth, newHeight]

if __name__ == '__main__':
    app.run()