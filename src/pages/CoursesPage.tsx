import * as React from 'react';
import {Box} from '@mui/material';

import {Courses} from '../components/Courses';
import {Header} from '../components/Header';
import {Footer} from '../components/Footer';

export interface CoursesPageProps {}

export const CoursesPage: React.FC<CoursesPageProps> = () => {
  return (<Box>
    <Header />
    <Courses />
    <Footer />
  </Box>);
}
