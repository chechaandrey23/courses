import { call, takeEvery, put, all, spawn, take, cancel } from 'redux-saga/effects';

import {coursesSagas} from './courses';
import {videosSagas} from './videos';

// takeLatest
// takeLatest
export function* rootSaga() {

	const sagas: Array<any> = [
		...coursesSagas,
    ...videosSagas
	];

	yield all(sagas.map((o) => {
		return spawn(function *() {
			while(true) {
				try {
					if(o.pattern) {
						let lastTask: any;
						while(true) {
							const action: any = yield take(o.pattern);
							// cancel is no-op if the task has already terminated
							if(lastTask) yield cancel(lastTask);
							//lastTask = yield fork(saga, ...args.concat(action));
							lastTask = yield call(o.saga, action);
						}
					} else {
						yield call(o);
					}
					break;
				} catch(e) {
					// error
					//console.error(e);
					throw e;
				}
			}
		});
	}));
}

interface SagaAction<T> {
  type: string;
  payload: T;
}

type TypeExpName = string;
type TypeConstName = string;

//{expName: constName}
export function createActions(obj: {[key: TypeExpName]: TypeConstName}): {[key: TypeExpName]: <T>(data?: T) => SagaAction<T>} {
	return Object.keys(obj || {}).reduce((acc: {[name: string]: <T>(data?: T) => SagaAction<T>}, key: TypeExpName) => {
		acc[key] = ((constName: TypeConstName) => {
			return <T>(data?: T) => ({type: constName, payload: data} as SagaAction<T>);
		})(obj[key]);

		return acc;
	}, {});
}

interface PatternGenerator {
  pattern: string;
  saga: OnlyGenerator;
}

type OnlyGenerator = (...args: any[]) => Generator<any, any, any>;
// constName, fn | fn
export function createSagas(arr: Array<OnlyGenerator|[string, OnlyGenerator]>): Array<OnlyGenerator|PatternGenerator> {
	return (Array.isArray(arr)?arr:[]).reduce((acc: Array<OnlyGenerator|PatternGenerator>, value: OnlyGenerator|[string, OnlyGenerator]) => {
		if(typeof value === 'function') {
			acc.push(value);
		} else if(Array.isArray(value) && typeof value[1] === 'function') {
			acc.push({pattern: value[0]+'', saga: value[1]} as PatternGenerator);
		}

		return acc;
	}, [] as Array<OnlyGenerator|PatternGenerator>);
}
