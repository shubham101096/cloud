from flask import Flask, request
import os.path
import requests

app = Flask(__name__)


@app.route('/calculate', methods=['POST'])
def calculate():
    input_data = request.json
    if "file" in input_data and "product" in input_data and input_data["file"] is not None and input_data["product"] is not None:
        file = input_data["file"]
        if os.path.isfile("host_vol/"+file):
            response = requests.post("http://flask2:6003/calculate", json=input_data)
            return response.json()
        return {"file": file, "error": "File not found."}, 404

    return {"file": None, "error": "Invalid JSON input."}, 404


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=6000, debug=True)