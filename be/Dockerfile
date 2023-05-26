FROM python:3.9-bullseye

WORKDIR /app


COPY requirements.txt requirements.txt
RUN pip3 install -r requirements.txt

RUN apt-get update && apt-get install -y ffmpeg libavcodec-extra libssl-dev libasound2

RUN pip install gunicorn

COPY videos videos
COPY . .

CMD /bin/sh -c "gunicorn --bind 0.0.0.0:5000 wsgi:app"