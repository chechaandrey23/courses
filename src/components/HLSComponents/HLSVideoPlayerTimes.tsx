import React, {useRef} from 'react';
import {Grid, Box, Paper, Typography, CircularProgress,
        IconButton, Rating, Slider, Fab, Chip, TextField, Button, Alert, Skeleton} from '@mui/material';
import dateFormat, {masks} from "dateformat";

masks.hammerTime = 'HH:MM:ss';

export interface HLSVideoPlayerTimesProps {
  refVideo: any;
  currentTime: number;
  durationTime: number;
}

export const HLSVideoPlayerTimes: React.FC<HLSVideoPlayerTimesProps> = (props) => {

  return (<>
    <Box sx={{backgroundColor: 'warning.main', borderRadius: 5, p: 0.5, pr:1.5, pl: 1.5}}>
      <Typography variant="h6" sx={{
        fontWeight: 'bold',
        color: 'warning.contrastText',
        display: 'flex',
      }}>
        <Box sx={{pr: 0.25}}>
          {dateFormat(new Date(Math.round(props.currentTime) * 1000), 'hammerTime', true)}
        </Box>
        <Box>/</Box>
        <Box sx={{pl: 0.25}}>
          {dateFormat(new Date(Math.round(props.durationTime) * 1000), 'hammerTime', true)}
        </Box>
      </Typography>
    </Box>
  </>);
}
