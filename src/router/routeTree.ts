import { rootRoute } from './rootRoute';
import {
  authRoute,
  loginRoute,
  signupRoute,
  protectedRoute,
  indexRoute,
  createPageRoute,
  diariesRoute,
  diaryDetailLayoutRoute,
  diaryDetailRoute,
  parallelDetailRoute,
  analysisRoute,
  bucketListRoute,
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
    diaryDetailLayoutRoute,
    diaryDetailRoute,
    parallelDetailRoute,
    analysisRoute,
    bucketListRoute,
  ]),
]);


