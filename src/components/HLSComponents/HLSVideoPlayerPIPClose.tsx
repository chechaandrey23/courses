import React from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {Grid, Box, Paper, Typography, CircularProgress,
        IconButton, Rating, Slider, Fab, Chip, TextField, Button, Alert, Skeleton} from '@mui/material';
import Hls from 'hls.js';
import CloseIcon from '@mui/icons-material/Close';

import {VideoStateInterface, setPIPCurrentVideo} from '../../redux/videos';

export interface HLSVideoPlayerPIPCloseProps {
  refVideo: any;
  refHLS: any;
}

export const HLSVideoPlayerPIPClose: React.FC<HLSVideoPlayerPIPCloseProps> = (props) => {
  const pipCurrentVideoId = useSelector((state: any) => state.videos.pipCurrentVideoId);
  const dispatch = useDispatch();

  return (<>
    <Fab  color="warning" size="large"
          onClick={pipCurrentVideoId?(e: any) => {
            dispatch(setPIPCurrentVideo(null));
            (props.refHLS.current as Hls).stopLoad();
            const videoEl = props.refVideo.current as any;
            if(!videoEl.paused) videoEl.pause();
          }:undefined}>
      <CloseIcon color="inherit" sx={{width: 'var(--size-icon-video)', height: 'var(--size-icon-video)'}} />
    </Fab>
  </>);
}
