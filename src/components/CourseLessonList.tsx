import {useEffect, useRef, useContext, useState, useMemo} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {Grid, Box, Paper, Typography, Card, CardActions, CardActionArea, CardContent, CardHeader, CardMedia,
        Tooltip, IconButton, Rating, Fab, Chip, TextField, Button, Alert, Skeleton} from '@mui/material';
import {LeftArrow, RightArrow} from './Arrows';
import {usePreventBodyScroll} from '../hooks/usePreventBodyScroll.js';
import {ScrollMenu, VisibilityContext} from 'react-horizontal-scrolling-menu';
import {useNavigate, useParams, useSearchParams, NavLink} from "react-router-dom";
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import SkipNextIcon from '@mui/icons-material/SkipNext';

import {CourseLesson} from './CourseLesson';

interface CourseLessonListProps {
  entries: Array<any>;
  courseId: string;
  onSelect: (selected: any) => void;
}

export const CourseLessonList: React.FC<CourseLessonListProps> = (props) => {
  const {disableScroll, enableScroll} = usePreventBodyScroll();
  const [searchParams] = useSearchParams();

  const refRoot = useRef(null);
  useEffect(() => {
    if(refRoot.current) {
      const el = (refRoot.current as any).getElementsByClassName('react-horizontal-scrolling-menu--inner-wrapper')[0];
      el.style.position = 'relative';
      const elCont = (refRoot.current as any).getElementsByClassName('react-horizontal-scrolling-menu--scroll-container')[0];
      elCont.style.display = 'flex';
      elCont.style.overflow = 'hidden';
    }
  }, []);

  const handlerWheel = (apiObj: any, e: any): void => {
    const isThouchpad = Math.abs(e.deltaX) !== 0 || Math.abs(e.deltaY) < 15;
    if(isThouchpad) {
      e.stopPropagation();
      return;
    }
    if(e.deltaY < 0) {
      apiObj.scrollNext();
    } else if(e.deltaY > 0) {
      apiObj.scrollPrev();
    }
  }

  let orderLesson: number = (searchParams.get('lesson') as any) * 1;
  if(orderLesson < 1 || !Number.isInteger(orderLesson)) orderLesson = 1;
  if(orderLesson > props.entries.length) orderLesson = props.entries.length;

  useEffect(() => {
    props.onSelect.call(null, props.entries.filter((entry) => {return entry.order == orderLesson})[0] || null);
  }, [orderLesson]);

  return (<Box ref={refRoot}
       onMouseEnter={disableScroll}
       onMouseLeave={enableScroll}>
    <ScrollMenu LeftArrow={<LeftArrow size={'var(--scroll-menu-course-size)'}
                                      bgColor="text.primary"
                                      type={'side'}>
                             <SkipPreviousIcon color="warning"
                                               sx={{
                                                 width: 'var(--scroll-menu-course-icon-size)',
                                                 height: 'var(--scroll-menu-course-icon-size)'
                                               }} />
                           </LeftArrow>}
                RightArrow={<RightArrow size={'var(--scroll-menu-course-size)'}
                                        bgColor="text.primary"
                                        type={'side'}>
                              <SkipNextIcon color="warning"
                                            sx={{
                                              width: 'var(--scroll-menu-course-icon-size)',
                                              height: 'var(--scroll-menu-course-icon-size)'
                                            }} />
                            </RightArrow>}
                onWheel={handlerWheel}>
      {props.entries.map((entry: any, index: number) => {
        return (<CourseLesson key={entry.id}
                              itemId={entry.order}
                              courseId={props.courseId}
                              selected={orderLesson==entry.order}
                              duration={entry.duration}
                              image={entry.previewImageLink}
                              video={entry.link}
                              status={entry.status}
                              title={entry.title}
                              type={entry.type}
                              order={entry.order}
                              id={entry.id}/>);
      })}
    </ScrollMenu>
  </Box>);
}
