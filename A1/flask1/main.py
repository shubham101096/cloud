from flask import Flask, request
import os.path
import requests

app = Flask(__name__)


@app.route('/')
def hello_world():
    return 'Hello World!'


@app.route('/calculate', methods=['POST'])
def calculate():
    input_data = request.json
    if "file" in input_data and input_data["file"]:
        file = input_data["file"]
        product = input_data["product"]
        if os.path.isfile(file):
            response = requests.post("http://flask2:6003/calculate")
            print(response.json())
            return response.json()
        return {"file": file, "error": "File not found."}

    return {"file": None, "error": "Invalid JSON input."}


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=6000, debug=True)