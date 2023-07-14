import hashlib
import json


def lambda_handler(event, context):
    input_data = event['input']
    value = input_data['value']
    print("value=", value)
    md5_hash = hashlib.md5(value.encode('utf-8')).hexdigest()
    print("md5=", md5_hash)

    input_data['value'] = md5_hash

    output = {
        "banner": "B00917146",
        "result": md5_hash,
        "arn": "arn:aws:lambda:us-east-1:205053501838:function:md5Lambda",
        "action": "md5",
        "value": value
    }

    return output
