import React from 'react';
import {Grid, Box, Paper, Typography, CircularProgress,
        IconButton, Rating, Slider, Fab, Chip, TextField, Button, Alert, Skeleton} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';

export interface HLSVideoPlayerPlayProps {
  refVideo: any;
  waiting: boolean;
  playing: boolean;
}

export const HLSVideoPlayerPlay: React.FC<HLSVideoPlayerPlayProps> = (props) => {
  return (<>
    <Fab  color="warning" size="large"
          onClick={!props.waiting?(() => {
            if(props.playing) {
              (props.refVideo.current as any).pause();
            } else {
              (props.refVideo.current as any).play();
            }
          }):undefined}>
      {!props.waiting
        ?(!props.playing
          ?<PlayArrowIcon color="inherit" sx={{width: 'var(--size-icon-video)', height: 'var(--size-icon-video)'}} />
          :<PauseIcon color="inherit" sx={{width: 'var(--size-icon-video)', height: 'var(--size-icon-video)'}} />)
        :<CircularProgress color="inherit" sx={{width: 'var(--size-icon-video)', height: 'var(--size-icon-video)'}} />}
    </Fab>
  </>);
}
