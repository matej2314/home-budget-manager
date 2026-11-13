# Graph Report - frontend  (2026-11-13)

## Corpus Check
- 156 files · ~26,670 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 5 file(s) not represented in the graph (top: (none) 3, .conf 1, .css 1)

## Summary
- 384 nodes · 1488 edges · 17 communities (14 shown, 2 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 13 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `81672f32`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- showInfoToast
- react
- routerConfig.jsx
- HomePageMenu.jsx
- react-i18next
- MessagesList.jsx
- dependencies
- package.json
- FastActionsSection.jsx
- devDependencies
- App.jsx
- i18n.js
- scripts
- vite.config.js
- README.md
- imagesArray.js

## God Nodes (most connected - your core abstractions)
1. `react-i18next` - 65 edges
2. `react` - 55 edges
3. `showInfoToast()` - 40 edges
4. `showErrorToast()` - 37 edges
5. `useIsMobile()` - 35 edges
6. `sendRequest()` - 30 edges
7. `@iconify/react` - 28 edges
8. `useDocumentTitle()` - 27 edges
9. `serverUrl` - 25 edges
10. `useApiResponseHandler()` - 23 edges

## Surprising Connections (you probably didn't know these)
- `FastActions()` --indirect_call--> `AddReviewModal()`  [INFERRED]
  src/components/dashboard/dashboard-internal-components/FastActionsSection.jsx → src/components/modals/AddReviewModal.jsx
- `FastActions()` --indirect_call--> `ChangeEmailModal()`  [INFERRED]
  src/components/dashboard/dashboard-internal-components/FastActionsSection.jsx → src/components/modals/ChangeEmailModal.jsx
- `FastActions()` --indirect_call--> `CookiesModal()`  [INFERRED]
  src/components/dashboard/dashboard-internal-components/FastActionsSection.jsx → src/components/modals/CookiesModal.jsx
- `FastActions()` --indirect_call--> `showInfoToast()`  [INFERRED]
  src/components/dashboard/dashboard-internal-components/FastActionsSection.jsx → src/configs/toastify.jsx
- `MessagesList()` --indirect_call--> `DeleteMessageModal()`  [INFERRED]
  src/components/dashboard/dashboard-internal-components/MessagesList.jsx → src/components/modals/messagesModals/messagesModals.jsx

## Import Cycles
- None detected.

## Communities (17 total, 2 thin omitted)

### Community 0 - "showInfoToast"
Cohesion: 0.17
Nodes (33): @iconify/react, AddTransactionForm(), AddUserToHouseForm(), ContactForm(), DeclareBudgetForm(), SubmitBtn(), LoginForm(), SendMessageForm() (+25 more)

### Community 1 - "react"
Cohesion: 0.10
Nodes (30): react, HeaderIconsContainer(), NotificationDot(), NotificationsContainer(), DashBoardMenu(), DisplayLiveBalance(), MonthlyBudget(), showMessageToast() (+22 more)

### Community 2 - "routerConfig.jsx"
Cohesion: 0.12
Nodes (25): DashBoard(), CustomAvatarInput, MatesList(), TransactionsList(), DashboardHeader(), DisplayMatesList(), LastTransactionsList(), CalendarModal() (+17 more)

### Community 3 - "HomePageMenu.jsx"
Cohesion: 0.10
Nodes (28): framer-motion, zustand, OpenMenuButton(), SendMessageBtn(), Authorization(), formMapping, Home(), HomePageMenu() (+20 more)

### Community 4 - "react-i18next"
Cohesion: 0.14
Nodes (22): chart.js, react-chartjs-2, react-i18next, BarChart(), LineChart(), BasicHouseInfo(), MostActiveMates(), BalanceBudgetComparison() (+14 more)

### Community 5 - "MessagesList.jsx"
Cohesion: 0.11
Nodes (21): react-responsive, react-router-dom, react-stars, MessagesFilterBtns(), MessagesList(), MessagesCounter(), ReviewsSection(), DisplayMessageDetails() (+13 more)

### Community 6 - "dependencies"
Cohesion: 0.10
Nodes (21): dependencies, chart.js, framer-motion, i18next, i18next-browser-languagedetector, i18next-http-backend, @iconify/react, moment (+13 more)

### Community 7 - "package.json"
Cohesion: 0.14
Nodes (16): name, private, type, version, eslint, @eslint/js, eslint-plugin-react, eslint-plugin-react-hooks (+8 more)

### Community 8 - "FastActionsSection.jsx"
Cohesion: 0.23
Nodes (10): react-modal, FastActions(), ModalComponent(), AddTransactionModal(), AddUserToHouseModal(), DeclareBudgetModal(), SendMessageModal(), dashboardBtnsArray (+2 more)

### Community 9 - "devDependencies"
Cohesion: 0.15
Nodes (13): devDependencies, eslint, @eslint/js, eslint-plugin-react, eslint-plugin-react-hooks, eslint-plugin-react-refresh, globals, tailwindcss (+5 more)

### Community 10 - "App.jsx"
Cohesion: 0.24
Nodes (6): react-toastify, App(), BackToUsMessage(), routes, ThemeContext, ThemeProvider()

### Community 11 - "i18n.js"
Cohesion: 0.20
Nodes (8): i18next, i18next-browser-languagedetector, i18next-http-backend, moment, react-big-calendar, localizer, savedLanguage, getLocalStorage()

### Community 12 - "scripts"
Cohesion: 0.40
Nodes (5): scripts, build, dev, lint, preview

### Community 13 - "vite.config.js"
Cohesion: 0.50
Nodes (3): @tailwindcss/vite, vite, @vitejs/plugin-react

## Knowledge Gaps
- **52 isolated node(s):** `name`, `private`, `version`, `type`, `dev` (+47 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 60 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react-i18next` connect `react-i18next` to `showInfoToast`, `react`, `routerConfig.jsx`, `HomePageMenu.jsx`, `MessagesList.jsx`, `package.json`, `FastActionsSection.jsx`, `App.jsx`, `i18n.js`?**
  _High betweenness centrality (0.206) - this node is a cross-community bridge._
- **Why does `react` connect `react` to `showInfoToast`, `routerConfig.jsx`, `HomePageMenu.jsx`, `react-i18next`, `MessagesList.jsx`, `package.json`, `FastActionsSection.jsx`, `App.jsx`?**
  _High betweenness centrality (0.168) - this node is a cross-community bridge._
- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.100) - this node is a cross-community bridge._
- **What connects `name`, `private`, `version` to the rest of the system?**
  _52 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `react` be split into smaller, more focused modules?**
  _Cohesion score 0.10285714285714286 - nodes in this community are weakly interconnected._
- **Should `routerConfig.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.12270531400966184 - nodes in this community are weakly interconnected._
- **Should `HomePageMenu.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.09513742071881606 - nodes in this community are weakly interconnected._