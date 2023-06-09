import boto3
import grpc
import logging
from concurrent import futures
import computeandstorage_pb2
import computeandstorage_pb2_grpc
import requests

access_key = 'ASIAS7PREEGHP5RMYE6H'
secret_key = 'VRmp12euqsLOwObGtYAXOc4ALgxmdJUBgTeuObRp'
session_token = 'FwoGZXIvYXdzEFkaDObLj9Y18YlCp7B0QiLAAZcbmt5GCl+9sS9DOqdktYxH3vFwnI9yGGnbdhOKewbi4JwfvPYoe1IlgZMCc7m7tCLpynY+M8MR8LfQsbFjuA97WcGLGhchWqLZvOXmwabklx1fu9imhEDLiiNWneytcAcBZv9TiC3aZ347OXlLazOgd3V4y0W+oE1ZlVlkTXyUG+QZ4YKrvs05+HPYsJK1UZ6SJhG7xW3r0W6z8dxvdG+soIJPuSmgVjxbasLzD+HOI6bmC1MaHNd5ZaUP8DzK/Sihlo2kBjItpwoKht4frpSl90+tkrBkka9fTDR+VXuspPsOi/l8zIHWEnYK84ew2JRYCCiS'
region_name = 'us-east-1'

bucket_name = "shubham-mishra-grpc-bucket"
file_name = "message.txt"
s3 = boto3.client('s3', aws_access_key_id=access_key, aws_secret_access_key=secret_key, aws_session_token=session_token, region_name=region_name)
found = False

print("---------", s3.list_buckets())

# for bucket in s3.list_buckets()["Buckets"]:
#     if bucket_name == bucket["Name"]:
#         found = True
#         break
# if not found:
#     s3.create_bucket(Bucket=bucket_name, CreateBucketConfiguration={'LocationConstraint': region_name})


class EC2OperationsServicer(computeandstorage_pb2_grpc.EC2OperationsServicer):
    def StoreData(self, request, context):
        print("---hi-----")
        msg = request.data
        with open(file_name, 'w') as file:
            file.write(msg)
        s3.upload_file(file_name, bucket_name, file_name)
        url = s3.generate_presigned_url(
            ClientMethod='get_object',
            Params={'Bucket': bucket_name, 'Key': file_name}
        )
        print(url)
        return computeandstorage_pb2.StoreReply(s3uri=url)

    def AppendData(self, request, context):
        print("AppendData===start")
        append_msg = request.data
        s3object = s3.get_object(Bucket=bucket_name, Key=file_name)
        cur_msg = s3object['Body'].read().decode('utf-8')

        cur_msg += append_msg
        s3.put_object(Body=cur_msg.encode('utf-8'), Bucket=bucket_name, Key=file_name)
        print("AppendData===end")
        return computeandstorage_pb2.AppendReply()

    def DeleteFile(self, request, context):
        s3uri = request.s3uri
        print("s3uri----", s3uri)
        bucket_name_from_uri = s3uri.split(".s3.amazonaws.com")[0].split("https://")[1]
        object_key_from_uri = s3uri.split(".s3.amazonaws.com/")[1]
        key = object_key_from_uri.split("?")[0]

        print("bucket---", bucket_name_from_uri)
        print("object---", object_key_from_uri)
        s3.delete_object(Bucket=bucket_name_from_uri, Key=key)
        return computeandstorage_pb2.DeleteReply()


def serve():
    print("12u2820----------")
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    computeandstorage_pb2_grpc.add_EC2OperationsServicer_to_server(
        EC2OperationsServicer(), server)
    server.add_insecure_port('[::]:50051')
    server.start()
    # url = 'http://54.173.209.76:9000/start'
    # payload = {
    #     "banner": "B00917146",
    #     "ip": "52.55.64.133:50051"
    # }
    # print("12u2820----dhddhhdhhdhd------")
    # response = requests.post(url, json=payload)
    # print(response)
    server.wait_for_termination()

if __name__ == '__main__':
    logging.basicConfig()
    serve()
