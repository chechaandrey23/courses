import {useEffect, useRef, useContext, useState, useMemo} from 'react';
import dateFormat from "dateformat";
import {useSelector, useDispatch} from 'react-redux';
import {Grid, Box, Paper, Typography, Card, CardActions, CardActionArea, CardContent, CardHeader, CardMedia,
        Tooltip, IconButton, Rating, Fab, Chip, TextField, Button, Alert, Skeleton} from '@mui/material';
import Image from 'mui-image';
import {useNavigate, useParams, useSearchParams, NavLink} from "react-router-dom";
import LockIcon from '@mui/icons-material/Lock';
import TagFacesIcon from '@mui/icons-material/TagFaces';
import ImageNotSupportedIcon from '@mui/icons-material/ImageNotSupported';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import ReplyIcon from '@mui/icons-material/Reply';
import {useFirst} from '../hooks/useFirst.js';
import {useSnackBarError} from '../hooks/useSnackBarError.jsx';

import {CourseLessonList} from './CourseLessonList';
import {CoursePlayer} from './CoursePlayer';
import {EmptyCourse} from './EmptyCourse';
import {SkeletonCourse} from './SkeletonCourse';

import {sagaCourse} from '../redux/saga/courses';
import {setCoursePrevPage} from '../redux/courses';

const COURSE_STATUS_LAUNCHED = 'launched';

export interface CourseProps {}

export const Course: React.FC<CourseProps> = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {snackBarError} = useSnackBarError();

  const {courseId} = useParams();

  const first = useFirst();

  const course = useSelector((state: any) => state.courses.course);
  const loadCourse = useSelector((state: any) => state.courses.loadCourse);
  const coursePrevPage = useSelector((state: any) => state.courses.coursePrevPage);
  const errorCourse = useSelector((state: any) => state.courses.errorCourse);

  useEffect(() => {
    dispatch(sagaCourse({id: courseId}));
  }, [courseId]);

  const lessons: Array<any> = useMemo(() => {
    if(course) {
      return [...course.lessons].sort((a: any, b: any) => (a.order - b.order));
    } else {
      return [];
    }
  }, [course]);

  const [currentLesson, setCurrentLesson] = useState(null);

  useEffect(() => {
    (snackBarError as any)(errorCourse);
  }, [errorCourse]);

  if(loadCourse || first.current) {
    return (<Box>
      <SkeletonCourse />
    </Box>);
  }

  if(!loadCourse && !first.current && !course) {
    return (<Box>
      <EmptyCourse id={courseId as string} />
    </Box>);
  }

  return (<Box sx={{pt: 0.5, pb: 0.5}}>
    <Paper>
      <Grid container>
        <Grid item xs={12}>
          <Grid container>
            <Grid item xs={1} sx={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <Tooltip title={
                <Typography variant="h6">{'Back'}</Typography>
              } arrow={true} placement="top">
                <IconButton edge="end"
                            color="primary"
                            onClick={() => {
                              console.log(coursePrevPage)
                              if(coursePrevPage) {
                                dispatch(setCoursePrevPage(null));
                                navigate(coursePrevPage.pathname+coursePrevPage.search);
                              } else {
                                history.back();
                              }
                            }}
                            size="large">
                  <ReplyIcon color="inherit" sx={{width: 'var(--icon-size-40)', height: 'var(--icon-size-40)'}} />
                </IconButton>
              </Tooltip>
            </Grid>
            <Grid item xs={10} sx={{pl: 1, pt: 2, pb: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <Typography variant="h5" sx={{fontWeight: 'bold'}}>{course.title}</Typography>
            </Grid>
            <Grid item xs={1} sx={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              {course.containsLockedLessons
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
        <Grid item xs={12} sx={{p: 0.5, pr: 1, pl: 1}}>
          <Box sx={{borderRadius: 1, border: '1px solid gray', overflow: 'hidden', height: 'var(--image-course-height)'}}>
            <Image src={course.previewImageLink+'/cover.webp'}
                   width="inherit"
                   height="inherit"
                   duration={0}
                   errorIcon={<ImageNotSupportedIcon color="inherit" sx={{height: '100%', width: '100%'}} />}
                   showLoading={<CloudDownloadIcon color="inherit" sx={{height: '100%', width: '100%'}} />}/>
          </Box>
        </Grid>
        <Grid item xs={12} sx={{pr: 1, pl: 1}}>
          <Grid container>
            <Grid item xs={12} sx={{p: 0.5}}>
              <Typography variant="subtitle1">{course.description}</Typography>
            </Grid>
            <Grid item xs={12} sx={{p: 0.5}}>
              {course.tags.map((item: string, index: number) => {
                return (<Chip key={index+1}
                              sx={{'&:hover': {cursor: 'pointer'}}}
                              icon={<TagFacesIcon sx={{color: "inherit"}} />}
                              label={item}
                              variant="outlined" />);
              })}
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={8} sx={{p: 2, pr: 2, display: 'flex', justifyContent: 'start', alignItems: 'center'}}>
          <Typography variant="subtitle2">
            Start course:<Box sx={{pl:1, pr: 1, fontWeight: 'bold', display: 'inline'}}>
              {dateFormat(new Date(course.launchDate), "dd mmmm yyyy")}
            </Box>
            {course.status==COURSE_STATUS_LAUNCHED
              ?<Typography variant="subtitle1" sx={{display: 'inline', fontWeight: 'bold', color: "warning.main"}}>
                is already running
              </Typography>
              :null}
          </Typography>
        </Grid>
        <Grid item xs={4} sx={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <Tooltip title={
            <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <Typography variant="h6" sx={{pr: 1}}>{'User Rating'}</Typography>
              <Typography variant="h6" sx={{fontWeight: 'bold'}}>{course.rating}</Typography>
            </Box>
          } arrow={true} placement="top">
            <Rating value={course.rating}
                    size="large"
                    precision={0.25}/>
          </Tooltip>
        </Grid>
        <Grid item xs={12} sx={{p: 0.5}}>
          <Grid container>
            <Grid item xs={12} sx={{pl: 0.5, pr: 0.5, pb: 0.5}}>
              <CoursePlayer lesson={currentLesson}
                            lessons={lessons}
                            courseId={course.id}/>
            </Grid>
            <Grid item xs={12}>
              <CourseLessonList entries={lessons}
                                courseId={course.id}
                                onSelect={(entry) => {
                                  setCurrentLesson(entry);
                                }}/>
            </Grid>
            <Grid item xs={12}>
              <Box sx={{pl: 2, pb: 2, pt: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'text.disabled'}}>
                <Typography variant="subtitle2" sx={{pr: 1, fontWeight: 'bold', color: 'text.primary'}}>#id</Typography>
                <Typography variant="subtitle2" sx={{fontWeight: 'bold'}}>{course.id}</Typography>
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  </Box>);
}
