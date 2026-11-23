// UX only — authz = API (F-15); porównania roli z sesji, nie lokalny ACL.
export const inmateOrHostRole = (user) =>
  user?.role === 'inmate' || user?.role === 'host';
export const isUserRole = (user) => user?.role === 'user';
export const isHostRole = (user) => user?.role === 'host';
export const isInmateRole = (user) => user?.role === 'inmate';
