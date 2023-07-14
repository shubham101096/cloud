import requests
import hashlib
import json


def lambda_handler(event, context):
    value = event['value']
    print("value=", value)
    sha256_hash = hashlib.sha256(value.encode('utf-8')).hexdigest()
    print("sha256=", sha256_hash)

    output = {
        "banner": "B00917146",
        "result": sha256_hash,
        "arn": "arn:aws:lambda:us-east-1:205053501838:function:sha256Lambda",
        "action": "sha256",
        "value": value
    }

    # output_json = json.dumps(output)

    # endpoint_url = "/end"

    # response = requests.post(endpoint_url, data=output_json)

    # if response.status_code == 200:
    #     print("POST request sent successfully")
    # else:
    #     print("Failed to send POST request:", response.text)

    return output
