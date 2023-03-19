import * as React from 'react';
import {Grid, Box, Paper, Typography, Card, CardActions, CardActionArea, CardContent, CardHeader, CardMedia,
        Tooltip, IconButton, Fab, TextField, Button, Alert, Skeleton, Pagination, Stack} from '@mui/material';

export interface EmptyCourseProps {
  id: string;
}

export const EmptyCourse: React.FC<EmptyCourseProps> = (props) => {
  return (<>
    <Box sx={{pb: 0.5}}>
      <Paper sx={{
        mt: 0.5,
        height: 'calc(var(--course-height))',
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        <Typography variant='h5' sx={{fontWeight: 'bold'}}>
          {`Course with ID "`}
          <Box sx={{display: 'inline', color: 'error.main'}}>{props.id}</Box>
          {`" does not exist!`}
        </Typography>
      </Paper>
    </Box>
  </>);
}
