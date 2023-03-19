import * as React from 'react';
import {Grid, Box, Paper, Typography, Card, CardActions, CardActionArea, CardContent, CardHeader, CardMedia,
        Tooltip, IconButton, Fab, TextField, Button, Alert, Skeleton, Pagination, Stack} from '@mui/material';

export interface FooterProps {}

export const Footer: React.FC<FooterProps> = () => {
  return (<Paper sx={{pr: 0.5, pl: 0.5, height: 'var(--footer-height)'}}>
    <Grid container>
      <Grid item xs={12}>
        <Box sx={{pt: 2, pb: 2, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <Typography variant="subtitle2">Task site courses with using React</Typography>
        </Box>
      </Grid>
    </Grid>
  </Paper>);
}
