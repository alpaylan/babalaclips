
# Babalaclips

Babalaclips is a website that aims to democratize the distribution of short
video clips with a simple user interface. Currently, it is instantiated for
[Mevzular Açık Mikrofon 15. Bölüm I Cumhurbaşkanı Adayı Kemal Kılıçdaroğlu](https://www.youtube.com/watch?v=EWUEOnTvJjM).
This is a 4-hour interview with one of the two presidential candidates of
the Turkish Presidential Elections.

The system works as follows:

- Create a transcription of the video.
- For each subtitle/transcription unit, create a separate video frame.
- Store all frames on an S3 bucket.
- On the website, when a user asks for a segment, merge the frames for that segment.
- Cache created segments by uploading them to S3 and doing a simple storage check.

Currently, the UI allows for a set of simple actions:

- Watch the video with flowing transcription on the side.
- Use the slider to move along the video and the transcript as needed.
- Search for specific keywords or sentences.
- Cut segments based on a simple slide/extend/shorten scheme.

## Notes

- The video is downloaded using yt-dlp. youtube-dl was too slow, and the resulting encoding was corrupted.
- Storage costs on S3 are unknown for now. I'm continuously monitoring the system to see the system cost.
- The app is deployed on Vercel for serving the front end, fly.io for the backend, and MongoDB Atlas for the database, all free tier.