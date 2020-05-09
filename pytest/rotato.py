from flask import Flask, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/', methods=['POST', 'GET'])
def getInput():
    if request.method == 'POST':
        imgIn = request.get_json()
        
        imgOut = rotate(imgIn)

        #return 'Tell yo brotha, ya sista and yo mama too...', 200
        return imgOut

    else:
        return '...it\'s about to go down and you know just what to do.', 200

def rotate(imgIn):
    print(str(imgIn['theta']))

    return imgIn

if __name__ == '__main__':
    app.run()