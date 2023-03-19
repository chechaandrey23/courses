import * as React from 'react';
import {Box} from '@mui/material';

import {Course} from '../components/Course';
import {Header} from '../components/Header';
import {Footer} from '../components/Footer';

export interface CoursePageProps {}

export const CoursePage: React.FC<CoursePageProps> = () => {
  return (<Box>
    <Header />
    <Course />
    <Footer />
  </Box>);
}
