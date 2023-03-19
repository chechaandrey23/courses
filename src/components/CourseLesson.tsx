import {useEffect, useRef, useContext, useState} from 'react';
import dateFormat from "dateformat";
import {useSelector, useDispatch} from 'react-redux';
import {Grid, Box, Paper, Typography, Card, CardActions, CardActionArea, CardContent, CardHeader, CardMedia,
        Tooltip, IconButton, Rating, Fab, Chip, TextField, Button, Alert, Skeleton} from '@mui/material';
import Image from 'mui-image';
import {useNavigate, useParams, NavLink} from "react-router-dom";
import {ScrollMenu, VisibilityContext} from 'react-horizontal-scrolling-menu';
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo';
import LockIcon from '@mui/icons-material/Lock';
import DesktopAccessDisabledIcon from '@mui/icons-material/DesktopAccessDisabled';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import ImageNotSupportedIcon from '@mui/icons-material/ImageNotSupported';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';

const COURSE_LESSON_TYPE_VIDEO = 'video';
const COURSE_LESSON_UNLOCKED = 'unlocked';

interface CourseLessonProps {
  courseId: string;
  id: string;
  itemId: string;
  duration: number;
  image: string;
  video: string;
  order: number;
  status: "unlocked"|string;
  title: string;
  type: "video"|string;
  //onSelect?: (e: any) => void;
  selected?: boolean;
}

export const CourseLesson: React.FC<CourseLessonProps> = (props) => {
  const visibility = useContext(VisibilityContext);

  const videos = useSelector((state: any) => state.videos.videos);

  useEffect(() => {
    visibility.scrollToItem(visibility.getItemById(props.itemId), "smooth", "center");
  }, [props.selected]);

  const progress = videos[props.video]?videos[props.video].progress:0;

  const color = props.status!==COURSE_LESSON_UNLOCKED
    ?'var(--box-shadow-selected-lesson-color-hover2)'
    :'var(--box-shadow-selected-lesson-color-hover)';

  return (
    <Box component={NavLink} sx={{p: 0.6, display: 'flex'}} to={'/course/'+props.courseId+'?'+'lesson='+props.order}>
      <Paper sx={{
        width: 'var(--course-lesson-width)',
        borderRadius: 1,
        overflow: 'hidden',
        boxShadow: props.selected
          ?`var(--box-shadow-selected-lesson) var(--box-shadow-selected-lesson) var(--box-shadow-selected-lesson) var(--box-shadow-selected-lesson-color),
            var(--box-shadow-selected-lesson-minus) var(--box-shadow-selected-lesson-minus) var(--box-shadow-selected-lesson) var(--box-shadow-selected-lesson-color),
            var(--box-shadow-selected-lesson) var(--box-shadow-selected-lesson-minus) var(--box-shadow-selected-lesson) var(--box-shadow-selected-lesson-color),
            var(--box-shadow-selected-lesson-minus) var(--box-shadow-selected-lesson) var(--box-shadow-selected-lesson) var(--box-shadow-selected-lesson-color)`
          :'default',
        color: props.selected?'warning.main':'primary.main',
        '&:hover': {
          cursor: 'pointer',
          color: props.status!==COURSE_LESSON_UNLOCKED?'error.main':'success.main',
          boxShadow: `
            var(--box-shadow-selected-lesson) var(--box-shadow-selected-lesson) var(--box-shadow-selected-lesson) ${color},
            var(--box-shadow-selected-lesson-minus) var(--box-shadow-selected-lesson-minus) var(--box-shadow-selected-lesson) ${color},
            var(--box-shadow-selected-lesson) var(--box-shadow-selected-lesson-minus) var(--box-shadow-selected-lesson) ${color},
            var(--box-shadow-selected-lesson-minus) var(--box-shadow-selected-lesson) var(--box-shadow-selected-lesson) ${color}`,
        },
        '&:hover .lesson-selected': {
          backgroundColor: props.status!==COURSE_LESSON_UNLOCKED?'error.main':'success.main',
          color: 'primary.contrastText'
        }
      }}>
        <Box sx={{
          position: 'relative', borderRadius: 'inherit', width: '100%', height: 'var(--course-lesson-image-height)'
        }}>
          <Box sx={{borderRadius: 'inherit', width: 'inherit', height: 'inherit'}}>
            <Image src={props.image+'/lesson-'+props.order+'.webp'}
                   width="inherit"
                   height="inherit"
                   duration={0}
                   errorIcon={<ImageNotSupportedIcon color="inherit" sx={{height: 'inherit', width: '100%'}} />}
                   showLoading={<CloudDownloadIcon color="inherit" sx={{height: 'inherit', width: '100%'}} />}/>
          </Box>
          <Box sx={{position: 'absolute', top: '12%', left: '2%'}}>
            <Typography variant="h6" sx={{fontWeight: 'bold'}}>{props.title}</Typography>
          </Box>
          {progress>0?<Box sx={{position: 'absolute', bottom: '17%', left: '2%'}}>
            <Box className="lesson-selected" sx={{
              pr: 1, pl: 2, borderRadius: 4,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              backgroundColor: props.selected?'warning.main':'primary.main', color: 'primary.contrastText'
            }}>
              <Typography variant="h5">{'passed'}</Typography>
              <DirectionsRunIcon color="inherit" sx={{pl: 1, pr: 1, width: 'var(--icon-size-30)', height: 'var(--icon-size-30)'}} />
              <Typography variant="h5" sx={{fontWeight: 'bold'}}>
                <Box>{Math.round(progress * 100)}{'%'}</Box>
              </Typography>
            </Box>
          </Box>:null}
          <Box sx={{position: 'absolute', bottom: '1%', right: '1%'}}>
            {props.status!==COURSE_LESSON_UNLOCKED
              ?<Box sx={{cursor: 'pointer'}}>
                <LockIcon sx={{color: 'inherit', width: 'var(--icon-size-64)', height: 'var(--icon-size-64)'}} />
              </Box>
              :(
                props.type!==COURSE_LESSON_TYPE_VIDEO
                  ?<Box sx={{cursor: 'pointer'}}>
                    <DesktopAccessDisabledIcon sx={{color: 'inherit', width: 'var(--icon-size-64)', height: 'var(--icon-size-64)'}} />
                  </Box>
                  :(
                    <Box sx={{cursor: 'pointer'}}>
                      <OndemandVideoIcon sx={{color: 'inherit', width: 'var(--icon-size-64)', height: 'var(--icon-size-64)'}} />
                    </Box>
                  )
              )}
          </Box>
          <Box sx={{position: "absolute", top: '1%', left: '2%'}}>
            <Typography variant="subtitle1">
              Lesson<Box sx={{pl:1, pr: 1, fontWeight: 'bold', display: 'inline'}}>{props.order}</Box>
            </Typography>
          </Box>
          <Box sx={{position: "absolute", bottom: '1%', left: '2%'}}>
            <Typography variant="subtitle1">
              duration:
              <Box sx={{pl:1, pr: 1, fontWeight: 'bold', display: 'inline'}}>{dateFormat(props.duration*60*1000, "HH")}</Box>hours
              <Box sx={{pl:1, pr: 1, fontWeight: 'bold', display: 'inline'}}>{dateFormat(props.duration*60*1000, "MM")}</Box>mins
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
