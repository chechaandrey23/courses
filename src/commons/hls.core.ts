import Hls from 'hls.js';

export interface HLSConfig {
  refHLS: any;
  refVideo: any;
  videoStats: any;
}

export function createHLS(config: HLSConfig): void {
  const refVideo = config.refVideo;
  const videoStats = config.videoStats;

  const hls = new Hls({
    maxMaxBufferLength: 60,
    maxBufferLength: 30,
    maxBufferSize: 6 * 1000 * 1000
  });

  hls.on(Hls.Events.MEDIA_ATTACHED, function() {
    console.log('video and hls.js are now bound together !');
  });

  hls.on(Hls.Events.MANIFEST_PARSED, function (event, data) {
    console.log('manifest loaded, found ' + data.levels.length + ' quality level');
  });

  hls.on(Hls.Events.ERROR, function(event, data) {
    console.error(event, data);
    if(data.fatal) {
    switch(data.type) {
      case Hls.ErrorTypes.NETWORK_ERROR:
        // try to recover network error
        console.log('fatal network error encountered, try to recover');
        hls.startLoad(5);
        break;
      case Hls.ErrorTypes.MEDIA_ERROR:
        console.log('fatal media error encountered, try to recover');
        hls.recoverMediaError();
        break;
      default:
        // cannot recover
        hls.detachMedia();
        hls.destroy();
        break;
    }
  }
  });

  hls.loadSource(videoStats.src);

  hls.attachMedia(refVideo.current);

  const timePosition = Math.floor((videoStats.duration || 0) * (videoStats.progress || 0));

  console.log('time position: '+timePosition);

  hls.startLoad(timePosition || -1);
  (refVideo.current as any).currentTime = timePosition;

  config.refHLS.current = hls;
}

export function destroyHLS(config: HLSConfig): void {
  const refHLS = config.refHLS;
  const hls = refHLS.current;
  if(hls) {
    hls.detachMedia();
    hls.destroy();
    refHLS.current = null;
  }
}
