import authRoutes from './authRoutes.js';
import usersRoutes from './usersRoutes.js';
import householdRoutes from './householdRoutes.js';
import transactionsRoutes from './transactionsRoutes.js';
import dashboardRoutes from './dashboardRoutes.js';
import actionCatRoutes from './actionCatRoutes.js';
import messagesRoutes from './messagesRoutes.js';
import initialMonthlyBudgetsRoutes from './initialMonthlyBudgetsRoutes.js';
import receiptRoutes from './receiptRoutes.js';
import homePageDataRoutes from './homePageDataRoutes.js';
import noticeRoutes from './noticeRoutes.js';
import galleryRoutes from './galleryRoutes.js';
import avatarsRoutes from './avatarsRoutes.js';
import invitationRoutes from './invitationRoutes.js';
import cookiesTourRoutes from './cookiesTourRoutes.js';
import reviewsRoutes from './reviewsRoutes.js';

const routes = [
  { path: '/auth', router: authRoutes },
  { path: '/users', router: usersRoutes },
  { path: '/house', router: householdRoutes },
  { path: '/action', router: transactionsRoutes },
  { path: '/board', router: dashboardRoutes },
  { path: '/actioncat', router: actionCatRoutes },
  { path: '/message', router: messagesRoutes },
  { path: '/initmonthly', router: initialMonthlyBudgetsRoutes },
  { path: '/receipt', router: receiptRoutes },
  { path: '/homepage', router: homePageDataRoutes },
  { path: '/notice', router: noticeRoutes },
  { path: '/gallery', router: galleryRoutes },
  { path: '/avatars', router: avatarsRoutes },
  { path: '/invitation', router: invitationRoutes },
  { path: '/cookiestour', router: cookiesTourRoutes },
  { path: '/reviews', router: reviewsRoutes },
];

export default function setupRoutes(app) {
  for (const { path, router } of routes) {
    app.use(path, router);
  }
}
