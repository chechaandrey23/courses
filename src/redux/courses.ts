import {createSlice} from '@reduxjs/toolkit';

export interface CourseStateInterface {
  courses: Array<any>,
  sliceCourse: Array<any>,
  countCourses: number,
  loadCourses: boolean,
  errorCourses: boolean,
  course: any,
  loadCourse: boolean,
  errorCourse: boolean,
  coursesPage: number,
  coursesLimit: number,
  coursePrevPage: null|CourseStatePrevPageInterface;
}

export interface CourseStatePrevPageInterface {
  pathname: string;
  search: string;
}

export const storeCourses = createSlice({
	name: 'courses',
	initialState: {
    courses: [],
    sliceCourse: [],
    countCourses: 0,
    loadCourses: false,
    errorCourses: false,
    course: null,
    loadCourse: false,
    errorCourse: false,
    coursesPage: 1,
    coursesLimit: 10,

    coursePrevPage: null,
	} as CourseStateInterface,
	reducers: {
    courses(state, action) {
      state.courses = [...action.payload];
      state.countCourses = action.payload.length;
      storeCourses.reducer(state, storeCourses.actions._sliceCourse({}));
    },
    _sliceCourse(state, action) {
      state.sliceCourse = state.courses.slice((state.coursesPage-1)*state.coursesLimit, state.coursesPage*state.coursesLimit);
    },
    goPage(state, action) {
      storeCourses.reducer(state, storeCourses.actions._transformPage({page: action.payload.page}));
      storeCourses.reducer(state, storeCourses.actions._sliceCourse({}));
    },
    _transformPage(state, action) {
      let page = action.payload.page;
      if(page < 2) page = 1;
      const _page = Math.ceil(state.countCourses/state.coursesLimit);
      if(page > _page) page = _page;
      state.coursesPage = page;
    },
    startLoadCourses(state, action) {
      state.loadCourses = true;
    },
    endLoadCourses(state, action) {
      state.loadCourses = false;
    },
    errorCourses(state, action) {
      state.errorCourses = action.payload;
    },
    course(state, action) {
      state.course = {...action.payload}
    },
    startLoadCourse(state, action) {
      state.loadCourse = true;
    },
    endLoadCourse(state, action) {
      state.loadCourse = false;
    },
    errorCourse(state, action) {
      state.errorCourse = action.payload;
    },

    setCoursePrevPage(state, action) {
      state.coursePrevPage = action.payload;
    }
	}
});

export const {
  courses, startLoadCourses, endLoadCourses, errorCourses,
  course, startLoadCourse, endLoadCourse, errorCourse,
  goPage, setCoursePrevPage,
} = storeCourses.actions;

export default storeCourses.reducer;
