import { rootRoute } from './rootRoute';
import {
  authRoute,
  loginRoute,
  signupRoute,
  protectedRoute,
  indexRoute,
  createPageRoute,
  diariesRoute,
  diaryDetailRoute,
  parallelDetailRoute,
  analysisRoute,
} from './routes';

export const routeTree = rootRoute.addChildren([
  authRoute.addChildren([
    loginRoute,
    signupRoute,
  ]),
  protectedRoute.addChildren([
    indexRoute,
    createPageRoute,
    diariesRoute,
    diaryDetailRoute,
    parallelDetailRoute,
    analysisRoute,
  ]),
]);


