import boto3
import grpc
import logging
from concurrent import futures
import computeandstorage_pb2
import computeandstorage_pb2_grpc

# Code References:
# https://grpc.io/docs/languages/python/basics/
# https://grpc.io/docs/languages/python/quickstart/
# https://boto3.amazonaws.com/v1/documentation/api/latest/guide/s3-uploading-files.html
# https://boto3.amazonaws.com/v1/documentation/api/latest/guide/s3-example-creating-buckets.html
# https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/s3/client/delete_object.html

access_key = 'ASIAS7PREEGHFJJIO75P'
secret_key = 'WMmXh8NFfrFrBnBEpH0/60EY8kEAixR1KINP4sHH'
session_token = 'FwoGZXIvYXdzEF4aDJP0NVLoRbqMSUOqrCLAARY2t4kZhg4rEYCj3wWDXNpKmq81hrKEV+NuiylFt2vGBkIIwq9yr9VLOqsKPJGiCd4W7Ij47zNai1GvRT893mqqdJTjWKkl1aTtoRZf761MLFm2U5ubGmw9z0VO2F5oiXjnrO+aggG/2Qd8hToQwHKTZANsrn50UKWRvRMEHUwAIFi3R4EbPGMuXAeAKBZqVfLW3fYAy+YXFfFNrvQBEiRmYuBj136eCowtc4Xy57bLpPqxoHgBm7eaIExHCDm8biiCkY6kBjItJ4/ibun5TDAgpCdDibBGpqijcsltLPUaTj/Y1OEI1Xs/lzrC2OfcWSk9r+F6'

# Create an s3 object using boto3
bucket_name = "shubham-mishra-grpc-bucket"
file_name = "message.txt"
s3 = boto3.client('s3', aws_access_key_id=access_key, aws_secret_access_key=secret_key, aws_session_token=session_token)
found = False

# Check if bucket_name exists, otherwise create a new bucket

for bucket in s3.list_buckets()["Buckets"]:
    if bucket_name == bucket["Name"]:
        found = True
        break
if not found:
    s3.create_bucket(Bucket=bucket_name)


# Class containing GRPC methods
class EC2OperationsServicer(computeandstorage_pb2_grpc.EC2OperationsServicer):
    def StoreData(self, request, context):
        # create a file in s3 bucket with the data sent in request
        msg = request.data
        with open(file_name, 'w') as file:
            file.write(msg)
        s3.upload_file(file_name, bucket_name, file_name)
        url = s3.generate_presigned_url(
            ClientMethod='get_object',
            Params={'Bucket': bucket_name, 'Key': file_name}
        )
        return computeandstorage_pb2.StoreReply(s3uri=url)

    def AppendData(self, request, context):
        # update the file in s3 bucket by appending new data
        append_msg = request.data
        s3object = s3.get_object(Bucket=bucket_name, Key=file_name)
        cur_msg = s3object['Body'].read().decode('utf-8')

        cur_msg += append_msg
        s3.put_object(Body=cur_msg.encode('utf-8'), Bucket=bucket_name, Key=file_name)
        return computeandstorage_pb2.AppendReply()

    def DeleteFile(self, request, context):
        # get the bucket_name and key from s3uri and delete the corresponding object
        s3uri = request.s3uri
        bucket_name_from_uri = s3uri.split(".s3.amazonaws.com")[0].split("https://")[1]
        object_key_from_uri = s3uri.split(".s3.amazonaws.com/")[1]
        key = object_key_from_uri.split("?")[0]

        s3.delete_object(Bucket=bucket_name_from_uri, Key=key)
        return computeandstorage_pb2.DeleteReply()

# start the grpc server
def serve():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    computeandstorage_pb2_grpc.add_EC2OperationsServicer_to_server(
        EC2OperationsServicer(), server)
    server.add_insecure_port('[::]:50051')
    server.start()
    server.wait_for_termination()


if __name__ == '__main__':
    logging.basicConfig()
    serve()
