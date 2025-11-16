import { createRoute } from '@tanstack/react-router'
import { rootRoute } from './rootRoute'
import HomePage from '../pages/HomePage'

export const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
})


