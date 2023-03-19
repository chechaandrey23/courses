import React, {useMemo} from 'react';
import dateFormat from "dateformat";
import {useSelector, useDispatch} from 'react-redux';
import {Grid, Box, Paper, Typography, Card, CardActions, CardActionArea, CardContent, CardHeader, CardMedia,
        Tooltip, IconButton, Rating, Fab, Chip, TextField, Button, Alert, Skeleton, Badge} from '@mui/material';
import Image from 'mui-image';
import {useNavigate, NavLink} from "react-router-dom";
import LockIcon from '@mui/icons-material/Lock';
import ReadMoreIcon from '@mui/icons-material/ReadMore';
import TagFacesIcon from '@mui/icons-material/TagFaces';
import SchoolIcon from '@mui/icons-material/School';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import ImageNotSupportedIcon from '@mui/icons-material/ImageNotSupported';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';

import {CoursesItemPreview} from './CoursesItemPreview';

import {setCoursePrevPage} from '../redux/courses';

const COURSE_STATUS_LAUNCHED = 'launched';

export interface CoursesItemProps {
  id: string,
  title: string;
  description: string;
  image: string;
  rating: number;
  tags: Array<string>;
  status: 'launched'|string;
  launchDate: string;
  locked: boolean;
  lessonsCount: number;
  duration: number;
  fullCourseProductId?: string;
  fullCourseProductFamily?: string;
  skills?: Array<string>;
  videoLink?: string;
  videoImage?: string;
}

export const CoursesItem: React.FC<CoursesItemProps> = (props) => {
  const dispatch = useDispatch();

  const videos = useSelector((state: any) => state.videos.videos);

  function handleHref() {
    dispatch(setCoursePrevPage({pathname: location.pathname, search: location.search}));
  }

  const lessons = Array.from(Array(props.lessonsCount).keys());

  function searchProgress(videos: any, lessons: Array<number>, courseId: string): {[key: string]: number} {
    return Object.keys(videos).reduce((acc, key) => {
      const item = videos[key].data;
      if(item) {
        if(item.courseId == courseId) {
          if(lessons.includes(item.order)) {
            acc[item.order] = videos[key].progress;
          }
        }
      }
      return acc;
    }, {} as any);
  }

  const progresses = useMemo(() => (searchProgress(videos, lessons, props.id)), []);

  return (<Grid item xs={12}>
    <Paper>
      <Grid container>
        <Grid item xs={12}>
          <Grid container>
            <Grid item xs={8} sx={{pl: 1, pt: 2, pb: 2, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <Box component={NavLink} to={'/course/'+props.id} onClick={handleHref}>
                <Typography variant="h5" sx={{fontWeight: 'bold'}}>{props.title}</Typography>
              </Box>
            </Grid>
            <Grid item sx={{flexGrow: 1}}></Grid>
            <Grid item sx={{display: 'flex', alignItems: 'center', justifyContent: 'end'}}>
              <Tooltip title={
                <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                  <Typography variant="h6" sx={{pr: 1}}>{'User Rating'}</Typography>
                  <Typography variant="h6" sx={{fontWeight: 'bold'}}>{props.rating}</Typography>
                </Box>
              } arrow={true} placement="top">
                <Rating value={props.rating}
                        size="large"
                        precision={0.25}/>
              </Tooltip>
            </Grid>
            <Grid item xs={1} sx={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              {props.locked
                ?<Box sx={{cursor: 'pointer'}}>
                  <Tooltip title={
                    <Typography variant="h6" sx={{fontWeight: 'bold'}}>{'Course Locked!'}</Typography>
                  } arrow={true} placement="top">
                    <LockIcon color="success" sx={{width: 'var(--icon-size-40)', height: 'var(--icon-size-40)'}} />
                  </Tooltip>
                </Box>
                :null}
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} sm={4} sx={{p: 0.5, display: 'flex', alignItems: 'center', pt: 4, pb: 4}}>
          <Box sx={{borderRadius: 1, border: '1px solid gray', overflow: 'hidden', height: '100%'}}>
            <Image src={props.image+'/cover.webp'}
                   width="inherit"
                   height="inherit"
                   duration={0}
                   errorIcon={<ImageNotSupportedIcon color="inherit" sx={{height: '70%', width: '70%'}} />}
                   showLoading={<CloudDownloadIcon color="inherit" sx={{height: '70%', width: '70%'}} />}/>
          </Box>
        </Grid>
        <Grid item xs={12} sm={8}>
          <Grid container>
            <Grid item xs={12} sx={{p: 0.5, pr: 2, display: 'flex', justifyContent: 'end', alignItems: 'center'}}>
              <Typography variant="subtitle2">
                Start course:<Box sx={{pl:1, pr: 1, fontWeight: 'bold', display: 'inline'}}>
                  {dateFormat(new Date(props.launchDate), "dd mmmm yyyy")}
                </Box>
                {props.status==COURSE_STATUS_LAUNCHED
                  ?<Typography variant="subtitle1" sx={{display: 'inline', fontWeight: 'bold', color: "warning.main"}}>
                    is already running
                  </Typography>
                  :null}
              </Typography>
            </Grid>
            <Grid item xs={12} sx={{p: 0.5}}>
              <Typography variant="subtitle1">{props.description}</Typography>
            </Grid>
            <Grid item xs={12} sx={{p: 0.5}}>
              {(props.videoImage || props.videoLink)
                ?<CoursesItemPreview  srcImage={props.videoImage as string}
                                      skills={props.skills as Array<string>}
                                      srcVideo={props.videoLink as string}/>
                :null}
            </Grid>
            <Grid item xs={12} sx={{p: 0.5}}>
              {props.tags.map((item, index) => {
                return (<Chip key={index+1}
                              sx={{'&:hover': {cursor: 'pointer'}}}
                              icon={<TagFacesIcon sx={{color: "inherit"}} />}
                              label={item}
                              variant="outlined" />);
              })}
            </Grid>
            <Grid item xs={12} sx={{p: 0.5}}>
              <Grid container>
                <Grid item xs={12} sx={{p: 1, display: 'flex', alignItems: 'center', justifyContent: 'start'}}>
                  <Typography variant="h5">Lessons:</Typography>
                </Grid>
                <Grid item xs={12} sx={{display: 'flex', gap: 1, rowGap: 1.5, flexDirection: 'row', flexFlow: 'wrap'}}>
                  {lessons.map((item) => {
                    const lesson = item + 1;
                    return (<Badge key={item+1} color="secondary" badgeContent={progresses[lesson]?(
                        <Typography variant="subtitle2" sx={{fontWeight: 'bold', display: 'flex', alignItems: 'center'}}>
                          <DirectionsRunIcon color="inherit" sx={{width: 'var(--icon-size-20)', height: 'var(--icon-size-20)'}} />
                          <Box>{Math.round(progresses[lesson] * 100)}{'%'}</Box>
                        </Typography>
                      ):null} showZero={false} sx={{
                        '& .MuiBadge-badge': {
                          right: '12%'
                        }
                      }} anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                      }}>
                        <Button component={NavLink} to={'/course/'+props.id+'?lesson='+lesson} sx={{
                          borderRadius: 10,
                          pr: 2, pl: 2, pt: 0.5, pb: 0.5,
                          '&:visited': {
                            borderColor: 'secondary.main',
                            color: 'secondary.main',
                          }
                        }} variant="outlined" color="primary" startIcon={
                          <SchoolIcon color="inherit" sx={{width: 'var(--icon-size-30)', height: 'var(--icon-size-30)'}} />
                        } onClick={handleHref}>
                          <Typography variant="subtitle1" sx={{fontWeight: 'bold', display: 'flex', alignItems: 'center'}}>
                            <Box sx={{pl: 1}}>{'lesson #'}{lesson}</Box>
                          </Typography>
                        </Button>
                      </Badge>);
                  })}
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} sx={{p: 0.5, pr: 1, display: 'flex', flexDirection: 'row'}}>
              <Typography sx={{width: '30%', textAlign: 'end'}} variant="subtitle2">
                Count lessons: <Box sx={{fontWeight: 'bold', display: 'inline'}}>{props.lessonsCount}</Box>
              </Typography>
              <Typography sx={{width: '70%', textAlign: 'end'}} variant="subtitle2">
                General duration course:
                <Box sx={{pl:1, pr: 1, fontWeight: 'bold', display: 'inline'}}>{dateFormat(props.duration*60*1000, "HH")}</Box>hours
                <Box sx={{pl:1, pr: 1, fontWeight: 'bold', display: 'inline'}}>{dateFormat(props.duration*60*1000, "MM")}</Box>mins
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={8} sx={{pl: 2, pb: 2, pt: 1, display: 'flex', alignItems: 'center', color: 'text.disabled'}}>
          <Typography variant="subtitle2" sx={{pr: 1, fontWeight: 'bold', color: 'text.primary'}}>#id</Typography>
          <Typography variant="subtitle2" sx={{fontWeight: 'bold'}}>{props.id}</Typography>
        </Grid>
        <Grid item xs={4} sx={{pr: 2, pb: 2, pt: 1, display: 'flex', alignItems: 'center', justifyContent: 'end'}}>
          <Box component={NavLink} to={'/course/'+props.id} onClick={handleHref}>
            <Typography variant="h6" sx={{fontWeight: 'bold', display: 'flex', alignItems: 'center'}}>
              <ReadMoreIcon color="inherit" sx={{width: 'var(--icon-size-30)', height: 'var(--icon-size-30)'}} />
              <Box sx={{pl: 1}}>Full course</Box>
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  </Grid>);
}

export interface CoursesItemFullProps {}

const CoursesItemFull: React.FC<CoursesItemFullProps> = (props) => {
  return (<Box>

  </Box>);
}
/*
export interface CoursesItemPreviewProps {
  skills: Array<string>;
  videoLink: string;
  videoImage: string;
  id: string;
}

const CoursesItemPreview: React.FC<CoursesItemPreviewProps> = (props) => {
  return (<Box>
    <Grid container>
      <Grid item xs={8}>
        <Box sx={{borderRadius: 1,
                  border: '1px solid gray',
                  overflow: 'hidden',
                  width: 'var(--image-courses-item-video-width)',
                  height: 'var(--image-courses-item-video-height)'}}>
          <Image src={props.videoImage}
                 width="inherit"
                 height="inherit"
                 duration={0}
                 errorIcon={<div>ERROR!</div>}
                 showLoading={<div>Loading!</div>}/>
        </Box>
      </Grid>
      <Grid item xs={4}>

      </Grid>
    </Grid>
  </Box>);
}
*/
