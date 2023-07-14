import hashlib
import json


def lambda_handler(event, context):
    input_data = event['input']
    value = input_data['value']
    print("value=", value)
    sha256_hash = hashlib.sha256(value.encode('utf-8')).hexdigest()
    print("sha256=", sha256_hash)

    input_data['value'] = sha256_hash

    output = {
        "banner": "B00917146",
        "result": sha256_hash,
        "arn": "arn:aws:lambda:us-east-1:205053501838:function:sha256Lambda",
        "action": "sha256",
        "value": value
    }

    return output
