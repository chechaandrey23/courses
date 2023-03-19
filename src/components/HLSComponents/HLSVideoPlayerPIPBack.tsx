import React from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {useNavigate, useParams, NavLink, useLocation} from "react-router-dom";
import {Grid, Box, Paper, Typography, CircularProgress,
        IconButton, Rating, Slider, Fab, Chip, TextField, Button, Alert, Skeleton} from '@mui/material';
import Hls from 'hls.js';
import {redirect} from "react-router-dom";
import ReplyAllIcon from '@mui/icons-material/ReplyAll';

import {VideoStateInterface, setPIPCurrentVideo} from '../../redux/videos';

export interface HLSVideoPlayerPIPBackProps {
  refVideo: any;
  refHLS: any;
}

export const HLSVideoPlayerPIPBack: React.FC<HLSVideoPlayerPIPBackProps> = (props) => {
  const dispatch = useDispatch();
  //const {search, state} = useLocation();

  const pipCurrentVideoId = useSelector((state: any) => state.videos.pipCurrentVideoId);
  const pipParentPage = useSelector((state: any) => state.videos.pipParentPage);

  return (<>
    <Fab  color="warning" size="large"
          onClick={pipCurrentVideoId?(e: any) => {
            (props.refHLS.current as Hls).stopLoad();
            const videoEl = props.refVideo.current as any;
            if(!videoEl.paused) videoEl.pause();
            dispatch(setPIPCurrentVideo(null));
            // bad way!!!
            if(location.href != pipParentPage) location.href = pipParentPage;
          }:undefined}>
      <ReplyAllIcon color="inherit" sx={{width: 'var(--size-icon-video)', height: 'var(--size-icon-video)'}} />
    </Fab>
  </>);
}
