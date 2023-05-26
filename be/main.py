
from flask import Flask, request, jsonify, Response
from flask_cors import CORS, cross_origin
import json
from merger import download, concat, upload
import os
import boto3
from pymongo import MongoClient


app = Flask(__name__)
CORS(app, origins="http://localhost:3000")
app.config['CORS_HEADERS'] = 'Content-Type'
myclient = MongoClient(os.environ["mongo_url"])
db = myclient["babalaclips"]
video_stats = db["video_stats"]

subtitles = json.load(open("subtitles.json"))

bucketname = "cdn.babalaclips.com"
dirname = "videos"
s3 = boto3.client('s3',
                  aws_access_key_id=os.environ["aws_access_key_id"],
                  aws_secret_access_key=os.environ["aws_secret_access_key"])

for subtitle in subtitles:
    del subtitle["text"]

def cut_video(start, end):
    print("Cutting video from {} to {}".format(start, end))

    video_stats.update_one(
        {"start": start, "end": end},
        {"$inc": {"count": 1}},
        upsert=True
    )

    if end < start or start < 0 or end > len(subtitles) - 1:
        return None

    subtitles_to_cut = subtitles[start:end+1]

    if subtitles_to_cut[-1]["endTime"] - subtitles_to_cut[0]["startTime"] > 180:
        return None
    
    objects = s3.list_objects(Bucket=bucketname)
    objects = list(map(lambda obj: obj["Key"], objects["Contents"]))
    if start == end:
        filename = f"videos/babalaclips_{start}.mp4"
    else:
        filename = f"videos/babalaclips_{start}_{end}.mp4"
    
    if filename not in objects:
        download(s3, bucketname, start, end)
        concat(start, end)
        upload(s3, filename, bucketname, filename)

    return f"https://cdn.babalaclips.com/{filename}"

@app.route("/cut", methods=["POST"])
@cross_origin()
def cut():
    data = request.get_json()
    if "start" not in data or "end" not in data:
        return jsonify({"error": "Missing data"}), 400

    start = data["start"]
    end = data["end"]

    video = cut_video(start, end)

    if video is None:
        return jsonify({"error": "Invalid start/end"}), 400
    
    return Response(
        video,
        status=200,
        mimetype="video/mp4"
    )


if __name__ == "__main__":
    app.run(debug=True)