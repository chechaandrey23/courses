import React, {useState, useEffect, useLayoutEffect, useRef} from 'react';
import Hls from 'hls.js';
import {Grid, Box, Paper, Typography, CircularProgress,
        IconButton, Rating, Slider, Fab, Chip, TextField, Button, Alert, Skeleton} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import ReplayIcon from '@mui/icons-material/Replay';

export interface HLSVideoPlayerStatusProps {
  refVideo: any;
  refHLS: any;
  waiting: boolean;
  playing: boolean;
  ended?: boolean;
  enableHover?: boolean;
}

const MODE_WAIT = 'wait';
const MODE_PLAY = 'play';
const MODE_PAUSE = 'pause';
const MODE_END = 'end';
const CMD_PLAY_PAUSE = 'play/pause';
const CMD_PLAY = 'play';
const CMD_PAUSE = 'pause';

export const HLSVideoPlayerStatus: React.FC<HLSVideoPlayerStatusProps> = (props) => {
  const [mode, setMode] = useState<any>(MODE_WAIT);
  const [command, setCommand] = useState<any>(null);

  useEffect(() => {
    if(props.ended) {
      setMode(MODE_END);
      return;
    }
    setMode(props.waiting?MODE_WAIT:(props.playing?MODE_PLAY:MODE_PAUSE));
  }, [props.playing, props.waiting, props.ended]);

  const width = 'var(--hls-video-player-status-width)';
  const height = 'var(--hls-video-player-status-height)';
  const iconWidth = 'var(--hls-video-player-status-width-icon)';
  const iconHeight = 'var(--hls-video-player-status-height-icon)';

  useLayoutEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    }
  }, []);

  useLayoutEffect(() => {
    const videoEl = props.refVideo.current;
    videoEl.addEventListener("click", handleClick);
    return () => {
      videoEl.removeEventListener("click", handleClick);
    }
  }, []);

  useLayoutEffect(() => {
    if(props.enableHover) {
      const videoEl = props.refVideo.current;
      const hoverEl = videoEl.parentNode.parentNode;
      hoverEl.addEventListener("mouseenter", handleMouseEnter);
      hoverEl.addEventListener("mouseleave", handleMouseLeave);
      return () => {
        hoverEl.removeEventListener("mouseenter", handleMouseEnter);
        hoverEl.removeEventListener("mouseleave", handleMouseLeave);
      }
    }
  }, [props.enableHover]);

  function handleKeyDown(e: any) {
    if(e.ctrlKey) {
      e.preventDefault();
      e.stopPropagation();
      if(e.code === 'Space') {
        setCommand({current: CMD_PLAY_PAUSE});
      }
    }
  }

  function handleClick(e: any) {
    e.preventDefault();
    e.stopPropagation();
    setCommand({current: CMD_PLAY_PAUSE});
  }

  function handleMouseLeave(e: any) {
    e.preventDefault();
    //e.stopPropagation();
    setCommand({current: CMD_PAUSE});
  }

  function handleMouseEnter(e: any) {
    e.preventDefault();
    //e.stopPropagation();
    setCommand({current: CMD_PLAY});
  }

  useEffect(() => {
    if(command) {
      if(command.current === CMD_PLAY_PAUSE) {
        if(mode == MODE_PLAY) (props.refVideo.current as any).pause();
        if(mode == MODE_PAUSE) (props.refVideo.current as any).play();
      } else if(command.current === CMD_PLAY && mode != MODE_END) {
        (props.refVideo.current as any).play();
      } else if(command.current === CMD_PAUSE) {
        (props.refVideo.current as any).pause();
      }
    }
  }, [command]);

  return (<>
    <Box>
      <Box sx={{display: mode==MODE_PLAY?'flex':'none'}} className="status-play">

      </Box>
      <Box sx={{display: mode==MODE_END?'flex':'none'}} className="status-play">
      <Fab  color="warning" size="large"
            sx={{width: width, height: height}}
            onClick={() => {
              const videoEl = props.refVideo.current as any;
              const hls = props.refHLS.current as Hls;
              const timePosition = 0;
              hls.stopLoad();
              videoEl.pause();
              hls.startLoad(timePosition);
              videoEl.currentTime = timePosition;
              videoEl.play();
            }}>
        <ReplayIcon color="inherit" sx={{width: iconWidth, height: iconHeight}} />
      </Fab>
      </Box>
      <Box sx={{display: mode==MODE_PAUSE?'flex':'none'}} className="status-pause">
        <Fab  color="warning" size="large"
              sx={{width: width, height: height}}
              onClick={() => {
                (props.refVideo.current as any).play();
              }}>
          <PlayArrowIcon color="inherit" sx={{width: iconWidth, height: iconHeight}} />
        </Fab>
      </Box>
      <Box sx={{display: mode==MODE_WAIT?'flex':'none'}} className="status-wait">
        <Fab  color="warning" size="large"
              sx={{width: width, height: height}}>
          <CircularProgress color="inherit" size={iconWidth}
                            sx={{width: iconWidth, height: iconHeight}} />
        </Fab>
      </Box>
    </Box>
  </>);
}
