import {createSlice} from '@reduxjs/toolkit';

export interface VideoStateInterface {
  src: string;
  volume: number;
  progress: number;
  playing: boolean;
  playRate: number;
  duration: number;
  id: string;
  data: any;
}

export interface VideosStateInterface {
  videos: {[key: string]: VideoStateInterface},
  gettingVideos: boolean,
  errorVideos: any,

  deletingVideos: boolean,
  errorDeleteVideos: any,

  video: null|VideoStateInterface,
  gettingVideo: boolean,
  errorVideo: any,

  addingVideo: boolean,
  errorAddVideo: any,

  addingWithReplaceVideo: boolean,
  errorAddWithReplaceVideo: any,

  updatingVideo: boolean,
  errorUpdateVideo: any,

  deletingVideo: boolean,
  errorDeleteVideo: any,

  pipCurrentVideoId: null|string,
  pipParentPage: null|string;

  newHLS: boolean,
}

export const storeVideos = createSlice({
	name: 'videos',
	initialState: {
    videos: {},
    gettingVideos: false,
    errorVideos: false,

    deletingVideos: false,
    errorDeleteVideos: false,

    video: null,
    gettingVideo: false,
    errorVideo: false,

    addingVideo: false,
    errorAddVideo: false,

    addingWithReplaceVideo: false,
    errorAddWithReplaceVideo: false,

    updatingVideo: false,
    errorUpdateVideo: false,

    deletingVideo: false,
    errorDeleteVideo: false,

    pipCurrentVideoId: null,
    pipParentPage: null,

    newHLS: false,
	} as VideosStateInterface,
	reducers: {
    getVideo(state, action) {
      state.video = action.payload;
    },
    startGetVideo(state, action) {
      state.gettingVideo = true;
    },
    endGetVideo(state, action) {
      state.gettingVideo = false;
    },
    errorGetVideo(state, action) {
      state.errorVideo = action.payload;
    },

    getAllVideo(state, action) {
      state.videos = {...action.payload};
    },
    startGetAllVideo(state, action) {
      state.gettingVideos = true;
    },
    endGetAllVideo(state, action) {
      state.gettingVideos = false;
    },
    errorGetAllVideo(state, action) {
      state.errorVideos = action.payload;
    },

    deleteAllVideo(state, action) {
      state.videos = action.payload;
    },
    startDeleteAllVideo(state, action) {
      state.deletingVideos = true;
    },
    endDeleteAllVideo(state, action) {
      state.deletingVideos = false;
    },
    errorDeleteAllVideo(state, action) {
      state.errorDeleteVideos = action.payload;
    },

    addVideo(state, action) {
      state.videos = {...{[action.payload.id]: action.payload}, ...state.videos};
    },
    startAddVideo(state, action) {
      state.addingVideo = true;
    },
    endAddVideo(state, action) {
      state.addingVideo = false;
    },
    errorAddVideo(state, action) {
      state.errorAddVideo = action.payload;
    },

    addWithReplaceVideo(state, action) {
      state.videos = {...state.videos, ...{[action.payload.id]: action.payload}};
    },
    startAddWithReplaceVideo(state, action) {
      state.addingWithReplaceVideo = true;
    },
    endAddWithReplaceVideo(state, action) {
      state.addingWithReplaceVideo = false;
    },
    errorAddWithReplaceVideo(state, action) {
      state.errorAddWithReplaceVideo = action.payload;
    },

    updateVideo(state, action) {
      state.videos = {...state.videos, ...{[action.payload.id]: action.payload}};
    },
    startUpdateVideo(state, action) {
      state.updatingVideo = true;
    },
    endUpdateVideo(state, action) {
      state.updatingVideo = false;
    },
    errorUpdateVideo(state, action) {
      state.errorUpdateVideo = action.payload;
    },

    deleteVideo(state, action) {
      let videos = {...state.videos};
      delete videos[action.payload.id];
      state.videos = videos;
    },
    startDeleteVideo(state, action) {
      state.deletingVideo = true;
    },
    endDeleteVideo(state, action) {
      state.deletingVideo = false;
    },
    errorDeleteVideo(state, action) {
      state.errorDeleteVideo = action.payload;
    },

    setPIPCurrentVideo(state, action) {
      state.pipCurrentVideoId = action.payload;
    },
    setPIPParetnPage(state, action) {
      state.pipParentPage = action.payload;
    },

    setNewHLS(state, action) {
      state.newHLS = action.payload;
    }
	}
});

export const {
  getVideo, startGetVideo, endGetVideo, errorGetVideo,
  deleteVideo, startDeleteVideo, endDeleteVideo, errorDeleteVideo,
  getAllVideo, startGetAllVideo, endGetAllVideo, errorGetAllVideo,
  deleteAllVideo, startDeleteAllVideo, endDeleteAllVideo, errorDeleteAllVideo,
  addVideo, startAddVideo, endAddVideo, errorAddVideo,
  addWithReplaceVideo, startAddWithReplaceVideo, endAddWithReplaceVideo, errorAddWithReplaceVideo,
  updateVideo, startUpdateVideo, endUpdateVideo, errorUpdateVideo,
  setPIPCurrentVideo, setNewHLS, setPIPParetnPage
} = storeVideos.actions;

export default storeVideos.reducer;
