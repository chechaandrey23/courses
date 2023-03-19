import * as React from 'react';
import {Grid, Box, Paper, Typography, Card, CardActions, CardActionArea, CardContent, CardHeader, CardMedia,
        Tooltip, IconButton, Fab, TextField, Button, Alert, Skeleton, Pagination, Stack} from '@mui/material';

export interface EmptyCoursesProps {}

export const EmptyCourses: React.FC<EmptyCoursesProps> = () => {
  return (<>
    <Grid item xs={12}>
      <Paper sx={{
        height: 'calc(var(--courses-height) - var(--courses-pagination-height))',
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        <Typography variant='h4' sx={{fontWeight: 'bold'}}>
          {'There are no courses on the course page!'}
        </Typography>
      </Paper>
    </Grid>
  </>);
}
