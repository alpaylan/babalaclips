import React, { useState, useEffect} from 'react';

import Grid from '@mui/material/Grid';
import { Stack, Typography } from "@mui/material";

import Subtitle, { SubtitleData } from "@/components/Subtitle";
import YouTubeVideo from "@/components/YoutubeVideo";

import { Player } from 'youtube-player';

const data = require('@/data/first2hours.json');

export default function Home() {
  const [player, setPlayer] = useState<Player | null>(null);
  const [timestamp, setTimestamp] = React.useState(0);

  console.log("data", data);

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
      <Grid item xs={12} md={6}>
        <Stack spacing={2}>
          <Typography variant="h4" component="h1" gutterBottom>
            Welcome to Babala Clips!
          </Typography>
          <YouTubeVideo onReady={setPlayer} />
          <p>Current Time: {timestamp.toFixed(2)} seconds</p>
        </Stack>
      </Grid>
      <Grid item xs={12} md={6}>
        <Subtitle setPlayerTime={setPlayerTime} currentTimestamp={timestamp} data={data} />
      </Grid>
    </Grid>
  );
}
