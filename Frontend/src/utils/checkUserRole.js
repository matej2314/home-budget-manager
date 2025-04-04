export const mateOrHostRole = (user) => user?.role === "mate" || user?.role === "host";
export const isUserRole = (user) => user?.role === "user";
export const isHostRole = (user) => user?.role === 'host';