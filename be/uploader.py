import boto3
import os

bucketname = "cdn.babalaclips.com"
dirname = "videos"

if __name__ == '__main__':
    # s3 = boto3.client('s3')
    # objects = s3.list_objects(Bucket=bucketname)
    # print(objects)

    # for file in os.listdir(dirname):
    #     if file.endswith(".mp4"):            
    #         if file in objects:
    #             print(file + ' already exists in bucket')
    #             continue
    #         uploaded = upload_to_s3(s3, dirname + "/" + file, bucketname, dirname + '/' + file)
    #         if uploaded:
    #             print('Uploaded ' + file)
    #         else:
    #             print('Failed to upload ' + file)
    pass
        
        