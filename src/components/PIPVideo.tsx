import React, {} from 'react';
import ReactDOM from 'react-dom';
import {useSelector, useDispatch} from 'react-redux';
import Draggable from 'react-draggable';
import {Grid, Box, Paper, Typography, Card, CardActions, CardActionArea, CardContent,
        CardHeader, CardMedia, LinearProgress, CircularProgress,
        IconButton, Rating, Slider, Fab, Chip, TextField, Button, Alert, Skeleton} from '@mui/material';

import {HLSVideoPlayer} from './HLSVideoPlayer';

interface PIPVideoProps {}

export const PIPVideo: React.FC<PIPVideoProps> = (props) => {

  const pipCurrentVideoId = useSelector((state: any) => state.videos.pipCurrentVideoId);

  if(pipCurrentVideoId) {
    return ReactDOM.createPortal((<>
      <Draggable bounds="body">
        <Box  sx={{
                position: 'fixed',
                right: '5%',
                bottom: '5%',
                zIndex: 1000,
                display: 'flex',
                width: 'var(--pip-video-width)',
                height: 'var(--pip-video-height)',
              }}>
          <HLSVideoPlayer id={pipCurrentVideoId}
                          entry={{
                            id: pipCurrentVideoId
                          }}
                          pipMode={true} />
        </Box>
      </Draggable>
    </>), document.body);
  } else {
    return (<></>);
  }
}
