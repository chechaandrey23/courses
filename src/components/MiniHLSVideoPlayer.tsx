import {useEffect, useRef, useState, useContext, useMemo} from 'react';
import Hls from 'hls.js';
import {debounce, throttle} from 'throttle-debounce';
import {Grid, Box, Paper, Typography, Card, CardActions, CardActionArea, CardContent,
        CardHeader, CardMedia, LinearProgress, CircularProgress,
        IconButton, Rating, Slider, Fab, Chip, TextField, Button, Alert, Skeleton} from '@mui/material';

import {HLSVideoPlayerVolume} from './HLSComponents/HLSVideoPlayerVolume';
import {HLSVideoPlayerProgress} from './HLSComponents/HLSVideoPlayerProgress';
import {HLSVideoPlayerStatus} from './HLSComponents/HLSVideoPlayerStatus';

import {createHLS, destroyHLS, HLSConfig} from '../commons/hls.core';

export interface MiniHLSVideoPlayerProps {
  src: string;
  stats?: MiniHLSVideoPlayerStatsInterface
}

export interface MiniHLSVideoPlayerStatsInterface {
  playing?: boolean;
  volume?: number;
  progress?: number;
}

export const MiniHLSVideoPlayer: React.FC<MiniHLSVideoPlayerProps> = (props) => {
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0);
  const refPrevVolume = useRef(1);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [bufferProgress, setBufferProgress] = useState(0);
  const [waiting, setWaiting] = useState(true);
  const [ended, setEnded] = useState(false);

  const refVideo = useRef(null);

  const refHLS = useRef<Hls|null>(null);

  const srcVideo = props.src;
  const videoStats = {
    src: srcVideo,
    duration: duration,
    progress: /*props.stats?.progress!==undefined?props.stats?.progress:*/progress,
  }
  /*
  useEffect(() => {
    if(props.stats?.playing && (refVideo.current as any).paused) {
      (refVideo.current as any).play();
    }
    if(!props.stats?.playing) {
      (refVideo.current as any).pause();
    }
  }, [props.stats?.playing]);
  */

  /*
  if(refVideo.current) {
    if(playing && (refVideo.current as any).paused) {
      (refVideo.current as any).play();
    }
    if(!playing) {
      (refVideo.current as any).pause();
    }
  }
  */
  useEffect(() => {
    if(refVideo.current && videoStats && srcVideo) {
        createHLS({refHLS, refVideo, videoStats});
        return () => {
          destroyHLS({refHLS, refVideo, videoStats});
        }
    }
  }, [refVideo, srcVideo]);

  function handleProgress(e: any) {
    if(isNaN(e.target.duration)) return;
    setProgress((e.target.currentTime / e.target.duration));
    setDuration(e.target.duration);
  }

  function handleBufferProgress(e: any) {
    if(isNaN(e.target.duration)) return;
    const bufferInfo = (refHLS.current as any).mainForwardBufferInfo;
    setBufferProgress(bufferInfo.end / e.target.duration);
  }

  function handleLoadedMetaData(e: any) {
    if(isNaN(e.target.duration)) return;
    setProgress((e.target.currentTime / e.target.duration));
    setDuration(e.target.duration);
  }

  function handleStartLoad(e: any) {
    setWaiting(true);
    setEnded(false);
  }

  function handleWaiting(e: any) {
    setWaiting(true);
    setEnded(false);
  }

  function handleEnded(e: any) {
    setEnded(true);
  }

  function handleCanPlay(e: any) {
    setWaiting(true);
    setEnded(false);
    if(playing) {
      const videoEl = refVideo.current as any;
      videoEl.play().catch((e: any) => {
        console.error(e);
        //setPlaying(false);
      });
    }
    (refVideo.current as any).volume = volume;
  }

  function handleCanPlayThrough(e: any) {
    setWaiting(false);
    setEnded(false);
  }

  function handlePlaying(e: any) {
    setPlaying(true);
    setEnded(false);
  }

  function handlePause(e: any) {
    setPlaying(false);
  }

  function handleVolumeChange(e: any) {
    setVolume(e.target.volume);
  }

  return (<>
    <Box  sx={{position: 'relative', width: 'inherit'}}>
      <Box sx={{width: 'inherit', boxSizing: 'border-box', display: 'flex', alignItems: 'center'}}>
        <video  width={'100%'}
                ref={refVideo}
                muted={true}
                onEnded={handleEnded}
                onPlaying={handlePlaying}
                onPause={handlePause}
                onVolumeChange={handleVolumeChange}
                onLoadedMetadata={handleLoadedMetaData}
                onCanPlay={handleCanPlay}
                onCanPlayThrough={handleCanPlayThrough}
                onWaiting={handleWaiting}
                onLoadStart={handleStartLoad}
                onTimeUpdate={throttle(350, handleProgress)}
                onProgress={throttle(350, handleBufferProgress)}>
        </video>
      </Box>
      <Box sx={{position: 'absolute',
                zIndex: 210,
                left: '1%',
                bottom: '2%',
                width: '100%'}}>
        <HLSVideoPlayerProgress refVideo={refVideo}
                                progress={progress}
                                bufferProgress={bufferProgress}
                                refHLS={refHLS}/>
      </Box>
      <Box sx={{position: 'absolute',
                zIndex: 210,
                right: '2%',
                top: '3%'}}>
        <HLSVideoPlayerVolume refVideo={refVideo}
                              plusSlider={false}
                              volume={volume} />
      </Box>
      <Box sx={{position: 'absolute',
                zIndex: 210,
                left: 'calc(50% - (var(--hls-video-player-status-width) / 2))',
                bottom: 'calc(50% - (var(--hls-video-player-status-height) / 2))'}}>
        <HLSVideoPlayerStatus refVideo={refVideo}
                              waiting={waiting}
                              ended={ended}
                              enableHover={true}
                              refHLS={refHLS}
                              playing={playing} />
      </Box>
    </Box>
  </>);
}
