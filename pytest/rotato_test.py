import unittest
from rotato import rotate, app
from flask import request, jsonify

class TestRotate(unittest.TestCase):
    def test_output(self):
        
        with app.test_client() as client:
            #   Build test case input object - mimic structure of ImageData object.
            imgData = str([4] * 20)
            imgWidth = str(4)
            imgHeight = str(5)
            #   Send input test object to server.
            response = client.post('/', json={
                'data': imgData,
                'width': imgWidth,
                'height': imgHeight
            })
            responseJSON = response.get_json()

            #   Assess response.
            #   First check that something came back
            self.assertTrue(responseJSON)
            #   Then check length of returned JSON object and types of values.
            self.assertEqual(len(responseJSON[0]), 3)
            self.assertTrue(isinstance(response[0], list))
            self.assertTrue(isinstance(response[1], int))
            self.assertTrue(isinstance(response[2], int))

if __name__ == '__main__':
    unittest.main()