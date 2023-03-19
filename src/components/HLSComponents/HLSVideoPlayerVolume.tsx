import React, {useRef, useEffect, useState} from 'react';
import {Grid, Box, Paper, Typography, CircularProgress,
        IconButton, Rating, Slider, Fab, Chip, TextField, Button, Alert, Skeleton} from '@mui/material';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeDownIcon from '@mui/icons-material/VolumeDown';
import {debounce, throttle} from 'throttle-debounce';

export interface HLSVideoPlayerVolumeProps {
  refVideo: any;
  volume: number;
  plusSlider?: boolean;
}

export const HLSVideoPlayerVolume: React.FC<HLSVideoPlayerVolumeProps> = (props) => {
  const refPrevVolume = useRef(props.volume);
  const [changeMode, setChangeMode] = useState(false);

  const refVolumeSlider = useRef(null);

  useEffect(() => {
    if(props.volume !== undefined && props.plusSlider) {
      const el = refVolumeSlider.current as any;
      el.value = props.volume;
      if(!changeMode) {
        const elTrack = el.getElementsByClassName('MuiSlider-track')[0];
        elTrack.style.width = (props.volume * 100)+'%';
        const elThumb = el.getElementsByClassName('MuiSlider-thumb')[0];
        elThumb.style.left = (props.volume * 100)+'%';
      }
    }
  }, [changeMode, props.volume]);

  const slider = (props.plusSlider?<Slider
    value={undefined/*props.volume===undefined?1:props.volume*/}
    ref={refVolumeSlider}
    sx={{
      width: 'var(--width-volume-slider)',
      height: 'var(--height-volume-slider)',
      color: 'warning.main',
      '& .MuiSlider-thumb': {
        width: 'var(--size-thumb-volume-slider)',
        height: 'var(--size-thumb-volume-slider)'
      }
    }}
    step={0.01} min={0} max={1}
    onChangeCommitted={(e: any) => {
      setChangeMode(false);
    }}
    onChange={debounce(100, (e: any) => {
      const value = e.target.value * 1;
      if(isNaN(value)) return;
      (props.refVideo.current as any).volume = value;
      setChangeMode(true);
    })} />:null);

  return (<>
    <Grid container>
      <Grid item sx={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <Fab color="warning" size="large" onClick={(e: any) => {
          const videoEl = props.refVideo.current as any;
          const beginVolume = videoEl.volume;

          if(props.volume as number > 0) {// mute
            videoEl.volume = 0;
          } else {// unmute
            videoEl.volume = refPrevVolume.current || 1;
          }

          if(videoEl.volume > 0) videoEl.muted = false;

          refPrevVolume.current = beginVolume;
        }}>
          {props.volume as number>0
            ?(props.volume as number>0.5
              ?<VolumeUpIcon color="inherit" sx={{width: 'var(--size-icon-video)', height: 'var(--size-icon-video)'}} />
              :<VolumeDownIcon color="inherit" sx={{width: 'var(--size-icon-video)', height: 'var(--size-icon-video)'}} />
            )
            :<VolumeOffIcon color="inherit" sx={{width: 'var(--size-icon-video)', height: 'var(--size-icon-video)'}} />}
        </Fab>
      </Grid>
      {props.plusSlider?<Grid item sx={{pl: 4, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        {slider}
      </Grid>:null}
    </Grid>
  </>);
}
