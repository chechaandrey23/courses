import React, {useRef, useEffect} from 'react';
import * as ReactDOM from 'react-dom';
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import {Container, Box} from '@mui/material';

import {router as routerConfig} from './router';

const router = createBrowserRouter(routerConfig);

import {PIPVideo} from './components/PIPVideo';

export interface AppProps {}

export const App: React.FC<AppProps> = () => {

  return (<>
    <Container maxWidth={window.screen.width < 1920?'md':'lg'} sx={{
      pl: {xs: 1, sm: 1}, pr: {xs: 1, sm: 1},
      overflowX: 'hidden',
    }}>
      <RouterProvider router={router} />
      <PIPVideo />
    </Container>
  </>);
}
