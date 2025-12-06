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
  activityDetailRoute,
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
    diaryDetailLayoutRoute.addChildren([
      diaryDetailRoute,
      parallelDetailRoute,
    ]),
    analysisRoute,
    bucketListRoute,
    activityDetailRoute,
  ]),
]);


