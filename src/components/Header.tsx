import React, {useEffect} from 'react';
import {Grid, Box, Paper, Typography, Badge,
        Tooltip, IconButton, Fab, TextField, Button, Alert, Skeleton, Pagination, Stack} from '@mui/material';
import {useNavigate, useParams, NavLink} from "react-router-dom";
import {useSelector, useDispatch} from 'react-redux';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

import {sagaDeleteAllVideo, sagaGetAllVideo} from '../redux/saga/videos';

export interface HeaderProps {}

export const Header: React.FC<HeaderProps> = () => {
  const dispatch = useDispatch();

  const videos = useSelector((state: any) => state.videos.videos);
  const video = useSelector((state: any) => state.videos.video);
  const pipCurrentVideoId = useSelector((state: any) => state.videos.pipCurrentVideoId);

  useEffect(() => {
    dispatch(sagaGetAllVideo());
  }, []);

  return (<Paper sx={{pr: 0.5, pl: 0.5, height: 'var(--header-height)'}}>
    <Grid container>
      <Grid item xs={12} sx={{position: 'relative'}}>
        <Box sx={{pt: 2, pb: 2, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <Box component={NavLink} to='/'>
            <Typography variant="h4">Site with Courses</Typography>
          </Box>
        </Box>
        <Box sx={{position: 'absolute', right: '3%', top: '15px'}}>
          <Tooltip title={
            <Typography variant="h6" sx={{fontWeight: 'bold', pr: 1, pl: 1}}>
              Delete All video views
            </Typography>
          } arrow={true} placement="top">
            <Badge color="secondary" badgeContent={
              <Typography variant="subtitle2" sx={{fontWeight: 'bold'}}>
                {Object.keys(videos).length}
              </Typography>
            } showZero={true} sx={{
              '& .MuiBadge-badge': {
                right: '-5%'
              }
            }} anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}>
              <Button size="large" color="error" variant="contained"
                      onClick={(e: any) => {
                        dispatch(sagaDeleteAllVideo({
                          reserveIds: [
                            ...(video?[video.id]:[]),
                            ...(pipCurrentVideoId?[pipCurrentVideoId]:[])
                          ]
                        }));
                      }}
                      startIcon={
                        <DeleteForeverIcon  color="inherit"
                                            sx={{
                                              width: 'var(--icon-size-30)',
                                              height: 'var(--icon-size-30)',
                                            }} />}
                      sx={{borderRadius: 12}}>
                <Typography variant="h6" sx={{fontWeight: 'bold'}}>views</Typography>
              </Button>
            </Badge>
          </Tooltip>
        </Box>
      </Grid>
    </Grid>
  </Paper>);
}
