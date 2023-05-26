import React, { useState, useEffect } from 'react';

import { Box, Slider, Typography } from "@mui/material";

import Subtitle from "@/components/Subtitle";
import YouTubeVideo from "@/components/YoutubeVideo";

//@ts-ignore
import { Player } from 'youtube-player';

const data = require('@/data/subtitles.json');


const secondsToTime = (seconds: number) => {
  const date = new Date(0);
  date.setSeconds(seconds);
  return date.toISOString().substr(11, 8);
}


export default function Home() {
  const [player, setPlayer] = useState<Player | null>(null);
  const [timestamp, setTimestamp] = React.useState(0);
  const [sliding, setSliding] = React.useState(false);
  const [sliderValue, setSliderValue] = React.useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimestamp(player?.getCurrentTime() || 0);
    }, 1000);
    return () => clearInterval(interval);
  }, [player]);

  const setPlayerTime = (time: number) => {
    player?.seekTo(time);
  };

  return (
    <>
      <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, justifyContent: "space-between", m: 1, gap: 2 }}>
        <Box sx={{ width: { xs: "100%", md: "30%" } }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Welcome to Babala Clips!
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
            <YouTubeVideo onReady={setPlayer} />
          </Box>
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", mt: 4 }}>
            <Slider
              value={sliding ? sliderValue : timestamp}
              onChange={(_, value) => {
                setSliding(true);
                setSliderValue(value as number)
              }}
              onChangeCommitted={(_, value) => {
                setSliding(false);
                setPlayerTime(value as number);
              }}
              min={0}
              max={player?.getDuration() || 0}
              step={1}
              valueLabelDisplay="auto"
              valueLabelFormat={secondsToTime}
              sx={{ width: "90%" }}
            />
          </Box>
        </Box>
        <Box sx={{ width: { xs: "100%", md: "70%" } }}>
          <Subtitle
            setPlayerTime={setPlayerTime}
            currentTimestamp={sliding ? sliderValue : timestamp}
            data={data}
          />
        </Box>
      </Box>
    </>
  );
}
