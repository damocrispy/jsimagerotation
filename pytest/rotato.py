from flask import Flask, request
from flask_cors import CORS
import numpy as np
from scipy import ndimage
import time

#  It's a Flask!
app = Flask(__name__)
CORS(app)

@app.route('/rotpy', methods=['POST', 'GET'])
def rotatePy():
   #  Basic rotation algorithm.

   #  Convert request body to JSON.
   img_in = request.get_json()

   start = int(time.time() * 1000)

   #  Find dimensions of output image.
   new_dims = resize(img_in)

   #  Pull values from received img_in JSON object which contains angle and the JS ImageData object.
   #  Assign them more readable variable names.
   theta = img_in['theta']
   data_in = img_in['image']['data']
   width_in = int(img_in['image']['width'])
   height_in = int(img_in['image']['height'])

   #  Create empty list representing data of ImageData output object.
   data_out = [0] * (new_dims[0] * new_dims[1] * 4)

   #  Coordinates of centre of image.
   cntr_x = new_dims[0] / 2
   cntr_y = new_dims[1] / 2

   #  Form transformation matrices.
   #  1. Translate pixel (vector) so that rotation is about origin.
   trans_to_origin = [[1, 0, -cntr_x],
      [0, 1, -cntr_y],
      [0, 0, 1]]

   #  2. Rotate pixel about origin.
   rot_mat = [[np.cos(theta), np.sin(theta), 0],
      [-np.sin(theta), np.cos(theta), 0],
      [0, 0, 1]]

   #  3. Reverse original translation.
   trans_from_origin = [[1, 0, width_in / 2],
      [0, 1, height_in / 2],
      [0, 0, 1]]

   #  4. Multiply the above transformations to find combined transformation matrix.
   trans_rot = np.matmul(rot_mat, trans_to_origin)
   trans_mat = np.matmul(trans_from_origin, trans_rot)
   
   #  For each pixel in output image, find corresponding pixel in input and copy pixel value.
   for y in range(new_dims[1]):
      for x in range(new_dims[0]):

         #  Coordinates of a pixel in the output image.
         pxl_out = [[x], [y], [1]]
         #Coordinates after transformation.
         pxl_in = np.matmul(trans_mat, pxl_out)

         #  Round to nearest pixel. This is the source of the current pixel. Convert to integer type.
         pxl_in = pxl_in.round(0).astype(int)

         #  Assign values from source pixel to current output pixel.
         for i in range(4):
            #  Check that calculated source pixel falls inside source image.
            if (pxl_in[0,0] >= 0 and pxl_in[0,0] < width_in and pxl_in[1,0] >= 0 and pxl_in[1,0] < height_in):
               data_out[((y * new_dims[0]) + x) * 4 + i] = data_in[((pxl_in[1,0] * width_in) + pxl_in[0,0]) * 4 + i]
            #  Otherwise set pixel value to 0.
            else:
               data_out[((y * new_dims[0]) + x) * 4 + i] = 0
   
   #  Package the bones of an ImageData JS object into a JSON field along with the local time to execute..
   img_out = {
      'time_elapsed': int(time.time() * 1000) - start,
      'image': {
         'data': data_out,
         'width': new_dims[0],
         'height': new_dims[1]
      }      
   }

   return img_out, 200


@app.route('/rotscipy', methods=['POST', 'GET'])
def rotateSciPy():

   #  Convert request body to JSON.
   img_in = request.get_json()
   
   start = int(time.time() * 1000)

   #  Pull values from received img_in JSON object which contains angle and the JS ImageData object.
   #  Assign them more readable variable names.
   theta = img_in['theta']
   data_in = img_in['image']['data']
   width_in = int(img_in['image']['width'])
   height_in = int(img_in['image']['height'])
   
   #  Convert 1D array to a 3D array using given height and width of input image
   #  and four layers of pixel bytes (RGBA). This conversion is required by ndimage.rotate().
   data_in_3D = np.reshape(data_in, (height_in, width_in, 4), order='C')
   #  Rotate 3D array.
   data_out_3D = ndimage.rotate(np.array(data_in_3D), theta)
   new_dims = np.shape(data_out_3D)
   #  Convert 3D array back to a 1D array for JSONisation.
   data_out = np.reshape(data_out_3D, (new_dims[0] * new_dims[1] * new_dims[2]))

   #  Package the bones of an ImageData JS object into a JSON field along with the local time to execute..
   img_out = {
      'time_elapsed': (int(time.time() * 1000) - start),
      'image': {
         'data': data_out.tolist(), #  Convert from ndarray to list
         'width': new_dims[1],
         'height': new_dims[0]
      }      
   }

   return img_out, 200

def resize(img_data):

   #  Rename variables.
   img_theta = float(img_data['theta'])
   img_height = int(img_data['image']['height'])
   img_width = int(img_data['image']['width'])

   #  Find minimum enclosing dimensions of rotated rectangle.
   newWidth = np.absolute(img_height * np.sin(img_theta)) + np.absolute(img_width * np.cos(img_theta))
   newHeight = np.absolute(img_width * np.sin(img_theta)) + np.absolute(img_height * np.cos(img_theta))
   
   #  Round to nearest integer. This function calculates pixel coordinates. Convert to integer type.
   newWidth = int(np.around(newWidth))
   newHeight = int(np.around(newHeight))
   
   return [newWidth, newHeight]

if __name__ == '__main__':
   app.run()