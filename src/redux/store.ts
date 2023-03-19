import {configureStore, getDefaultMiddleware} from '@reduxjs/toolkit';
import createSagaMiddleware from "redux-saga";

import coursesReduser from './courses';
import videosReduser from './videos';

import {rootSaga} from "./saga/rootSaga";

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
	reducer: {
		 courses: coursesReduser,
     videos: videosReduser,
	},
	middleware: [...getDefaultMiddleware({thunk: false, serializableCheck: false}), sagaMiddleware]
});

sagaMiddleware.run(rootSaga);
