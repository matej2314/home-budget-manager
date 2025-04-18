import { type User } from "@models/authTypes";

export const mateOrHostRole = (user: User) => user?.role === 'mate' || user?.role === 'host';
export const isUserRole = (user: User) => user?.role === 'user';
export const isHostRole = (user: User) => user?.role === 'host';