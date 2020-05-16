import unittest
from rotato import rotatePy, app, resize
from flask import request, jsonify

class TestRotate(unittest.TestCase):

    def setup(self):
        app.config["TESTING"] = True
        app.config["DEBUG"] = True
        self.app = app.test_client()
        self.assertEqual(app.debug, False)

    def tear_down(self):
        pass
    
    def test_rotpy(self):
        #   Test rotatePy().
        
        with app.test_client() as client:
            #   Build test case input object - mimic structure of ImageData object.
            angle = 1.05    #   Radians.
            imgData = str([0] * 250 * 650 * 4)
            imgWidth = str(250)
            imgHeight = str(650)
            #   Send input test object to server.
            response = client.post('http://127.0.0.1:5000/rotpy', json={
                'theta': angle,
                'image': {
                    'data': imgData,
                    'width': imgWidth,
                    'height': imgHeight
                }
            })

            response_json = response.get_json()

            #   Assess response.
            #   First check that something came back.
            with self.subTest():
                self.assertTrue(response_json)
            #   Then check number of fields and type of each.
            with self.subTest():
                self.assertEqual(len(response_json.keys()), 2)
            with self.subTest():
                self.assertTrue(isinstance(response_json['time_elapsed'], int))
            with self.subTest():
                self.assertTrue(isinstance(response_json['image']['data'], list))
            with self.subTest():
                self.assertTrue(isinstance(response_json['image']['width'], int))
            with self.subTest():
                self.assertTrue(isinstance(response_json['image']['height'], int))

    def test_rotscipy(self):
        #   Test rotateSciPy().
        
        with app.test_client() as client:
            #   Build test case input object - mimic structure of ImageData object.
            angle = 1.05    #   Radians.
            imgData = str([0] * 250 * 650 * 4)
            imgWidth = str(250)
            imgHeight = str(650)
            #   Send input test object to server.
            response = client.post('http://127.0.0.1:5000/rotscipy', json={
                'theta': angle,
                'image': {
                    'data': imgData,
                    'width': imgWidth,
                    'height': imgHeight
                }
            })

            response_json = response.get_json()

            #   Assess response.
            #   First check that something came back.
            with self.subTest():
                self.assertTrue(response_json)
            #   Then check number of fields and type of each.
            with self.subTest():
                self.assertEqual(len(response_json.keys()), 2)
            with self.subTest():
                self.assertTrue(isinstance(response_json['time_elapsed'], int))
            with self.subTest():
                self.assertTrue(isinstance(response_json['image']['data'], list))
            with self.subTest():
                self.assertTrue(isinstance(response_json['image']['width'], int))
            with self.subTest():
                self.assertTrue(isinstance(response_json['image']['height'], int))
    
    def test_resize(self):
        #   Test resize().

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