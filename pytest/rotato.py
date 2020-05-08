from flask import Flask, request
app = Flask(__name__)

@app.route('/', methods=['POST', 'GET'])
def rotate():
    if request.method == 'POST':
        print('Received object ' + str(len(request.form)) + ' fields long.')
        return 'Tell yo brotha, ya sista and yo mama too...', 200
    else:
        return 'Didn\'t get a POST.', 200

if __name__ == '__main__':
    app.run()