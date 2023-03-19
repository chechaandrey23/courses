import {take, call, put, select, delay} from 'redux-saga/effects';
import {eventChannel} from 'redux-saga';

import {createSagas, createActions} from './rootSaga';

import {
  getVideo, startGetVideo, endGetVideo, errorGetVideo,
  deleteVideo, startDeleteVideo, endDeleteVideo, errorDeleteVideo,
  getAllVideo, startGetAllVideo, endGetAllVideo, errorGetAllVideo,
  deleteAllVideo, startDeleteAllVideo, endDeleteAllVideo, errorDeleteAllVideo,
  addVideo, startAddVideo, endAddVideo, errorAddVideo,
  addWithReplaceVideo, startAddWithReplaceVideo, endAddWithReplaceVideo, errorAddWithReplaceVideo,
  updateVideo, startUpdateVideo, endUpdateVideo, errorUpdateVideo,
  setPIPCurrentVideo, setNewHLS
} from '../videos';

import {VideoStateInterface as VideoInterface} from '../videos';

type VideosInterface = {[key: string]: VideoInterface};

function _read(): VideosInterface {
  try {
    return (JSON.parse(localStorage.getItem('--video-status') as any) || {}) as VideosInterface;
  } catch(e) {
    return {} as VideosInterface;
  }
}

function _write(data: VideosInterface): void {
  localStorage.setItem('--video-status', JSON.stringify(data));
}

export interface VideoPayloadIdInterface {
  id: string;
}

function* getVideoSaga(o: {[payload: string]: VideoPayloadIdInterface}): Generator<any, any, any> {
  try {
		yield put(startGetVideo(null));
    //yield delay(200);
    const res: VideosInterface = yield call(_read);
    yield put(getVideo(res[o.payload.id]));
	} catch(e) {
    console.error(e);
		yield put(errorGetVideo(e));
	} finally {
		yield put(endGetVideo(null));
	}
}

function* deleteVideoSaga(o: {[payload: string]: VideoPayloadIdInterface}): Generator<any, any, any> {
  try {
		yield put(startDeleteVideo(null));
    //yield delay(200);
    let res: VideosInterface = yield call(_read);
    const data: VideoInterface = res[o.payload.id];
    delete res[o.payload.id];
    yield call(_write, res);
    yield put(deleteVideo(data));
	} catch(e) {
    console.error(e);
		yield put(errorDeleteVideo(e));
	} finally {
		yield put(endDeleteVideo(null));
	}
}

function* getAllVideoSaga({payload = {}}): Generator<any, any, any> {
  try {
		yield put(startGetAllVideo(null));
    //yield delay(200);
    const res: VideosInterface = yield call(_read);
    yield put(getAllVideo(res));
	} catch(e) {
    console.error(e);
		yield put(errorGetAllVideo(e));
	} finally {
		yield put(endGetAllVideo(null));
	}
}

export interface DeleteAllInterface {
  reserveIds: Array<string>;
}

function* deleteAllVideoSaga(o: {[payload: string]: DeleteAllInterface}): Generator<any, any, any> {
  try {
		yield put(startDeleteAllVideo(null));
    //yield delay(200);
    if(o.payload && o.payload.reserveIds.length > 0) {
      const res: VideosInterface = yield call(_read);
      const keys = o.payload.reserveIds;
      const newRes = keys.reduce((acc, key) => {
        acc[key] = res[key];
        return acc;
      }, {} as VideosInterface);
      yield call(_write, newRes);
      yield put(deleteAllVideo(newRes));
    } else {
      yield call(_write, {});
      yield put(deleteAllVideo({}));
    }
	} catch(e) {
    console.error(e);
		yield put(errorDeleteAllVideo(e));
	} finally {
		yield put(endDeleteAllVideo(null));
	}
}

function transformEntry(key: string, entry: VideoInterface, defEntry: VideoInterface, result: VideoInterface): void {
  if(key === 'id') {
    if(!entry.hasOwnProperty(key)) {
      result[key] = defEntry[key];
    } else {
      result[key] = entry[key]+'';
    }
  } else if(key === 'src') {
    if(!entry.hasOwnProperty(key)) {
      result[key] = defEntry[key];
    } else {
      result[key] = entry[key]+'';
    }
  } else if(key === 'volume') {
    if(!entry.hasOwnProperty(key)) {
      result[key] = defEntry[key];
    } else {
      if(entry[key] >= 0 && entry[key] <= 1) {
        result[key] = entry[key];
      } else {
        result[key] = 1;
      }
    }
  } else if(key === 'progress') {
    if(!entry.hasOwnProperty(key)) {
      result[key] = defEntry[key];
    } else {
      if(entry[key] >= 0 && entry[key] <= 1) {
        result[key] = entry[key];
      } else {
        result[key] = 0;
      }
    }
  } else if(key === 'playing') {
    if(!entry.hasOwnProperty(key)) {
      result[key] = defEntry[key];
    } else {
      if(entry[key] === true || entry[key] === false) {
        result[key] = entry[key];
      } else {
        result[key] = false;
      }
    }
  } else if(key === 'playRate') {
    if(!entry.hasOwnProperty(key)) {
      result[key] = defEntry[key];
    } else {
      if(entry[key] >= 0 && entry[key] <= 10) {
        result[key] = entry[key];
      } else {
        result[key] = 1;
      }
    }
  } else if(key === 'duration') {
    if(!entry.hasOwnProperty(key)) {
      result[key] = defEntry[key];
    } else {
      if(entry[key] >= 0 && Number.isInteger(entry[key])) {
        result[key] = entry[key];
      } else {
        result[key] = 0;
      }
    }
  } else if(key === 'data') {
    if(!entry.hasOwnProperty(key)) {
      result[key] = defEntry[key];
    } else {
      result[key] = entry[key];
    }
  } else {
    throw new Error(`Key: ${key} - NOT IMPLEMENTED HANDLER!!!`);
  }
}

const defaultVideoState: VideoInterface = {
  id: 'UNKNOWN',
  src: 'UNKNOWN',
  volume: 1,
  progress: 0,
  playing: false,
  playRate: 1,
  duration: 0,
  data: null,
}

export interface VideoPayloadEntryInterface extends VideoPayloadIdInterface {
  entry: VideoInterface;
}

function* addVideoSaga(o: {[payload: string]: VideoPayloadEntryInterface}): Generator<any, any, any> {
  try {
		yield put(startAddVideo(null));
    //yield delay(200);
    let res: VideosInterface = yield call(_read);
    if(!res[o.payload.id]) {
      const entry = o.payload.entry;
      res[o.payload.id] = Object.keys(defaultVideoState).reduce((acc, key) => {
        transformEntry(key, entry, defaultVideoState, acc);
        return acc;
      }, {} as VideoInterface);
    } else {
      throw new Error(`Video state with ID: ${o.payload.id} already exist!`);
    }
    yield call(_write, res);
    yield put(addVideo(res[o.payload.id]));
    yield put(getVideo(res[o.payload.id]));
    yield put(setNewHLS({data: true}));
	} catch(e) {
    console.error(e);
		yield put(errorAddVideo(e));
	} finally {
		yield put(endAddVideo(null));
	}
}

function* addWithReplaceVideoSaga(o: {[payload: string]: VideoPayloadEntryInterface}): Generator<any, any, any> {
  try {
		yield put(startAddWithReplaceVideo(null));
    //yield delay(200);
    let res: VideosInterface = yield call(_read);
    if(!res[o.payload.id]) {
      const entry = o.payload.entry;
      res[o.payload.id] = Object.keys(defaultVideoState).reduce((acc, key) => {
        transformEntry(key, entry, defaultVideoState, acc);
        return acc;
      }, {} as VideoInterface);
      //res[o.payload.id] = o.payload.entry;
    } else {
      const entry = o.payload.entry;
      res[o.payload.id] = Object.keys(defaultVideoState).reduce((acc, key) => {
        transformEntry(key, entry, res[o.payload.id], acc);
        return acc;
      }, {} as VideoInterface);
    }
    yield call(_write, res);
    yield put(addWithReplaceVideo(res[o.payload.id]));
    yield put(getVideo(res[o.payload.id]));
    yield put(setNewHLS({data: true}));
	} catch(e) {
    console.error(e);
		yield put(errorAddWithReplaceVideo(e));
	} finally {
		yield put(endAddWithReplaceVideo(null));
	}
}

function* updateVideoSaga(o: {[payload: string]: VideoPayloadEntryInterface}): Generator<any, any, any> {
  try {
		yield put(startUpdateVideo(null));
    //yield delay(200);
    let res: VideosInterface = yield call(_read);
    if(!res[o.payload.id]) {
      throw new Error(`Video state with ID: ${o.payload.id} NOT FOUND!`);
    } else {
      res[o.payload.id] = {...res[o.payload.id], ...o.payload.entry};
    }
    yield call(_write, res);
    yield put(updateVideo(res[o.payload.id]));
    yield put(getVideo(res[o.payload.id]));
	} catch(e) {
    console.error(e);
		yield put(errorUpdateVideo(e));
	} finally {
		yield put(endUpdateVideo(null));
	}
}

const GET_VIDEO = 'GET_VIDEO';
const DELETE_VIDEO = 'DELETE_VIDEO';
const GET_ALL_VIDEO = 'GET_ALL_VIDEO';
const DELETE_ALL_VIDEO = 'DELETE_ALL_VIDEO';
const ADD_VIDEO = 'ADD_VIDEO';
const ADD_WITH_REPLACE_VIDEO = 'ADD_WITH_REPLACE_VIDEO';
const UPDATE_VIDEO = 'UPDATE_VIDEO';

export const videosSagas = createSagas([
	[GET_VIDEO, getVideoSaga],
	[DELETE_VIDEO, deleteVideoSaga],
  [GET_ALL_VIDEO, getAllVideoSaga],
	[DELETE_ALL_VIDEO, deleteAllVideoSaga],
  [ADD_VIDEO, addVideoSaga],
  [ADD_WITH_REPLACE_VIDEO, addWithReplaceVideoSaga],
  [UPDATE_VIDEO, updateVideoSaga]
]);

export const {
  sagaGetVideo, sagaDeleteVideo, sagaGetAllVideo, sagaDeleteAllVideo,
  sagaAddVideo, sagaAddWithReplaceVideo, sagaUpdateVideo
} = createActions({
  sagaGetVideo: GET_VIDEO,
  sagaDeleteVideo: DELETE_VIDEO,
  sagaGetAllVideo: GET_ALL_VIDEO,
  sagaDeleteAllVideo: DELETE_ALL_VIDEO,
  sagaAddVideo: ADD_VIDEO,
  sagaAddWithReplaceVideo: ADD_WITH_REPLACE_VIDEO,
  sagaUpdateVideo: UPDATE_VIDEO
});
