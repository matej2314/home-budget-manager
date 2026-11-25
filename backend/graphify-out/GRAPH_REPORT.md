# Graph Report - backend  (2026-11-25)

## Corpus Check
- 179 files · ~82,209 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 8 file(s) not represented in the graph (top: (none) 3, .traineddata 2, .example 1)

## Summary
- 604 nodes · 1732 edges · 25 communities (19 shown, 5 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 24 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `4dd94e1b`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- AppError
- index.js
- transactions.js
- addNewMonthlyBudget.js
- logger.js
- getBoardData.js
- registerUser.js
- homePageDataCollection.js
- package.json
- dependencies
- seed-demo.js
- websocketConfig.js
- notifications.js
- app.js
- checkUserHouse
- scripts
- swaggerConfig.js
- devDependencies
- prismaClient.js
- jest.config.js
- services-layout.test.js
- scoped-phases-inventory.test.js
- engines
- prisma

## God Nodes (most connected - your core abstractions)
1. `AppError` - 104 edges
2. `runController()` - 59 edges
3. `logger` - 58 edges
4. `checkUserHouse()` - 26 edges
5. `emitNotification()` - 20 edges
6. `express` - 19 edges
7. `uuid` - 19 edges
8. `verifyJWT()` - 17 edges
9. `getBoardData()` - 17 edges
10. `prisma` - 16 edges

## Surprising Connections (you probably didn't know these)
- `createTestApp()` --calls--> `createApp()`  [EXTRACTED]
  tests/helpers/httpAgent.js → app.js
- `initializeWebSocket()` --indirect_call--> `authMiddleware()`  [INFERRED]
  configs/websocketConfig.js → middlewares/websocket/authMiddleware.js
- `broadcastMessage()` --calls--> `findConnectionByUserId()`  [EXTRACTED]
  configs/websocketConfig.js → database/sockets.js
- `sendNewMessage()` --calls--> `broadcastMessage()`  [EXTRACTED]
  services/messages/sendNewMessage.js → configs/websocketConfig.js
- `liveUpdateBalance()` --calls--> `broadcastMessage()`  [EXTRACTED]
  utils/householdUtils/liveUpdateBalance.js → configs/websocketConfig.js

## Import Cycles
- None detected.

## Communities (25 total, 5 thin omitted)

### Community 0 - "AppError"
Cohesion: 0.06
Nodes (54): extractPhotoData(), addAvatarHandler(), deleteAvatarHandler(), getAvatar(), setCookieValue(), setTourValue(), saveImagesHandler(), addTechnology() (+46 more)

### Community 1 - "index.js"
Cohesion: 0.08
Nodes (36): createUserDirectory(), __dirname, __filename, deleteFiles(), __dirname, __filename, sessionRequired, verifyJWT() (+28 more)

### Community 2 - "transactions.js"
Cohesion: 0.10
Nodes (28): addNewAction(), deleteAction(), getAllActions(), getHouseActions(), createTransactionWithBalanceUpdate(), deleteTransactionWithBalanceUpdate(), findTransactionByTransactionId(), listAllTransactions() (+20 more)

### Community 3 - "addNewMonthlyBudget.js"
Cohesion: 0.09
Nodes (29): addNewMonthlyBudgetHandler(), latestInitialBudgetValue(), listAddedAtByHouse(), updateInitialBudgetByHouse(), getBalanceFields(), listHouseholdsForMonthlyBalance(), updateInitBudget(), createDailyBudget() (+21 more)

### Community 4 - "logger.js"
Cohesion: 0.11
Nodes (31): logFormat, logger, createHousehold(), deleteHousehold(), findHouseholdByName(), listInmates(), deleteTransactionsByHouseId(), clearHouseIdForHouse() (+23 more)

### Community 5 - "getBoardData.js"
Cohesion: 0.13
Nodes (26): actionCatCollection(), addNewActionCat(), deleteActionCat(), getBoardDataHandler(), countMessagesForUser(), getDailyBoardData(), getHouseBoardData(), getInmatesBoardData() (+18 more)

### Community 6 - "registerUser.js"
Cohesion: 0.20
Nodes (14): jwtCookieOptions, loginUserHandler(), logoutUserHandler(), registerUserHandler(), createHouseholdUserRow(), createUser(), findSuperadmin(), findUserByEmail() (+6 more)

### Community 7 - "homePageDataCollection.js"
Cohesion: 0.19
Nodes (14): getDataCollection(), addReviewHandler(), getReviewsCollectionHandler(), createReview(), listReviews(), listTechnologies(), getHomePageCollection(), mapReviewRow() (+6 more)

### Community 8 - "package.json"
Cohesion: 0.10
Nodes (19): author, description, license, main, name, type, version, dotenv (+11 more)

### Community 9 - "dependencies"
Cohesion: 0.09
Nodes (23): dependencies, bcrypt, cookie, cookie-parser, cors, dotenv, express, helmet (+15 more)

### Community 10 - "seed-demo.js"
Cohesion: 0.11
Nodes (19): categoriesPath, CAT, categoriesPath, DEMO_NOTICE_DATA, __dirname, ensureCategories(), HOST, INMATE (+11 more)

### Community 11 - "websocketConfig.js"
Cohesion: 0.17
Nodes (14): allowedOrigins, broadcastToHousehold(), initializeWebSocket(), listMemberUserIds(), clearAllConnections(), deleteConnectionByUserId(), findConnectionByUserId(), listConnectionIdsByUserIds() (+6 more)

### Community 12 - "notifications.js"
Cohesion: 0.18
Nodes (12): deleteNotification(), GetNoticesCollection(), createNotification(), deleteNotification(), findNotificationById(), listNotificationsByHouse(), deleteNotification(), getNoticesCollection() (+4 more)

### Community 13 - "app.js"
Cohesion: 0.22
Nodes (10): createApp(), __dirname, __filename, swaggerDocs(), cookie-parser, cors, helmet, jsonwebtoken (+2 more)

### Community 14 - "checkUserHouse"
Cohesion: 0.11
Nodes (26): getMailTransporter(), broadcastMessage(), acceptInvitationHandler(), getInvitationsCollectionHandler(), rejectInvitationHandler(), findHostUserId(), findHouseholdUserRow(), createInvitation() (+18 more)

### Community 15 - "scripts"
Cohesion: 0.14
Nodes (14): scripts, dev, lint, posttest:e2e, pretest:e2e, prisma:generate, prisma:migrate:deploy, prisma:seed (+6 more)

### Community 16 - "swaggerConfig.js"
Cohesion: 0.29
Nodes (6): __dirname, __filename, swaggerOptions, swaggerSpec, swagger-jsdoc, swagger-ui-express

### Community 17 - "devDependencies"
Cohesion: 0.29
Nodes (7): devDependencies, eslint, @eslint/js, globals, jest, nodemon, supertest

### Community 18 - "prismaClient.js"
Cohesion: 0.19
Nodes (17): resetMailTransporterForTests(), setMailTransporterForTests(), prisma, nodemailer, categoriesPath, __dirname, ensureSeedCategories(), prepareE2eDatabase() (+9 more)

## Knowledge Gaps
- **105 isolated node(s):** `__filename`, `__dirname`, `logFormat`, `__filename`, `__dirname` (+100 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 132 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `AppError` connect `AppError` to `transactions.js`, `addNewMonthlyBudget.js`, `logger.js`, `getBoardData.js`, `registerUser.js`, `homePageDataCollection.js`, `notifications.js`, `checkUserHouse`?**
  _High betweenness centrality (0.159) - this node is a cross-community bridge._
- **Why does `logger` connect `logger.js` to `AppError`, `index.js`, `transactions.js`, `addNewMonthlyBudget.js`, `getBoardData.js`, `registerUser.js`, `homePageDataCollection.js`, `package.json`, `websocketConfig.js`, `notifications.js`, `checkUserHouse`?**
  _High betweenness centrality (0.092) - this node is a cross-community bridge._
- **Why does `uuid` connect `transactions.js` to `AppError`, `addNewMonthlyBudget.js`, `logger.js`, `getBoardData.js`, `registerUser.js`, `homePageDataCollection.js`, `package.json`, `websocketConfig.js`, `checkUserHouse`?**
  _High betweenness centrality (0.086) - this node is a cross-community bridge._
- **What connects `__filename`, `__dirname`, `logFormat` to the rest of the system?**
  _105 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `AppError` be split into smaller, more focused modules?**
  _Cohesion score 0.06210670314637483 - nodes in this community are weakly interconnected._
- **Should `index.js` be split into smaller, more focused modules?**
  _Cohesion score 0.08090957165520889 - nodes in this community are weakly interconnected._
- **Should `transactions.js` be split into smaller, more focused modules?**
  _Cohesion score 0.09758454106280193 - nodes in this community are weakly interconnected._