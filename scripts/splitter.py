
import json
import os

subtitles = json.load(open('subtitles.json'))

for index, subtitle in enumerate(subtitles):
    if os.path.exists(f"videos/babalaclips_{index}.mp4"):
        continue
    start = subtitle['startTime']
    duration = subtitle['endTime'] - subtitle['startTime']
    filename = f"videos/babalaclips_{index}"
    cmd = f"ffmpeg -ss {start} -t {duration} -i \"Mevzular Açık Mikrofon 15. Bölüm I Cumhurbaşkanı Adayı Kemal Kılıçdaroğlu [EWUEOnTvJjM].mp4\" -c copy {filename}.mp4"

    os.system(cmd)