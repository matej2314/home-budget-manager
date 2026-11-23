import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis;

export const prisma = globalForPrisma._hbmPrisma ?? new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] :  ['error'],
});

if(process.env.NODE_ENV !== 'production') {
    globalForPrisma._hbmPrisma = prisma;
}

export default prisma;