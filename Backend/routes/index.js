const routes = [
    { path: '/auth', file: 'authRoutes.js' },
    { path: '/users', file: 'usersRoutes.js' },
    { path: '/house', file: 'householdRoutes.js' },
    { path: '/action', file: 'transactionsRoutes.js' },
    { path: '/board', file: 'dashboardRoutes.js' },
    { path: '/actioncat', file: 'actionCatRoutes.js' },
    { path: '/message', file: 'messagesRoutes.js' },
    { path: '/initmonthly', file: 'initialMonthlyBudgetsRoutes.js' },
    { path: '/receipt', file: 'receiptRoutes.js' },
    { path: '/homepage', file: 'homePageDataRoutes.js' },
    { path: '/notice', file: 'noticeRoutes.js' },
    { path: '/gallery', file: './galleryRoutes.js' },
    { path: '/avatars', file: 'avatarsRoutes.js' },
    { path: '/invitation', file: 'invitationRoutes.js' },
    { path: '/cookiestour', file: 'cookiesTourRoutes.js' },
    { path: '/reviews', file: 'reviewsRoutes.js' },
];

const setupRoutes = (app) => {
    routes.forEach(({ path, file }) => {
        const route = require(`./${file}`);
        app.use(path, route);
    });
};

module.exports = setupRoutes;