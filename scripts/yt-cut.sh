#!/bin/bash

usage () {
	echo "Usage: $0  "
	echo "    [--url <url>]"
	echo "    [--start <start_time>]"
	echo "    [--duration <duration>]"
	echo "    [--out-file <output_file> ]"
	exit 1
}

FORMAT="mp4"

while [ $# -gt 0 ]; do
  case "$1" in
	--url)
	  URL="$2"
	  shift 2
	  ;;
	--start)
	  START_TIME="$2"
	  shift 2
	  ;;
	--duration)
	  DURATION="$2"
	  shift 2
	  ;;
	--out-file)
	  OUTPUT_FILE="$2"
	  shift 2
	  ;;
    --format)
      FORMAT="$2"
      shift 2
      ;;
	*)
	  usage
	  ;;
  esac
done  

errfile=$(mktemp)
trap "/bin/rm -f ${errfile}" EXIT

response_json () {
  local userMessage=${5:-$4}
  echo { $(jq -aR . <<< "httpStatus") : $1, \
    $(jq -aR . <<< "errorCode") : $(jq -aR . <<< $2), \
    $(jq -aR . <<< "domain") : $(jq -aR . <<< $3), \
    $(jq -aR . <<< "devMessage") : $(jq -aR . <<< $4), \
    $(jq -aR . <<< "userMessage") : $(jq -aR . <<< ${userMessage}), \
    $(jq -aR . <<< "time") : $(date +%s000)}
}

set -o pipefail # pipe returns fail code if any segment fails

declare -a vars=("URL" "START_TIME" "DURATION" "OUTPUT_FILE" "FORMAT")

for var in "${vars[@]}"; do
  if [ -z "${!var}" ]; then
    echo "ERROR: $var not set." 
    exit 1
  fi  
done

download_video () {
  youtube-dl --format $FORMAT --restrict-filenames --write-auto-sub --sub-lang tr --convert-subs srt -o '%(title)s.%(ext)s' $URL | tee -a ${errfile}
}


cut_video () {
  VIDEO_FILE=$(youtube-dl --restrict-filenames --get-filename -o "%(title)s.${FORMAT}" $URL | tee -a ${errfile})
  if [ ! -f "$VIDEO_FILE" ]; then
    download_video
  fi
  ffmpeg -ss "$START_TIME" -t "$DURATION" -i "$VIDEO_FILE" -c copy "$OUTPUT_FILE" | tee -a ${errfile}
}

cut_video

if [[ $? -ne 0 ]]; then
  errmsg=$(< ${errfile})
  response_json 550 1 $(basename "$0") "${errmsg}" "Script could not run properly"
  exit 1
fi
