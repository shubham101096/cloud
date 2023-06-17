from flask import Flask, request
import os.path
import requests

app = Flask(__name__)

# demo 1

@app.route('/calculate', methods=['POST'])
def calculate():
    input_data = request.json

    target_url = f"http://container2-service:80/calculate"

    if "file" in input_data and "product" in input_data and input_data["file"] is not None and input_data["product"] is not None:
        file = input_data["file"]
        if os.path.isfile("../../../shubham_PV_dir/"+file):
            response = requests.post(target_url, json=input_data)
            return response.json()
        return {"file": file, "error": "File not found."}, 404

    return {"file": None, "error": "Invalid JSON input."}, 404


@app.route('/store-file', methods=['POST'])
def store_file():
    input_data = request.json
    if "file" in input_data and "data" in input_data and input_data["file"] is not None and input_data["data"] is not None:
        file_name = input_data['file']
        file_data = input_data['data']

        try:
            with open('../../../shubham_PV_dir/' + file_name, 'w') as file:
                file.write(file_data)

            return {'file': file_name, 'message': 'Success.'}, 200
        except Exception as e:
            return {'file': file_name, 'message': 'Error while storing the file to the storage.'}, 404
    return {'file': None, 'error': 'Invalid JSON input.'}, 404

# test1

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=6000, debug=True)