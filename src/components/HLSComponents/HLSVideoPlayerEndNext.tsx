import React from 'react';
import {Grid, Box, Paper, Typography, CircularProgress,
        IconButton, Rating, Slider, Fab, Chip, TextField, Button, Alert, Skeleton} from '@mui/material';
import {useNavigate, useParams, NavLink, useLocation} from "react-router-dom";
import SkipNextIcon from '@mui/icons-material/SkipNext';

export interface HLSVideoPlayerEndNextProps {
  link: string;
}

export const HLSVideoPlayerEndNext: React.FC<HLSVideoPlayerEndNextProps> = (props) => {
  const navigate = useNavigate();

  const iconWidth = 'var(--hls-video-player-status-width-icon)';
  const iconHeight = 'var(--hls-video-player-status-height-icon)';

  return (<>
    <Button variant="contained"
            color="warning"
            sx={{borderRadius: 3}}
            onClick={(e: any) => {
              navigate(props.link);
            }}>
      <SkipNextIcon color="inherit" sx={{width: iconWidth, height: iconHeight}} />
    </Button>
  </>);
}
