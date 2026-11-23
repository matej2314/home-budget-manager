let boardRefreshHandler = null;

export const registerBoardRefresh = (fn) => {
  boardRefreshHandler = fn;
};

export const notifyBoardRefresh = (filter = 'all') => {
  boardRefreshHandler?.(filter);
};
