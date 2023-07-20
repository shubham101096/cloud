import requests
import hashlib
import json


def lambda_handler(event, context):
    value = event['value']
    print("value=", value)
    md5_hash = hashlib.md5(value.encode('utf-8')).hexdigest()
    print("md5=", md5_hash)
    course_uri = event['course_uri']

    output = {
        "banner": "B00917146",
        "result": md5_hash,
        "arn": "arn:aws:lambda:us-east-1:205053501838:function:md5Lambda",
        "action": "md5",
        "value": value
    }

    response = requests.post(course_uri, data=output)

    if response.status_code == 200:
        print("POST request sent successfully")
    else:
        print("Failed to send POST request:", response.text)

    return output
