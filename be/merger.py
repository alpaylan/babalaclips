
import os
import tempfile
import boto3

def concat(start, end):
    concatfile = tempfile.NamedTemporaryFile(delete=True, dir=".", suffix=".txt")
    contents = "\n".join([f"file 'videos/babalaclips_{id}.mp4'" for id in range(start, end + 1)])
    concatfile.write(contents.encode())
    concatfile.flush()

    os.system(f"ffmpeg -f concat -safe 0 -i {concatfile.name} -c copy videos/babalaclips_{start}_{end}.mp4")
    concatfile.close()
    
def download(s3, bucketname, start, end):
    for id in range(start, end + 1):
        s3.download_file(bucketname, f"videos/babalaclips_{id}.mp4", f"videos/babalaclips_{id}.mp4")

def upload(s3, local_file, bucket, s3_file):
    try:
        s3.upload_file(local_file, bucket, s3_file)
        print("Upload Successful")
        return True
    except FileNotFoundError:
        print("The file was not found")
        return False