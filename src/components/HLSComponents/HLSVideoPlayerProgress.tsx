import React, {useRef, useState, useEffect} from 'react';
import {Grid, Box, Paper, Typography, CircularProgress, Tooltip,
        IconButton, Rating, Slider, Fab, Chip, TextField, Button, Alert, Skeleton} from '@mui/material';
import dateFormat, {masks} from "dateformat";
import Hls from 'hls.js';

masks.hammerTime = 'HH:MM:ss';

export interface HLSVideoPlayerProgressProps {
  refVideo: any;
  refHLS: any;
  progress: number;
  bufferProgress: number;
}

export const HLSVideoPlayerProgress: React.FC<HLSVideoPlayerProgressProps> = (props) => {
  const refTooltip = useRef(null);
  const refTooltipPosition = useRef({x: 0, y: 0});
  const refTooltipArea = useRef(null);

  const [progressBarPosition, setProgressBarPosition] = useState(0);

  return (<>
    <Tooltip PopperProps={{
      popperRef: refTooltip,
      anchorEl: {
        getBoundingClientRect: () => {
          return new DOMRect(
            refTooltipPosition.current.x,
            (refTooltipArea.current as any).getBoundingClientRect().y,
            0,
            0,
          );
        },
      },
    }} title={
      <Typography variant="h6" sx={{fontWeight: 'bold'}}>
        {props.refVideo.current && !isNaN((props.refVideo.current as any).duration)
          ?dateFormat(
            new Date(Math.round(progressBarPosition * (props.refVideo.current as any).duration)*1000),
            'hammerTime',
            true
          )
          :'00:00:00'}
      </Typography>
    } arrow={true} placement="top" followCursor={true}>
      <Box ref={refTooltipArea}>
        <Progress width={'98%'}
                  height={'var(--progress-video-height)'}
                  position={props.progress || 0}
                  positionInsole={props.bufferProgress || 0}
                  onClick={(e, position) => {
                    const videoEl = props.refVideo.current as any;
                    const hls = props.refHLS.current as Hls;
                    const timePosition = Math.floor(videoEl.duration * position);
                    const paused = videoEl.paused;
                    hls.stopLoad();
                    videoEl.pause();
                    hls.startLoad(timePosition);
                    videoEl.currentTime = timePosition;
                    if(!paused) videoEl.play();
                  }}
                  onMove={(e, position) => {
                    refTooltipPosition.current = {x: e.clientX, y: e.clientY};

                    if(refTooltip.current != null) (refTooltip.current as any).update();

                    setProgressBarPosition(position);
                  }}
                  bgOpacity={0.38}
                  color={'warning.main'}
                  colorInsole={'warning.contrastText'}
                  opacityInsole={0.85}/>
      </Box>
    </Tooltip>
  </>);
}

export interface ProgressProps {
  width?: string|number;
  height?: string|number;
  bgColor?: string;
  bgOpacity?: number;
  color?: string;
  opacity?: number;
  colorInsole?: string;
  opacityInsole?: number;
  position: number;
  positionInsole: number;
  onClick?: (...args: any[]) => void;
  onMove: (...args: any[]) => void;
}

export const Progress: React.FC<ProgressProps> = (props) => {
  if(!(props.position<=1 || props.position>=0)) throw new Error('Position must be 0..1');
  if(!(props.positionInsole<=1 || props.positionInsole>=0)) throw new Error('positionInsole must be 0..1');

  const [position, setPosition] = useState(props.position);
  const [positionInsole, setPositionInsole] = useState(props.positionInsole);

  useEffect(() => {
    setPosition(props.position);
  }, [props.position]);

  useEffect(() => {
    setPositionInsole(props.positionInsole);
  }, [props.positionInsole]);

  const refMain = useRef(null);
  const refWait = useRef(false);

  return (<>
    <Box onClick={props.onClick?((e: any) => {// e.offsetX
           const el = e.currentTarget || e.target;
           const rect = el.getBoundingClientRect();
           const newPosition = e.nativeEvent.offsetX / rect.width;
           if(props.onClick) props.onClick.call(null, e, newPosition);
           setPosition(newPosition);
         }):undefined}
         onMouseMove={props.onClick?((e) => {
           if(!refWait.current) {
             refWait.current = true;

             //e.preventDefault();
             //e.stopPropagation();

             const el = e.currentTarget || e.target;
             const rect = el.getBoundingClientRect();
             const newPosition = e.nativeEvent.offsetX / rect.width;
             if(props.onMove) props.onMove.call(null, e, newPosition);

             setTimeout(function () {
               refWait.current = false;
             }, 100);
           }
         }):undefined}
         sx={{
           position: 'relative',
           cursor: 'pointer',
           width: props.width || 'inherit',
           height: props.height || '5px',
           borderRadius: 3,
           overflow: 'hidden',
         }}>
      <Box sx={{
        position: 'absolute',
        top: '0px',
        left: '0px',
        zIndex: 8,
        width: '100%',
        height: 'inherit',
        borderRadius: 'inherit',
        backgroundColor: props.bgColor || props.color,
        opacity: props.bgOpacity || 1
      }}></Box>
      <Box ref={refMain} sx={{
        position: 'absolute',
        top: '0px',
        left: '0px',
        zIndex: 10,
        width: Math.round(position*100)+'%',
        height: 'inherit',
        //borderRadius: 'inherit',
        backgroundColor: props.color || 'inherit',
        opacity: props.opacity || 1
      }}></Box>
      <Box sx={{
        position: 'absolute',
        top: '0px',
        left: '0px',
        zIndex: 9,
        width: Math.round(positionInsole*100)+'%',
        height: 'inherit',
        //borderRadius: 'inherit',
        backgroundColor: props.colorInsole || 'inherit',
        opacity: props.opacityInsole || 1
      }}></Box>
    </Box>
  </>)
}
/*
// {className, ...props}
const MyTooltip = styled((o: any) => (
  <Tooltip {...o.props} arrow classes={{popper: o.className}} />
))(({}) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: 'warning.main',
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: 'warning.main',
    color: 'warning.contrastText',
  },
}));
*/
