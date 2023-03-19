import React, {useState, useRef, useEffect} from 'react';
import {NavLink} from "react-router-dom";
import {Grid, Box, Paper, Typography,
        Tooltip, IconButton, Rating, Fab, Chip, TextField, Button, Alert, Skeleton} from '@mui/material';
import Image from 'mui-image';
import DoneIcon from '@mui/icons-material/Done';
import HandymanIcon from '@mui/icons-material/Handyman';
import ImageNotSupportedIcon from '@mui/icons-material/ImageNotSupported';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';

import {MiniHLSVideoPlayer} from './MiniHLSVideoPlayer';

export interface CoursesItemPreviewProps {
  srcImage: string;
  srcVideo: string;
  skills: Array<string>;
}

const TIMEOUT = 10 * 1000;

export const CoursesItemPreview: React.FC<CoursesItemPreviewProps> = (props) => {
  const [newVideo, setNewVideo] = useState<any>(false);

  const refTimeout = useRef<any>(null);

  useEffect(() => {
    () => {
      clearTimeout(refTimeout.current as any);
    }
  }, []);

  return (<>
    <Grid container>
      <Grid item lg={6} md={4} xs={4}>
        <Box sx={{
          display: 'flex', gap: 0.5, pl: {md: 2.5, xs: 0.5}, pr: {xs: 1},
          flexDirection: 'column', alignItems: 'start', justifyContent: 'center'
        }}>
          {props.skills.map((item, index) => {
            return (<Chip key={index+1}
                          color="success"
                          size={"medium"/*"medium|small"*/}
                          sx={{'&:hover': {cursor: 'pointer'}, width: 'auto'}}
                          deleteIcon={<DoneIcon sx={{color: "inherit"}} />}
                          onDelete={() => {}}
                          icon={<HandymanIcon sx={{color: "inherit"}} />}
                          label={item}
                          variant="filled" />);
          })}
        </Box>
      </Grid>
      <Grid item  lg={6} md={8} xs={8}
                  sx={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
        <Box sx={{
          borderRadius: 2,
          overflow: 'hidden',
          width: 'var(--image-courses-item-video-width)',
          height: 'var(--image-courses-item-video-height)',
          '& .preview-course-image': {
            display: 'block',
          },
          '& .preview-course-video': {
            display: 'none',
          },
          '&:hover .preview-course-image': {
            display: 'none',
          },
          '&:hover .preview-course-video': {
            display: 'block',
          },
          '&:hover': {
            backgroundColor: 'text.primary'
          },
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          ml: 1, mr: 1,
        }} onMouseEnter={(e: any) => {
          setNewVideo(true);
          clearTimeout(refTimeout.current as any);
        }} onMouseLeave={(e: any) => {
          refTimeout.current = setTimeout(() => {
            setNewVideo(false);
          }, TIMEOUT);
        }}>
          <Box className="preview-course-image" sx={{
            height: '100%',
            position: 'relative'
          }}>
            <Box sx={{
              zIndex: 100, position: 'absolute', width: '100%', height: 'inherit',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column',
              textShadow: '#FC0 1px 0 10px'
            }}>
              <Typography variant="h3" sx={{fontWeight: 'bold', color: 'warning.main'}}>
                LESSON
              </Typography>
              <Typography variant="h3" sx={{fontWeight: 'bold', color: 'warning.main'}}>
                PREVIEW
              </Typography>
            </Box>
            <Image src={props.srcImage+`/preview.webp`}
                   width="inherit"
                   height="inherit"
                   duration={0}
                   errorIcon={<ImageNotSupportedIcon color="inherit" sx={{height: '70%', width: '70%'}} />}
                   showLoading={<CloudDownloadIcon color="inherit" sx={{height: '70%', width: '70%'}} />}/>
          </Box>
          <Box className="preview-course-video" sx={{width: '100%', backgroundColor: 'text.primary'}}>
            {newVideo?<MiniHLSVideoPlayer  src={props.srcVideo} />:null}
          </Box>
        </Box>
      </Grid>
    </Grid>
  </>);
}
