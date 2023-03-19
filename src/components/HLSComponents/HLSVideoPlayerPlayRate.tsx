import React, {useRef, useEffect, useState} from 'react';
import {Grid, Box, Paper, Typography, CircularProgress, Tooltip,
        IconButton, Rating, Slider, Fab, Chip, TextField, Button, Alert, Skeleton} from '@mui/material';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';

export interface HLSVideoPlayerPlayRateProps {
  refVideo: any;
  playRate: number;
}

const PLUS = 1;
const MINUS = -1;

export const HLSVideoPlayerPlayRate: React.FC<HLSVideoPlayerPlayRateProps> = (props) => {
  const [command, setCommand] = useState<any>(null);

  useEffect(() => {
    if(command) {
      if(command.current === PLUS) handlePlus(null);
      if(command.current === MINUS) handleMinus(null);
    }
  }, [command]);

  function handleKeyDown(e: any) {
    if(e.ctrlKey) {
      e.preventDefault();
      e.stopPropagation();
      if (e.code === "Minus") {
        setCommand({current: MINUS});
      }
      if (e.code === "Equal") {
        setCommand({current: PLUS});
      }
    }
  }

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    }
  }, []);

  function handleMinus(e: any) {
    if(props.playRate <= 0) return;
    (props.refVideo.current as any).playbackRate = props.playRate-0.25;
  }

  function handlePlus(e: any) {
    if(props.playRate >= 10) return;
    (props.refVideo.current as any).playbackRate = props.playRate+0.25;
  }

  return (<>
    <Grid container>
      <Grid item>
        <Tooltip title={
          <Typography variant="h6" sx={{ml: 1, mr: 1, fontWeight: 'bold', color: 'warning.contrastText'}}>
            - 0.25X
          </Typography>
        } arrow={true} placement="top">
          <Button size="small" color="warning" variant="contained" sx={{borderRadius: 2}}
                  disabled={props.playRate <= 0}
                  onClick={handleMinus}>
            <RemoveIcon color="inherit" sx={{width: 'var(--size-icon-video1)', height: 'var(--size-icon-video1)'}} />
          </Button>
        </Tooltip>
      </Grid>
      <Grid item sx={{pr: 1, pl: 1}}>
        <Box sx={{
          height: '100%', width: 'var(--video-playrate-width)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          backgroundColor: 'warning.main', borderRadius: 2, pr: 0.5, pl: 0.5
        }}>
          <Typography variant="h6" sx={{fontWeight: 'bold', color: 'warning.contrastText'}}>
            {props.playRate}X
          </Typography>
        </Box>
      </Grid>
      <Grid item>
        <Tooltip title={
          <Typography variant="h6" sx={{ml: 1, mr: 1, fontWeight: 'bold', color: 'warning.contrastText'}}>
            + 0.25X
          </Typography>
        } arrow={true} placement="top">
          <Button size="small" color="warning" variant="contained" sx={{borderRadius: 2}}
                  disabled={props.playRate >= 10}
                  onClick={handlePlus}>

            <AddIcon color="inherit" sx={{width: 'var(--size-icon-video1)', height: 'var(--size-icon-video1)'}} />
          </Button>
        </Tooltip>
      </Grid>
    </Grid>
  </>);
}
