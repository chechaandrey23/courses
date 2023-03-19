import * as React from 'react';
import {Grid, Box, Paper, Typography, Skeleton, Rating, Badge, Chip,
        Tooltip, IconButton, Fab, TextField, Button, Alert, Pagination, Stack} from '@mui/material';

export interface SkeletonCoursesItemPreviewProps {}

export const SkeletonCoursesItemPreview: React.FC<SkeletonCoursesItemPreviewProps> = () => {
  return (<>
    <Grid container>
      <Grid item lg={6} md={4} xs={4}>
        <Box sx={{
          display: 'flex', gap: 0.5, pl: {md: 2.5, xs: 0.5}, pr: {xs: 1},
          flexDirection: 'column', alignItems: 'start', justifyContent: 'center'
        }}>
          {Array.from(Array(5).keys()).map((item) => {
            return (<Chip key={item}
                          size={"medium"/*"medium|small"*/}
                          sx={{width: 'auto'}}
                          deleteIcon={<Skeleton variant="circular" width={20} height={20} />}
                          onDelete={() => {}}
                          icon={<Skeleton variant="circular" width={20} height={20} />}
                          label={<Skeleton variant="text" sx={{fontSize: '1rem', width: '70px'}} />}
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
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          ml: 1, mr: 1,
        }} >
          <Skeleton variant="rounded" sx={{width: '600px', height: 'inherit'}} />
        </Box>
      </Grid>
    </Grid>
  </>);
}
