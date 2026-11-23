import prisma from './prismaClient.js';

export async function listCategories() {
  return prisma.actionCategories.findMany({ orderBy: { id: 'asc' } });
}

export async function createCategory({ id, name, type }) {
  return prisma.actionCategories.create({ data: { id, name, type } });
}

export async function findCategoryByNameOrId(name, id) {
  const or = [];
  if (name != null && String(name).length) or.push({ name });
  if (id != null && String(id).length) or.push({ id });
  if (!or.length) return null;
  return prisma.actionCategories.findFirst({ where: { OR: or } });
}

export async function deleteCategoriesByNameOrId(name, id) {
  const or = [];
  if (name?.trim()) or.push({ name });
  if (id) or.push({ id });
  if (!or.length) return { count: 0 };
  return prisma.actionCategories.deleteMany({ where: { OR: or } });
}

export async function deleteAllCategories() {
  return prisma.actionCategories.deleteMany();
}
