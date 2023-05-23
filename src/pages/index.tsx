import React, { useState, useEffect, FC } from 'react';

import Grid from '@mui/material/Grid';
import { Stack, Typography } from "@mui/material";
import Subtitle from "../components/Subtitle";

import YouTube, { Options, Player, PlayerEvent } from 'react-youtube';

const YouTubeVideo: FC<{ onReady: (player: Player) => void }> = ({ onReady }) => {
  const [player, setPlayer] = useState<Player | null>(null);
  const [timestamp, setTimestamp] = React.useState(0);

  const opts: Options = {
    height: '390',
    width: '640',
    playerVars: {
      autoplay: 1,
    },
  };

  const onReadyHandler = (event: PlayerEvent) => {
    setPlayer(event.target);
    onReady(event.target);
  };

  const onStateChangeHandler = (event: PlayerEvent) => {
    if (event.data === 0) {
      setTimestamp(timestamp);
      player?.seekTo(timestamp);
    }
  };

  return (
    <YouTube
      videoId="Q8rjsfTxbdI"
      opts={opts}
      onReady={onReadyHandler}
      onStateChange={onStateChangeHandler}
    />
  );
}




export default function Home() {
  const [player, setPlayer] = useState<Player | null>(null);
  const [timestamp, setTimestamp] = React.useState(0);

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
        <Subtitle setPlayerTime={setPlayerTime} currentTimestamp={timestamp} />
      </Grid>
    </Grid>
  );
}
