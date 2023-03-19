import {useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {Grid, Box, Paper, Typography, Card, CardActions, CardActionArea, CardContent, CardHeader, CardMedia,
        Tooltip, IconButton, Fab, TextField, Button, Alert, Skeleton, Pagination, Stack} from '@mui/material';
import {useNavigate, useSearchParams, NavLink} from "react-router-dom";
import queryString from 'query-string';
import {useFirst} from '../hooks/useFirst.js';
import {useSnackBarError} from '../hooks/useSnackBarError.jsx';

import {sagaCourses} from '../redux/saga/courses';
import {goPage} from '../redux/courses';

import {CoursesItem} from './CoursesItem';
import {EmptyCourses} from './EmptyCourses';
import {SkeletonCoursesItem} from './SkeletonCoursesItem';

export interface CoursesProps {}

export const Courses: React.FC<CoursesProps> = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {snackBarError} = useSnackBarError();

  const coursesPage = useSelector((state: any) => state.courses.coursesPage);
  const sliceCourse: Array<any> = useSelector((state: any) => state.courses.sliceCourse);
  const countCourses = useSelector((state: any) => state.courses.countCourses);
  const coursesLimit = useSelector((state: any) => state.courses.coursesLimit);
  const loadCourses = useSelector((state: any) => state.courses.loadCourses);
  const errorCourses = useSelector((state: any) => state.courses.errorCourses);

  const [searchParams] = useSearchParams();

  const first = useFirst();

  useEffect(() => {
    dispatch(sagaCourses());
  }, []);

  useEffect(() => {
    let page: any = searchParams.get('page');
    page = page * 1;
    if(page && Number.isInteger(page) && page != coursesPage) {
      dispatch(goPage({page}));
    }
  }, [searchParams, countCourses]);

  useEffect(() => {
    (snackBarError as any)(errorCourses);
  }, [errorCourses]);

  return (<>
    <Grid container sx={{pb: 0.5, pt: 0, minHeight: 'var(--courses-height)'}}>
      <Grid item xs={12} sx={{pt: 0.5}}>
        <Grid container sx={{gap: 0.5}}>
          {(!loadCourses && !first.current)?sliceCourse.map((entry: any) => {
            return <CoursesItem key={entry.id}
                                id={entry.id}
                                title={entry.title}
                                description={entry.description}
                                image={entry.previewImageLink}
                                rating={entry.rating}
                                tags={entry.tags}
                                status={entry.status}
                                launchDate={entry.launchDate}
                                locked={entry.containsLockedLessons}
                                lessonsCount={entry.lessonsCount}
                                duration={entry.duration}
                                fullCourseProductId={entry.meta?.fullCourseProductId}
                                fullCourseProductFamily={entry.meta?.fullCourseProductFamily}
                                skills={entry.meta?.skills}
                                videoLink={entry.meta?.courseVideoPreview?.link}
                                videoImage={entry.meta?.courseVideoPreview?.previewImageLink}/>
          }):null}
          {(loadCourses || first.current)?Array.from(Array(5).keys()).map((item) => {
            return (<SkeletonCoursesItem key={item} />)
          }):null}
        </Grid>
      </Grid>
      {(!loadCourses && !first.current && sliceCourse.length === 0)?<EmptyCourses />:null}
      <Grid item xs={12} sx={{pt: 0.5, height: 'var(--courses-pagination-height)'}}>
        <Paper sx={{pt: 2, pb: 2, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <Stack spacing={2}>
            <Pagination count={Math.ceil(countCourses/coursesLimit)}
                        page={coursesPage}
                        size={'large'}
                        onChange={(e, page) => {
                          navigate(('/courses')+'?'+queryString.stringify({page: page}, {arrayFormat: 'bracket'}));
                          setTimeout(() => {
                            window.scrollTo(0, 0);
                          }, 0);
                        }}
                        variant="outlined"
                        color="primary" />
          </Stack>
        </Paper>
      </Grid>
    </Grid>
  </>);
}
