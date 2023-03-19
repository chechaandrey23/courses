import React from 'react';
import {useSelector, useDispatch} from 'react-redux';
//import {Location} from "react-router-dom";
import {Grid, Box, Paper, Typography, CircularProgress,
        IconButton, Rating, Slider, Fab, Chip, TextField, Button, Alert, Skeleton} from '@mui/material';
import Hls from 'hls.js';
import PictureInPictureAltIcon from '@mui/icons-material/PictureInPictureAlt';

import {VideoStateInterface, setPIPCurrentVideo, setPIPParetnPage} from '../../redux/videos';

export interface HLSVideoPlayerPIPButtonProps {
  refVideo: any;
  refHLS: any;
  id: string;
}

export const HLSVideoPlayerPIPButton: React.FC<HLSVideoPlayerPIPButtonProps> = (props) => {
  const pipCurrentVideoId = useSelector((state: any) => state.videos.pipCurrentVideoId);
  const dispatch = useDispatch();

  return (<>
    <Fab  color="warning" size="large"
          disabled={!!pipCurrentVideoId}
          onClick={!pipCurrentVideoId?(e: any) => {
            (props.refHLS.current as Hls).stopLoad();
            const videoEl = props.refVideo.current as any;
            if(!videoEl.paused) videoEl.pause();
            dispatch(setPIPCurrentVideo(props.id));
            dispatch(setPIPParetnPage(location.href));
            console.log(location)
          }:undefined}>
      <PictureInPictureAltIcon color="inherit" sx={{width: 'var(--size-icon-video)', height: 'var(--size-icon-video)'}} />
    </Fab>
  </>);
}
