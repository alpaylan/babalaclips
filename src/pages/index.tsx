import React, { useState, useEffect } from 'react';

import Grid from '@mui/material/Grid';
import { Button, Slider, Stack, Typography } from "@mui/material";

import Subtitle, { SubtitleData } from "@/components/Subtitle";
import YouTubeVideo from "@/components/YoutubeVideo";

//@ts-ignore
import { Player } from 'youtube-player';

import Cutter from '@/components/Cutter';

const data = require('@/data/subtitles.json');


const secondsToTime = (seconds: number) => {
  const date = new Date(0);
  date.setSeconds(seconds);
  return date.toISOString().substr(11, 8);
}


export default function Home() {
  const [player, setPlayer] = useState<Player | null>(null);
  const [timestamp, setTimestamp] = React.useState(0);
  const [cutterOpen, setCutterOpen] = React.useState(false);
  const [sliding, setSliding] = React.useState(false);
  const [sliderValue, setSliderValue] = React.useState(0);

  const handleCutterClose = () => {
    setCutterOpen(false);
  };

  const handleCutterOpen = () => {
    setCutterOpen(true);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setTimestamp(player?.getCurrentTime() || 0);
    }, 100);
    return () => clearInterval(interval);
  }, [player]);

  const setPlayerTime = (time: number) => {
    player?.seekTo(time);
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={4}>
        <Stack spacing={2}>
          <Typography variant="h4" component="h1" gutterBottom>
            Welcome to Babala Clips!
          </Typography>
          <YouTubeVideo onReady={setPlayer} />
          <Slider
            value={sliding ? sliderValue : timestamp}
            onChange={(e, value) => {
              setSliding(true);
              setSliderValue(value as number)
            }}
            onChangeCommitted={(e, value) => {
              setSliding(false);
              setPlayerTime(value as number);
            }}
            min={0}
            max={player?.getDuration() || 0}
            step={1}
            valueLabelDisplay="auto"
            valueLabelFormat={secondsToTime}

          />
          <Button variant="outlined" onClick={handleCutterOpen}>Videoyu Kes</Button>
        </Stack>
      </Grid>
      <Grid item xs={12} md={8}>
        <Subtitle setPlayerTime={setPlayerTime} currentTimestamp={
          sliding ? sliderValue : timestamp
          } data={data} />
      </Grid>
      <Cutter
        open={cutterOpen}
        handleClose={handleCutterClose}
        initialSubtitleId={0}
      />
    </Grid>
  );
}
