# Graph Report - backend  (2026-11-24)

## Corpus Check
- 155 files · ~74,269 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 8 file(s) not represented in the graph (top: (none) 3, .traineddata 2, .example 1)

## Summary
- 547 nodes · 1578 edges · 22 communities (18 shown, 3 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 24 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `65a62f4b`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- AppError
- index.js
- logger.js
- addNewMonthlyBudget.js
- households.js
- getBoardData.js
- registerUser.js
- homePageDataCollection.js
- package.json
- dependencies
- seed-demo.js
- websocketConfig.js
- checkUserHouse
- app.js
- avatarController.js
- scripts
- swaggerConfig.js
- devDependencies
- mailTransport.js
- jest.config.js
- services-layout.test.js

## God Nodes (most connected - your core abstractions)
1. `AppError` - 104 edges
2. `runController()` - 59 edges
3. `logger` - 57 edges
4. `checkUserHouse()` - 26 edges
5. `express` - 19 edges
6. `uuid` - 19 edges
7. `emitNotification()` - 18 edges
8. `verifyJWT()` - 17 edges
9. `getBoardData()` - 17 edges
10. `prisma` - 14 edges

## Surprising Connections (you probably didn't know these)
- `initializeWebSocket()` --indirect_call--> `authMiddleware()`  [INFERRED]
  configs/websocketConfig.js → middlewares/websocket/authMiddleware.js
- `broadcastMessage()` --calls--> `findConnectionByUserId()`  [EXTRACTED]
  configs/websocketConfig.js → database/sockets.js
- `liveUpdateBalance()` --calls--> `broadcastMessage()`  [EXTRACTED]
  utils/householdUtils/liveUpdateBalance.js → configs/websocketConfig.js
- `emitNotification()` --calls--> `broadcastToHousehold()`  [EXTRACTED]
  services/notifications/emitNotification.js → configs/websocketConfig.js
- `liveUpdateBalance()` --calls--> `broadcastToHousehold()`  [EXTRACTED]
  utils/householdUtils/liveUpdateBalance.js → configs/websocketConfig.js

## Import Cycles
- None detected.

## Communities (22 total, 3 thin omitted)

### Community 0 - "AppError"
Cohesion: 0.07
Nodes (46): jwtCookieOptions, extractPhotoData(), broadcastMessage(), setCookieValue(), setTourValue(), saveImagesHandler(), addNewHouse(), deleteHouse() (+38 more)

### Community 1 - "index.js"
Cohesion: 0.07
Nodes (41): updateAvatarName(), createUserDirectory(), __dirname, __filename, deleteFiles(), __dirname, __filename, sessionRequired (+33 more)

### Community 2 - "logger.js"
Cohesion: 0.10
Nodes (34): logFormat, logger, acceptInvitationHandler(), getInvitationsCollectionHandler(), rejectInvitationHandler(), addNewAction(), deleteAction(), getAllActions() (+26 more)

### Community 3 - "addNewMonthlyBudget.js"
Cohesion: 0.09
Nodes (31): addNewMonthlyBudgetHandler(), latestInitialBudgetValue(), listAddedAtByHouse(), updateInitialBudgetByHouse(), getBalanceFields(), listHouseholdsForMonthlyBalance(), updateInitBudget(), prisma (+23 more)

### Community 4 - "households.js"
Cohesion: 0.15
Nodes (26): deleteUser(), createHousehold(), deleteHousehold(), findHostUserId(), findHouseholdByName(), listInmates(), deleteTransactionsByHouseId(), clearHouseIdForHouse() (+18 more)

### Community 5 - "getBoardData.js"
Cohesion: 0.12
Nodes (26): actionCatCollection(), addNewActionCat(), deleteActionCat(), getBoardDataHandler(), countMessagesForUser(), getDailyBoardData(), getHouseBoardData(), getInmatesBoardData() (+18 more)

### Community 6 - "registerUser.js"
Cohesion: 0.13
Nodes (20): loginUserHandler(), logoutUserHandler(), registerUserHandler(), createHouseholdUserRow(), createUser(), findSuperadmin(), findUserByEmail(), updateUserEmail() (+12 more)

### Community 7 - "homePageDataCollection.js"
Cohesion: 0.16
Nodes (17): addTechnology(), getDataCollection(), addReviewHandler(), getReviewsCollectionHandler(), createReview(), createTechnology(), listReviews(), listTechnologies() (+9 more)

### Community 8 - "package.json"
Cohesion: 0.09
Nodes (21): author, description, engines, node, license, main, name, prisma (+13 more)

### Community 9 - "dependencies"
Cohesion: 0.09
Nodes (23): dependencies, bcrypt, cookie, cookie-parser, cors, dotenv, express, helmet (+15 more)

### Community 10 - "seed-demo.js"
Cohesion: 0.10
Nodes (20): categoriesPath, CAT, categoriesPath, DEMO_NOTICE_DATA, __dirname, ensureCategories(), HOST, INMATE (+12 more)

### Community 11 - "websocketConfig.js"
Cohesion: 0.18
Nodes (14): broadcastToHousehold(), initializeWebSocket(), listMemberUserIds(), clearAllConnections(), deleteConnectionByUserId(), findConnectionByUserId(), listConnectionIdsByUserIds(), saveConnection() (+6 more)

### Community 12 - "checkUserHouse"
Cohesion: 0.23
Nodes (13): deleteNotification(), GetNoticesCollection(), findHouseholdById(), findHouseholdUserRow(), deleteNotification(), findNotificationById(), listNotificationsByHouse(), formatCreatedAt() (+5 more)

### Community 13 - "app.js"
Cohesion: 0.21
Nodes (10): createApp(), __dirname, __filename, allowedOrigins, swaggerDocs(), cookie-parser, cors, helmet (+2 more)

### Community 14 - "avatarController.js"
Cohesion: 0.26
Nodes (8): addAvatarHandler(), deleteAvatarHandler(), getAvatar(), addAvatar(), deleteAvatar(), __dirname, __filename, resolveAvatarPath()

### Community 15 - "scripts"
Cohesion: 0.20
Nodes (10): scripts, dev, lint, prisma:generate, prisma:migrate:deploy, prisma:seed, prisma:seed:demo, prisma:studio (+2 more)

### Community 16 - "swaggerConfig.js"
Cohesion: 0.29
Nodes (6): __dirname, __filename, swaggerOptions, swaggerSpec, swagger-jsdoc, swagger-ui-express

### Community 17 - "devDependencies"
Cohesion: 0.29
Nodes (7): devDependencies, eslint, @eslint/js, globals, jest, nodemon, supertest

## Knowledge Gaps
- **96 isolated node(s):** `__filename`, `__dirname`, `logFormat`, `__filename`, `__dirname` (+91 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 119 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `AppError` connect `AppError` to `logger.js`, `addNewMonthlyBudget.js`, `households.js`, `getBoardData.js`, `registerUser.js`, `homePageDataCollection.js`, `checkUserHouse`, `avatarController.js`?**
  _High betweenness centrality (0.177) - this node is a cross-community bridge._
- **Why does `logger` connect `logger.js` to `AppError`, `index.js`, `addNewMonthlyBudget.js`, `households.js`, `getBoardData.js`, `registerUser.js`, `homePageDataCollection.js`, `websocketConfig.js`, `checkUserHouse`?**
  _High betweenness centrality (0.094) - this node is a cross-community bridge._
- **Why does `uuid` connect `logger.js` to `AppError`, `addNewMonthlyBudget.js`, `households.js`, `getBoardData.js`, `registerUser.js`, `homePageDataCollection.js`, `package.json`, `websocketConfig.js`?**
  _High betweenness centrality (0.093) - this node is a cross-community bridge._
- **What connects `__filename`, `__dirname`, `logFormat` to the rest of the system?**
  _96 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `AppError` be split into smaller, more focused modules?**
  _Cohesion score 0.06961770623742455 - nodes in this community are weakly interconnected._
- **Should `index.js` be split into smaller, more focused modules?**
  _Cohesion score 0.06947996589940324 - nodes in this community are weakly interconnected._
- **Should `logger.js` be split into smaller, more focused modules?**
  _Cohesion score 0.10463659147869674 - nodes in this community are weakly interconnected._