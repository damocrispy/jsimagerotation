import unittest
from rotato import rotate, app, resize
from flask import request, jsonify

class TestRotate(unittest.TestCase):
    
    def test_output(self):
        
        with app.test_client() as client:
            #   Build test case input object - mimic structure of ImageData object.
            angle = 1.05    #   Radians.
            imgData = str([0] * 250 * 650 * 4)
            imgWidth = str(250)
            imgHeight = str(650)
            #   Send input test object to server.
            response = client.post('/', json={
                'theta': angle,
                'image': {
                    'data': imgData,
                    'width': imgWidth,
                    'height': imgHeight
                }
            })

            response_json = response.get_json()

            #   Assess response.
            #   First check that something came back
            if self.assertTrue(response_json):
                #   Then check length of returned JSON object and types of values.
                self.assertEqual(len(response_json.keys()), 3)
                self.assertTrue(isinstance(response_json['data'], list))
                self.assertTrue(isinstance(response_json['width'], int))
                self.assertTrue(isinstance(response_json['height'], int))
    
    def test_resize(self):
        new_size = resize({
                'theta': 1.05,
                'image': {
                    'width': 250,
                    'height': 650
                }
            })
        self.assertEqual(new_size, [688, 540])

if __name__ == '__main__':
    unittest.main()