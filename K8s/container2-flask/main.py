from flask import Flask, request
import os.path
import pandas as pd
import csv

app = Flask(__name__)

# demo1

@app.route('/calculate', methods=['POST'])
def calculate():
    input_data = request.json
    if "file" in input_data and "product" in input_data and input_data["file"] is not None and input_data[
        "product"] is not None:
        file = input_data["file"]
        product = input_data["product"]
        # file_path = "abc.txt"
        file_path = "../../../shubham_PV_dir/"+file
        if os.path.isfile(file_path):
            try:
                df = pd.read_csv(file_path)
                df.columns = df.columns.str.strip()
                for e in df.columns:
                    print(e)
                if 'product' not in df.columns or 'amount' not in df.columns:
                    return {"file": file, "error": "Input file not in CSV format."}
            except:
                return {"file": file, "error": "Input file not in CSV format."}

            df_grouped_by_prod = df.groupby("product", as_index=False).sum()
            required_product = df_grouped_by_prod.loc[df_grouped_by_prod["product"] == product]
            if len(required_product.index) == 0:
                val = str(0)
            else:
                val = required_product.iloc[0]["amount"]
            return {"file": file, "sum": str(val)}
        return {"file": file, "error": "File not found."}, 404

    return {"file": None, "error": "Invalid JSON input."}, 404

# test1

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=6003, debug=True)
