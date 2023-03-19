import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Provider as ReduxProvider} from 'react-redux';
import {SnackbarProvider} from 'notistack';
import {App} from './App';
import './index.css';

import {store} from './redux/store';

ReactDOM.render(
  <React.StrictMode>
    <ReduxProvider store={store}>
      <SnackbarProvider maxSnack={10}>
        <App />
      </SnackbarProvider>
    </ReduxProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
