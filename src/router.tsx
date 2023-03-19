import {CoursesPage} from './pages/CoursesPage';
import {ErrorPage} from './pages/ErrorPage';
import {CoursePage} from './pages/CoursePage';

export const router = [
  {
    path: "/",
    element: <CoursesPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/courses",
    element: <CoursesPage />
  },
  {
    path: '/course/:courseId',
    element: <CoursePage />
  },
];
