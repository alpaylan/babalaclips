import React, { useState, FC } from 'react';

import YouTube from 'react-youtube';
import { Options, Player, PlayerEvent } from 'youtube-player';

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
        videoId="EWUEOnTvJjM"
        opts={opts}
        onReady={onReadyHandler}
        onStateChange={onStateChangeHandler}
      />
    );
  }

  export default YouTubeVideo;