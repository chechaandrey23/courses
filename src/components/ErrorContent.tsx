import * as React from 'react';
import {Grid, Box, Paper, Typography, Card, CardActions, CardActionArea, CardContent, CardHeader, CardMedia,
        Tooltip, IconButton, Fab, TextField, Button, Alert} from '@mui/material';
import {useNavigate, NavLink, useMatches, useLocation} from "react-router-dom";

export interface ErrorContentProps {}

export const ErrorContent: React.FC<ErrorContentProps> = () => {
  const location = useLocation();

  return (<Paper sx={{height: 'calc(var(--course-height))', mt: 0.5, mb: 0.5, pr: 1, pl: 1}}>
    <Box sx={{width: '100%', height: '100%'}}>
      <Grid container sx={{pr: 1, pl: 1, pt: 10, pb: 10, width: 'inherit', height: 'inherit'}}>
        <Grid item xs={12} sx={{
          display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'
        }}>
          <Typography variant="h2" sx={{fontWeight: 'bold'}}>Uh-Oh</Typography>
          <Typography variant="h4" sx={{fontWeight: 'bold'}}>{'Page "'}<NavLink to={location.pathname}>{location.pathname}</NavLink>{'" - Not Found!'}</Typography>
        </Grid>
      </Grid>
    </Box>
  </Paper>);
}
