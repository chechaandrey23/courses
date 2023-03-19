import {useEffect, useRef, useContext, useState, useMemo} from 'react';
import {Grid, Box, Paper, Typography, Card, CardActions, CardActionArea, CardContent, CardHeader, CardMedia,
        Tooltip, IconButton, Rating, Fab, Chip, TextField, Button, Alert, Skeleton} from '@mui/material';
import {HLSVideoPlayer} from './HLSVideoPlayer';
import DesktopAccessDisabledIcon from '@mui/icons-material/DesktopAccessDisabled';
import BlockIcon from '@mui/icons-material/Block';

export interface CoursePlayerProps {
  lesson: any;
  courseId: string;
  lessons: Array<any>;
}

const COURSE_LESSON_TYPE_VIDEO = 'video';
const COURSE_LESSON_UNLOCKED = 'unlocked';

export const CoursePlayer: React.FC<CoursePlayerProps> = (props) => {
  const currentLesson = props.lesson as any;

  return (<>
    <Box sx={{
      borderRadius: 1,
      overflow: 'hidden',
      display: 'flex', alignItems: 'center', backgroundColor: 'text.primary',
      width: 'var(--hls-video-player-width)',
      minHeight: {
        xs: 'var(--hls-video-player-height-xs)',
        sm: 'var(--hls-video-player-height-sm)',
        md: 'var(--hls-video-player-height-md)',
        lg: 'var(--hls-video-player-height-lg)'
      },
      boxShadow: `
        var(--box-shadow-selected-lesson) var(--box-shadow-selected-lesson) var(--box-shadow-selected-lesson) var(--box-shadow-selected-lesson-color),
        var(--box-shadow-selected-lesson-minus) var(--box-shadow-selected-lesson-minus) var(--box-shadow-selected-lesson) var(--box-shadow-selected-lesson-color),
        var(--box-shadow-selected-lesson) var(--box-shadow-selected-lesson-minus) var(--box-shadow-selected-lesson) var(--box-shadow-selected-lesson-color),
        var(--box-shadow-selected-lesson-minus) var(--box-shadow-selected-lesson) var(--box-shadow-selected-lesson) var(--box-shadow-selected-lesson-color)`,
    }}>
      {currentLesson?(
        currentLesson.status != COURSE_LESSON_UNLOCKED
          ?<>
            <Box sx={{
              width: '100%', minHeight: 'inherit', position: 'relative',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              [`& .hls-video-player-item`]: {
                display: 'none'
              },
              '&:hover .hls-video-player-item': {
                display: 'block',
              },
            }}>
              <Box className="hls-video-player-item" sx={{position: 'absolute', zIndex: 210, top: '3%', left: '3%'}}>
                <Typography variant="h5" sx={{fontWeight: 'bold', color: 'warning.main'}}>
                  {'Lesson '+currentLesson.order}
                </Typography>
              </Box>
              <Box className="hls-video-player-item" sx={{position: 'absolute', zIndex: 210, top: '13%', left: '3%'}}>
                <Typography variant="h5" sx={{fontWeight: 'bold', color: 'warning.main'}}>
                  {currentLesson.title}
                </Typography>
              </Box>
              <Box>
                <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                  <BlockIcon sx={{width: '35%', height: '35%', color: 'error.main'}} />
                </Box>
                <Typography variant="h4" sx={{fontWeight: 'bold', color: 'error.main'}}>
                  The current lesson is not available for viewing
                </Typography>
              </Box>
            </Box>
          </>
          :(
            currentLesson.type!=COURSE_LESSON_TYPE_VIDEO
              ?<>
                <Box sx={{
                  width: '100%', minHeight: 'inherit', position: 'relative',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  [`& .hls-video-player-item`]: {
                    display: 'none'
                  },
                  '&:hover .hls-video-player-item': {
                    display: 'block',
                  },
                }}>
                  <Box className="hls-video-player-item" sx={{position: 'absolute', zIndex: 210, top: '3%', left: '3%'}}>
                    <Typography variant="h5" sx={{fontWeight: 'bold', color: 'warning.main'}}>
                      {'Lesson '+currentLesson.order}
                    </Typography>
                  </Box>
                  <Box className="hls-video-player-item" sx={{position: 'absolute', zIndex: 210, top: '13%', left: '3%'}}>
                    <Typography variant="h5" sx={{fontWeight: 'bold', color: 'warning.main'}}>
                      {currentLesson.title}
                    </Typography>
                  </Box>
                  <Box>
                    <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                      <DesktopAccessDisabledIcon sx={{width: '35%', height: '35%', color: 'primary.contrastText'}} />
                    </Box>
                    <Typography variant="h4" sx={{fontWeight: 'bold', color: 'primary.contrastText'}}>
                      The current lesson is not video content
                    </Typography>
                  </Box>
                </Box>
              </>
              :(
                <HLSVideoPlayer id={currentLesson.link}
                                pipMode={false}
                                nextLink={getNextLink(props.lessons, currentLesson.order, props.courseId)}
                                prevLink={getPrevLink(props.lessons, currentLesson.order, props.courseId)}
                                title={currentLesson.title}
                                title2={'Lesson '+currentLesson.order}
                                entry={{
                                  id: currentLesson.link,
                                  src: currentLesson.link,
                                  data: {
                                    order: currentLesson.order,
                                    courseId: props.courseId,
                                  }
                                }} />
              )
          )
      ):(<>
        <Typography variant="h5" sx={{fontWeight: 'bold'}}>LESSON IS NULL</Typography>
      </>)}
    </Box>
  </>);
}

function getPrevLink(lessons: Array<any>, order: number, courseId: string): string|undefined {
  const res = lessons.filter((entry) => {return entry.order < order});
  if(res.length > 0) {
    return '/course/'+courseId+'?lesson='+res[res.length - 1].order;
  }
  return undefined;
}

function getNextLink(lessons: Array<any>, order: number, courseId: string): string|undefined {
  const res = lessons.filter((entry) => {return entry.order > order});
  if(res.length > 0) {
    return '/course/'+courseId+'?lesson='+res[0].order;
  }
  return undefined;
}
