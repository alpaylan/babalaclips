import React, { useState, useEffect} from 'react';

import Grid from '@mui/material/Grid';
import { Button, Modal, Stack, Typography } from "@mui/material";

import Subtitle, { SubtitleData } from "@/components/Subtitle";
import YouTubeVideo from "@/components/YoutubeVideo";

//@ts-ignore
import { Player } from 'youtube-player';

import Cutter from '@/components/Cutter';

const data = require('@/data/subtitles.json');

export default function Home() {
  const [player, setPlayer] = useState<Player | null>(null);
  const [timestamp, setTimestamp] = React.useState(0);
  const [cutterOpen, setCutterOpen] = React.useState(false);

  const handleCutterClose = () => {
    setCutterOpen(false);
  };

  const handleCutterOpen = () => {
    setCutterOpen(true);
  };



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
          <Button variant="outlined" onClick={handleCutterOpen} sx={{ width: '25%' }}>Videoyu Kes</Button>
        </Stack>
      </Grid>
      <Grid item xs={12} md={6}>
        <Subtitle setPlayerTime={setPlayerTime} currentTimestamp={timestamp} data={data} />
      </Grid>
      <Modal 
        open={cutterOpen}
        onClose={handleCutterClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Cutter />
      </Modal>
    </Grid>
  );
}
