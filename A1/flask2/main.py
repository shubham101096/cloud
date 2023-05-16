from flask import Flask, request
import os.path
import pandas as pd

app = Flask(__name__)


@app.route('/')
def hello_world():
    return 'Hello World!'


@app.route('/calculate', methods=['POST'])
def calculate_sum():
    return {"yo":"hu"}
    input_data = request.json
    if "file" in input_data and input_data["file"] is not None:
        file = input_data["file"]
        product = input_data["product"]
        # file = "docker_csv_data.dat"
        # product = "wheat"
        if os.path.isfile(file):
            try:
                df = pd.read_csv(file)
            except:
                return {"file": file, "error": "Input file not in CSV format."}

            df_grouped_by_prod = df.groupby("product", as_index=False).sum()
            required_product = df_grouped_by_prod.loc[df_grouped_by_prod["product"] == product]
            if len(required_product.index) == 0:
                val = 0
            else:
                val = required_product.iloc[0]["amount"]
            return {"file": file, "sum": int(val)}
        return {"file": file, "error": "File not found."}

    return {"file": None, "error": "Invalid JSON input."}


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=6003, debug=True)