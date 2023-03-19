import {useEffect, useRef, useContext, useState, useLayoutEffect} from 'react';
import {Grid, Box, Paper, Rating, Button, Typography, Card, CardActionArea, CardMedia,
        Tooltip, Badge, Alert, Skeleton, IconButton} from '@mui/material';
import {useSnackbar, closeSnackbar} from 'notistack';
import CloseIcon from '@mui/icons-material/Close';

export function useSnackBarError() {
  const {enqueueSnackbar} = useSnackbar();
  const ref = {snackBarError: null}

  ref.snackBarError = (e) => {
    if(e) {
      e = e.data || {};
      enqueueSnackbar(e.code+' => '+e.message, {
        variant: 'error',
        persist: true,
        action: (snackbarId) => {
          return (<>
            <Tooltip title={'Close Snackbar'} arrow={true}>
              <IconButton aria-label="close"
                          color="inherit"
                          size="large"
                          onClick={() => {closeSnackbar(snackbarId)}}>
                <CloseIcon />
              </IconButton>
            </Tooltip>
          </>);
        },
        //preventDuplicate: true,
        anchorOrigin: {vertical: 'bottom', horizontal: 'left'}
      });
    }
  }

  return ref;
}
