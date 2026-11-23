import prisma from './prismaClient.js';

export async function listTechnologies() {
  return prisma.technologies.findMany();
}

export async function createTechnology(data) {
  return prisma.technologies.create({ data });
}

export async function listReviews() {
  return prisma.usersReviews.findMany({ orderBy: { date: 'desc' } });
}

export async function createReview(data) {
  return prisma.usersReviews.create({ data });
}
