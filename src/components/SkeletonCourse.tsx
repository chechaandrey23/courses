import * as React from 'react';
import {Grid, Box, Paper, Typography, Skeleton, Rating, Badge, Chip,
        Tooltip, IconButton, Fab, TextField, Button, Alert, Pagination, Stack} from '@mui/material';

export interface SkeletonCourseProps {}

export const SkeletonCourse: React.FC<SkeletonCourseProps> = () => {
  return (<>
    <Box sx={{pt: 0.5, pb: 0.5}}>
      <Paper sx={{minHeight: 'calc(var(--course-height))'}}>
        <Grid container>
          <Grid item xs={12}>
            <Grid container>
              <Grid item xs={1} sx={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <Skeleton variant="circular" width={40} height={40} />
              </Grid>
              <Grid item xs={10} sx={{pl: 1, pt: 2, pb: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <Skeleton variant="text" sx={{fontSize: '2rem', width: '70%'}} />
              </Grid>
              <Grid item xs={1} sx={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <Skeleton variant="rounded" sx={{width: 'var(--icon-size-30)', height: 'var(--icon-size-30)'}} />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} sx={{p: 0.5, pr: 1, pl: 1}}>
            <Box sx={{borderRadius: 1, border: '1px solid gray', overflow: 'hidden', height: 'var(--image-course-height)'}}>
              <Skeleton variant="rounded" sx={{width: '100%', height: 'inherit', minHeight: '250px'}} />
            </Box>
          </Grid>
          <Grid item xs={12} sx={{pr: 1, pl: 1}}>
            <Grid container>
              <Grid item xs={12} sx={{p: 0.5}}>
                {Array.from(Array(3).keys()).map((item) => {
                  return (<Skeleton key={item} variant="text" sx={{fontSize: '1rem', width: '100%'}} />)
                })}
              </Grid>
              <Grid item xs={12} sx={{p: 0.5}}>
                {Array.from(Array(5).keys()).map((item) => {
                  return (<Chip key={item}
                                sx={{m: 0.5}}
                                icon={<Skeleton variant="circular" width={20} height={20} />}
                                label={<Skeleton variant="text" sx={{fontSize: '1rem', width: '70px'}} />}
                                variant="outlined" />);
                })}
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={8} sx={{p: 2, pr: 2, display: 'flex', justifyContent: 'start', alignItems: 'center'}}>
            <Skeleton variant="text" sx={{fontSize: '1rem', width: '45%'}} />
          </Grid>
          <Grid item xs={4} sx={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <Rating value={5} disabled={true}
                    size="large"
                    precision={0.25}/>
          </Grid>
          <Grid item xs={12} sx={{p: 0.5}}>
            <Grid container>
              <Grid item xs={12} sx={{pl: 0.5, pr: 0.5, pb: 0.5}}>
                <Skeleton variant="rounded" sx={{width: '100%', height: 'inherit', minHeight: {xs: '300px', sm: '450px', md: '600px'}}} />
              </Grid>
              <Grid item xs={12}>
                <Box sx={{width: '100%', height: '200px', overflow: 'hidden', display: 'flex'}}>
                  {Array.from(Array(10).keys()).map((item) => {
                    return (<Box key={item} sx={{m: 0.5}}>
                      <Skeleton variant="rounded" sx={{width: 'var(--course-lesson-width)', height: '100%'}} />
                    </Box>);
                  })}
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box sx={{pl: 2, pb: 2, pt: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'text.disabled'}}>
                  <Skeleton variant="text" sx={{fontSize: '1rem', width: '50%'}} />
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  </>);
}
