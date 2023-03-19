import {take, call, put, select, delay} from 'redux-saga/effects';
import {eventChannel} from 'redux-saga';

import {createSagas, createActions} from './rootSaga';

import {defaultRequestSettings} from './helpers/helper.default.request.settings.js';

import {request} from './helpers/helper.request.js';

import {
  courses, startLoadCourses, endLoadCourses, errorCourses,
  course, startLoadCourse, endLoadCourse, errorCourse,
} from '../courses';

const BASE_URL = 'https://api.wisey.app/api/v1/core/';

function* coursesSaga({payload = {}}): Generator<any, any, any> {
  try {
		yield put(startLoadCourses(null));
    const res: any = yield call(request, {
      ...defaultRequestSettings,
      method: 'GET',
      responseType: 'json',
      url: `${BASE_URL}preview-courses`,
      params: {},
    });
    let data: any = res.data.courses;
    yield put(courses(data));
	} catch(e) {
    console.error(e);
		yield put(errorCourses(e));
	} finally {
		yield put(endLoadCourses(null));
	}
}

interface CoursePayload {
  id: string;
}

function* courseSaga(o: {[payload: string]: CoursePayload}): Generator<any, any, any> {
  try {
		yield put(startLoadCourse(null));
    const res: any = yield call(request, {
      ...defaultRequestSettings,
      method: 'GET',
      responseType: 'json',
      url: `${BASE_URL}preview-courses/${o.payload.id}`,
      params: {},
    });
    let data: any = res.data;
    yield put(course(data));
	} catch(e) {
    console.error(e);
		yield put(errorCourse(e));
	} finally {
		yield put(endLoadCourse(null));
	}
}

const FETCH_COURSES = 'FETCH_COURSES';
const FETCH_COURSE = 'FETCH_COURSE';

export const coursesSagas = createSagas([
	[FETCH_COURSES, coursesSaga],
	[FETCH_COURSE, courseSaga],
]);

export const {sagaCourses, sagaCourse} = createActions({
	sagaCourses: FETCH_COURSES,
	sagaCourse: FETCH_COURSE,
});
