import * as React from 'react';
import {Grid, Box, Paper, Typography, Skeleton, Rating, Badge, Chip,
        Tooltip, IconButton, Fab, TextField, Button, Alert, Pagination, Stack} from '@mui/material';

import {SkeletonCoursesItemPreview} from './SkeletonCoursesItemPreview';

export interface SkeletonCoursesItemProps {}

export const SkeletonCoursesItem: React.FC<SkeletonCoursesItemProps> = () => {
  return (<>
    <Grid item xs={12}>
      <Paper>
        <Grid container>
          <Grid item xs={12}>
            <Grid container>
              <Grid item xs={8} sx={{pl: 1, pt: 2, pb: 2, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <Skeleton variant="text" sx={{fontSize: '2rem', width: '75%'}} />
              </Grid>
              <Grid item sx={{flexGrow: 1}}></Grid>
              <Grid item sx={{display: 'flex', alignItems: 'center', justifyContent: 'end'}}>
                <Rating value={5} disabled={true}
                        size="large"
                        precision={0.25}/>
              </Grid>
              <Grid item xs={1} sx={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <Skeleton variant="rounded" sx={{width: 'var(--icon-size-30)', height: 'var(--icon-size-30)'}} />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={4} sx={{p: 0.5, display: 'flex', alignItems: 'center', pt: 4, pb: 4}}>
            <Box sx={{borderRadius: 1, border: '1px solid gray', overflow: 'hidden', height: '100%'}}>
              <Skeleton variant="rounded" sx={{width: '600px', height: 'inherit', minHeight: '250px'}} />
            </Box>
          </Grid>
          <Grid item xs={12} sm={8}>
            <Grid container>
              <Grid item xs={12} sx={{p: 0.5, pr: 2, display: 'flex', justifyContent: 'end', alignItems: 'center'}}>
                <Skeleton variant="text" sx={{fontSize: '1rem', width: '45%'}} />
              </Grid>
              <Grid item xs={12} sx={{p: 0.5}}>
                {Array.from(Array(3).keys()).map((item) => {
                  return (<Skeleton key={item} variant="text" sx={{fontSize: '1rem', width: '100%'}} />)
                })}
              </Grid>
              <Grid item xs={12} sx={{p: 0.5}}>
                <SkeletonCoursesItemPreview />
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
              <Grid item xs={12} sx={{p: 0.5}}>
                <Grid container>
                  <Grid item xs={12} sx={{p: 1, display: 'flex', alignItems: 'center', justifyContent: 'start'}}>
                    <Typography variant="h5">Lessons:</Typography>
                  </Grid>
                  <Grid item xs={12} sx={{display: 'flex', gap: 1, rowGap: 1.5, flexDirection: 'row', flexFlow: 'wrap'}}>
                    {Array.from(Array(10).keys()).map((item) => {
                      const lesson = item + 1;
                      return (<Badge key={item+1} color="secondary" badgeContent={'QQQQQ'} showZero={true} sx={{
                          '& .MuiBadge-badge': {
                            right: '12%'
                          }
                        }} anchorOrigin={{
                          vertical: 'top',
                          horizontal: 'right',
                        }}>
                          <Skeleton variant="rounded" sx={{m: 0.5, width: '170px', height: '35px'}} />
                        </Badge>);
                    })}
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} sx={{p: 0.5, pr: 1, display: 'flex', flexDirection: 'row'}}>
                <Typography sx={{width: '30%', textAlign: 'end'}} variant="subtitle2">
                  <Skeleton variant="text" sx={{fontSize: '1rem', width: '90%'}} />
                </Typography>
                <Typography sx={{width: '70%', textAlign: 'end'}} variant="subtitle2">
                  <Skeleton variant="text" sx={{fontSize: '1rem', width: '90%'}} />
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={8} sx={{pl: 2, pb: 2, pt: 1, display: 'flex', alignItems: 'center', color: 'text.disabled'}}>
            <Skeleton variant="text" sx={{fontSize: '1rem', width: '50%'}} />
          </Grid>
          <Grid item xs={4} sx={{pr: 2, pb: 2, pt: 1, display: 'flex', alignItems: 'center', justifyContent: 'end'}}>
            <Skeleton variant="text" sx={{fontSize: '2rem', width: '30%'}} />
          </Grid>
        </Grid>
      </Paper>
    </Grid>
  </>);
}
