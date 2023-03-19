import {useEffect, useRef, useState, useContext, useMemo} from 'react';
import * as ReactDOM from 'react-dom';
import Hls from 'hls.js';
import {debounce, throttle} from 'throttle-debounce';
import {useSelector, useDispatch} from 'react-redux';
import {Grid, Box, Paper, Typography, Card, CardActions, CardActionArea, CardContent,
        CardHeader, CardMedia, LinearProgress, CircularProgress,
        IconButton, Rating, Slider, Fab, Chip, TextField, Button, Alert, Skeleton} from '@mui/material';
import Tooltip, {tooltipClasses} from '@mui/material/Tooltip';
import {styled} from '@mui/material/styles';
import {useFirst} from '../hooks/useFirst.js';
import FitScreenIcon from '@mui/icons-material/FitScreen';

import {setPIPCurrentVideo, setNewHLS} from '../redux/videos';

import {sagaAddWithReplaceVideo, sagaUpdateVideo} from '../redux/saga/videos';

import {createHLS, destroyHLS, HLSConfig} from '../commons/hls.core';

import {HLSVideoPlayerPlay} from './HLSComponents/HLSVideoPlayerPlay';
import {HLSVideoPlayerVolume} from './HLSComponents/HLSVideoPlayerVolume';
import {HLSVideoPlayerTimes} from './HLSComponents/HLSVideoPlayerTimes';
import {HLSVideoPlayerProgress} from './HLSComponents/HLSVideoPlayerProgress';
import {HLSVideoPlayerPlayRate} from './HLSComponents/HLSVideoPlayerPlayRate';
import {HLSVideoPlayerPIPButton} from './HLSComponents/HLSVideoPlayerPIPButton';
import {HLSVideoPlayerPIPClose} from './HLSComponents/HLSVideoPlayerPIPClose';
import {HLSVideoPlayerPIPBack} from './HLSComponents/HLSVideoPlayerPIPBack';
import {HLSVideoPlayerStatus} from './HLSComponents/HLSVideoPlayerStatus';
import {HLSVideoPlayerEndPrev} from './HLSComponents/HLSVideoPlayerEndPrev';
import {HLSVideoPlayerEndNext} from './HLSComponents/HLSVideoPlayerEndNext';

interface HLSVideoPlayerEntry {
  id: string;
  src?: string;
  playing?: boolean;
  volume?: number;
  progress?: number;
  playRate?: number;
  //duration?: number;
  data?: any;
}

interface HLSVideoPlayerProps {
  id: string;
  pipMode?: boolean;
  nextLink?: string;
  prevLink?: string;
  title?: string;
  title2?:string;
  entry: HLSVideoPlayerEntry;
}

export const HLSVideoPlayer: React.FC<HLSVideoPlayerProps> = (props) => {
  const dispatch = useDispatch();

  //const [isPlaying, setIsPlaying] = useState(props.entry.playing);//store
  //const [volume, setVolume] = useState(props.entry.volume);// store
  //const refPrevVolume = useRef(props.entry.volume);
  const [times, setTimes] = useState({currentTime: 0, durationTime: 0});
  //const [progress, setProgress] = useState(0);// store
  const [bufferProgress, setBufferProgress] = useState(0);

  const [waiting, setWaiting] = useState(true);
  //const [playRate, setPlayRate] = useState(1);// store
  const [ended, setEnded] = useState(false);

  const refVideo = useRef(null);

  const refHLS = useRef<Hls|null>(null);

  const pipCurrentVideoId = useSelector((state: any) => state.videos.pipCurrentVideoId);
  const videosStats = useSelector((state: any) => state.videos.videos);
  const newHLS = useSelector((state: any) => state.videos.newHLS);

  const videoId = (props.pipMode && pipCurrentVideoId)?pipCurrentVideoId:props.id;
  const entryData = props.entry;
  const videoStats = videosStats[videoId];

  // fix bugs!!!
  const memoNewHLS = props.pipMode?useMemo(() => (newHLS), []):newHLS;

  useEffect(() => {
    dispatch(sagaAddWithReplaceVideo({
      id: videoId,
      entry: entryData,
    }));
  }, [videoId]);

  useEffect(() => {
    if(pipCurrentVideoId === videoId && !props.pipMode) {
      console.log('VIDEO DUBLICAT. HLS OBJECT NOT CREATED!!!');
      return;
    }
    if(refVideo.current && videoStats && newHLS) {
        createHLS({refHLS, refVideo, videoStats});
        return () => {
          destroyHLS({refHLS, refVideo, videoStats});
        }
    }
  }, [refVideo, memoNewHLS, pipCurrentVideoId]);

  //refVideo && playing

  function handleProgress(e: any) {
    if(isNaN(e.target.duration)) return;
    //setProgress((e.target.currentTime / e.target.duration));
    setTimes({
      currentTime: e.target.currentTime,
      durationTime: e.target.duration
    });
    dispatch(sagaUpdateVideo({
      id: videoStats.id,
      entry: {
        duration: e.target.duration,
        progress: e.target.currentTime / e.target.duration
      }
    }));
  }

  function handleBufferProgress(e: any) {
    if(isNaN(e.target.duration)) return;
    const bufferInfo = (refHLS.current as any).mainForwardBufferInfo;
    setBufferProgress(bufferInfo.end / e.target.duration);
  }

  function handleLoadedMetaData(e: any) {
    if(isNaN(e.target.duration)) return;
    //setProgress((e.target.currentTime / e.target.duration));
    setTimes({
      currentTime: e.target.currentTime,
      durationTime: e.target.duration
    });
    // update duration
    dispatch(sagaUpdateVideo({
      id: videoStats.id,
      entry: {
        duration: e.target.duration,
        progress: e.target.currentTime / e.target.duration,
      }
    }));
  }

  function handleStartLoad(e: any) {
    setWaiting(true);
    setEnded(false);
  }

  function handleWaiting(e: any) {
    setWaiting(true);
    setEnded(false);
  }

  function handleCanPlay(e: any) {
    setWaiting(true);
    setEnded(false);
    if(videoStats.playing) {
      const videoEl = refVideo.current as any;
      videoEl.play().catch((e: any) => {
        console.error(e);
        dispatch(sagaUpdateVideo({
          id: videoStats.id,
          entry: {playing: false}
        }));
      });
    }
    (refVideo.current as any).volume = videoStats.volume;
  }

  function handleCanPlayThrough(e: any) {
    setWaiting(false);
    setEnded(false);
    //if(videoStats?.playing) (refVideo.current as any).play();
  }

  function handleEnded(e: any) {
    setEnded(true);
  }

  function handlePlaying(e: any) {
    setEnded(false);
    dispatch(sagaUpdateVideo({
      id: videoStats.id,
      entry: {playing: true}
    }));
  }

  function handlePause(e: any) {
    //setIsPlaying(false);
    dispatch(sagaUpdateVideo({
      id: videoStats.id,
      entry: {playing: false}
    }));
  }

  function handleVolumeChange(e: any) {
    //setVolume(e.target.volume);
    dispatch(sagaUpdateVideo({
      id: videoStats.id,
      entry: {volume: e.target.volume}
    }));
  }

  function handleRatechange(e: any) {
    //setPlayRate(e.target.playbackRate);
    dispatch(sagaUpdateVideo({
      id: videoStats.id,
      entry: {playRate: e.target.playbackRate}
    }));
  }


  if(Hls.isSupported()) {
  } else {
    return (<>video not supported!!!</>)
  }

  if(!props.pipMode && pipCurrentVideoId === videoId) {
    return (<>
      <Box  sx={{
        position: 'relative', minWidth: '330px', width: '100%', minHeight: 'inherit',
        display: 'flex', alignItems: 'center', backgroundColor: 'text.primary',
        [`& .hls-video-player-item`]: {
          display: 'none'
        },
        '&:hover .hls-video-player-item': {
          display: 'block',
        },
      }}>
        <Box sx={{
          width: '100%', minHeight: 'inherit', position: 'relative',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <Box>
            <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <Button variant="contained"
                      color="warning"
                      sx={{borderRadius: 3}}
                      onClick={(e: any) => {
                        dispatch(setPIPCurrentVideo(null));
                      }}>
                <FitScreenIcon color="inherit" sx={{
                  width: 'var(--hls-video-player-status-width-icon)',
                  height: 'var(--hls-video-player-status-height-icon)'
                }} />
              </Button>
            </Box>
            <Typography variant="h4" sx={{fontWeight: 'bold', color: 'primary.contrastText'}}>
              The video of the current lesson is played in PiP mode
            </Typography>
          </Box>
        </Box>
        {props.title?<Box className="hls-video-player-item" sx={{position: 'absolute',
                  zIndex: 210,
                  top: '13%',
                  left: '3%'}}>
          <Box>
            <Typography variant="h5" sx={{fontWeight: 'bold', color: 'warning.main'}}>
              {props.title}
            </Typography>
          </Box>
        </Box>:null}
        {props.title2?<Box className="hls-video-player-item" sx={{position: 'absolute',
                  zIndex: 210,
                  top: '3%',
                  left: '3%'}}>
          <Box>
            <Typography variant="h5" sx={{fontWeight: 'bold', color: 'warning.main'}}>
              {props.title2}
            </Typography>
          </Box>
        </Box>:null}
      </Box>
    </>);
  }

  let player: any;

  if(!props.pipMode) {
    player = (<>
      <Box  sx={{
        position: 'relative', minWidth: '330px', width: '100%', minHeight: 'inherit',
        display: 'flex', alignItems: 'center', backgroundColor: 'text.primary',
        [`& .hls-video-player-item, & .hls-video-player-times,
         & .hls-video-player-playrate, & .hls-video-player-progress`]: {
          display: 'none'
        },
        '&:hover .hls-video-player-item': {
          display: 'block',
        },
        '&:hover .hls-video-player-times': {
          display: {xs: 'none', sm: 'none', md: 'flex'},
        },
        '&:hover .hls-video-player-playrate, &:hover .hls-video-player-progress': {
          display: {xs: 'none', sm: 'block'},
        }
      }}>
        <Box sx={{width: '100%', boxSizing: 'border-box', display: 'flex', alignItems: 'center'}}>
          <video  width={'100%'}
                  ref={refVideo}
                  onEnded={handleEnded}
                  onRateChange={handleRatechange}
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
        <Box className="hls-video-player-item" sx={{position: 'absolute',
                  zIndex: 210,
                  left: '1%',
                  bottom: 'var(--video-controls-1-bottom)'}}>
          <HLSVideoPlayerPlay refVideo={refVideo}
                              waiting={waiting}
                              playing={videoStats?.playing as boolean} />
        </Box>
        <Box className="hls-video-player-item" sx={{position: 'absolute',
                  zIndex: 210,
                  left: 'var(--video-volume-left)',
                  bottom: 'var(--video-controls-1-bottom)'}}>
          <HLSVideoPlayerVolume refVideo={refVideo}
                                plusSlider={true}
                                volume={videoStats?.volume as number} />
        </Box>
        <Box className="hls-video-player-times" sx={{position: 'absolute',
                  zIndex: 210,
                  display: {xs: 'none', sm: 'none', md: 'flex'},
                  left: '33.5%',
                  bottom: 'var(--video-controls-2-bottom)'}}>
          <HLSVideoPlayerTimes  refVideo={refVideo}
                                durationTime={times.durationTime}
                                currentTime={times.currentTime} />

        </Box>
        <Box className="hls-video-player-progress" sx={{position: 'absolute',
                  zIndex: 210,
                  left: '1%',
                  display: {xs: 'none', sm: 'flex'},
                  bottom: 'var(--video-progressbar-bottom)',
                  width: '100%'}}>
          <HLSVideoPlayerProgress refVideo={refVideo}
                                  progress={videoStats?.progress as number}
                                  bufferProgress={bufferProgress}
                                  refHLS={refHLS}/>
        </Box>
        <Box className="hls-video-player-playrate" sx={{position: 'absolute',
                  display: {xs: 'none', sm: 'flex'},
                  zIndex: 210,
                  right: 'var(--video-playrate-right)',
                  bottom: 'var(--video-controls-2-bottom)'}}>
          <HLSVideoPlayerPlayRate refVideo={refVideo}
                                  playRate={videoStats?.playRate as number} />
        </Box>
        <Box className="hls-video-player-item" sx={{position: 'absolute', zIndex: 210, right: '1%', bottom: 'var(--video-controls-1-bottom)'}}>
          <HLSVideoPlayerPIPButton  refVideo={refVideo}
                                    id={videoStats?.id as string}
                                    refHLS={refHLS}/>
        </Box>
        <Box className="hls-video-player-status" sx={{position: 'absolute',
                  zIndex: 210,
                  left: 'calc(50% - (var(--hls-video-player-status-width) / 2))',
                  bottom: 'calc(50% - (var(--hls-video-player-status-height) / 2))'}}>
          <HLSVideoPlayerStatus refVideo={refVideo}
                                waiting={waiting}
                                ended={ended}
                                enableHover={false}
                                refHLS={refHLS}
                                playing={videoStats?.playing as boolean} />
        </Box>
        {props.prevLink && ended?<Box className="hls-video-player-item" sx={{position: 'absolute',
                  zIndex: 210,
                  left: 'calc(50% - (var(--hls-video-player-status-width) / 2) - 25%)',
                  bottom: 'calc(50% - (var(--hls-video-player-status-height-button) / 2))'}}>
          <HLSVideoPlayerEndPrev link={props.prevLink} />
        </Box>:null}
        {props.nextLink && ended?<Box className="hls-video-player-item" sx={{position: 'absolute',
                  zIndex: 210,
                  right: 'calc(50% - (var(--hls-video-player-status-width) / 2) - 25%)',
                  bottom: 'calc(50% - (var(--hls-video-player-status-height-button) / 2))'}}>
          <HLSVideoPlayerEndNext link={props.nextLink} />
        </Box>:null}
        {props.title?<Box className="hls-video-player-item" sx={{position: 'absolute',
                  zIndex: 210,
                  top: '13%',
                  left: '3%'}}>
          <Box>
            <Typography variant="h5" sx={{fontWeight: 'bold', color: 'warning.main'}}>
              {props.title}
            </Typography>
          </Box>
        </Box>:null}
        {props.title2?<Box className="hls-video-player-item" sx={{position: 'absolute',
                  zIndex: 210,
                  top: '3%',
                  left: '3%'}}>
          <Box>
            <Typography variant="h5" sx={{fontWeight: 'bold', color: 'warning.main'}}>
              {props.title2}
            </Typography>
          </Box>
        </Box>:null}
      </Box>
    </>);
  } else {
    player = (<>
      <Box  sx={{
              position: 'relative',
              width: '100%',
              height: '100%',
              boxShadow: `
                var(--box-shadow-hls-player-pip) var(--box-shadow-hls-player-pip) var(--box-shadow-hls-player-pip) var(--box-shadow-hls-player-pip-color),
                var(--box-shadow-hls-player-pip-minus) var(--box-shadow-hls-player-pip-minus) var(--box-shadow-hls-player-pip) var(--box-shadow-hls-player-pip-color),
                var(--box-shadow-hls-player-pip) var(--box-shadow-hls-player-pip-minus) var(--box-shadow-hls-player-pip) var(--box-shadow-hls-player-pip-color),
                var(--box-shadow-hls-player-pip-minus) var(--box-shadow-hls-player-pip) var(--box-shadow-hls-player-pip) var(--box-shadow-hls-player-pip-color)`,
              borderColor: 'warning.main',
              borderRadius: 4,
              overflow: 'hidden',
              backgroundColor: 'text.primary',
              '&:hover': {
                cursor: 'grab'
              },
              '&:active': {
                cursor: 'grabbing'
              },
              [`&:hover .hls-video-play,
                &:hover .hls-video-volume,
                &:hover .hls-video-close,
                &:hover .hls-video-back,
                &:hover .hls-video-progress`]: {
                display: 'block',
              },
              [`& .hls-video-play,
                & .hls-video-volume,
                & .hls-video-close,
                & .hls-video-back,
                & .hls-video-progress`]: {
                display: 'none',
              }
            }}>
        <Box  className="hls-video-video"
              sx={{
                width: 'inherit', height: 'inherit',
                display: 'flex', alignItems: 'center'
              }}>
          <video  width={'100%'}
                  ref={refVideo}
                  onRateChange={handleRatechange}
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
        <Box  className="hls-video-progress"
              sx={{position: 'absolute',
                   zIndex: 210,
                   left: '1%',
                   bottom: '2%',
                   width: '100%'}}>
          <HLSVideoPlayerProgress refVideo={refVideo}
                                  progress={videoStats?.progress as number}
                                  bufferProgress={bufferProgress}
                                  refHLS={refHLS}/>
        </Box>
        <Box  className="hls-video-volume"
              sx={{position: 'absolute',
                  zIndex: 210,
                  right: '2%',
                  top: 'var(--video-play-center-top)'}}>
          <HLSVideoPlayerVolume refVideo={refVideo}
                                plusSlider={false}
                                volume={videoStats?.volume as number} />
        </Box>
        <Box  className="hls-video-close"
              sx={{position: 'absolute', zIndex: 210, right: '2%', top: '2%'}}>
          <HLSVideoPlayerPIPClose  refVideo={refVideo}
                                    refHLS={refHLS}/>
        </Box>
        <Box  className="hls-video-back"
              sx={{position: 'absolute', zIndex: 210, left: '2%', top: '2%'}}>
          <HLSVideoPlayerPIPBack  refVideo={refVideo}
                                  refHLS={refHLS}/>
        </Box>
        <Box  className="hls-video-status"
              sx={{position: 'absolute',
                  zIndex: 210,
                  left: 'calc(50% - (var(--hls-video-player-status-width) / 2))',
                  bottom: 'calc(50% - (var(--hls-video-player-status-height) / 2))'}}>
          <HLSVideoPlayerStatus refVideo={refVideo}
                                waiting={waiting}
                                ended={ended}
                                enableHover={false}
                                refHLS={refHLS}
                                playing={videoStats?.playing as boolean} />
        </Box>
      </Box>
    </>);
  }

  return player;
}
