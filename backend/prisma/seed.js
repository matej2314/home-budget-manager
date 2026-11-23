import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PrismaClient } from '@prisma/client';

/**
 * Seed startowy: actionCategories + technologies z dumpa produkcyjnego (stałe UUID).
 * Idempotentny — nie nadpisuje rekordów dodanych później.
 * Nie uruchamiać jako krok deployu produkcyjnego (D-16).
 */
const prisma = new PrismaClient();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const categoriesPath = path.join(__dirname, 'data', 'actionCategories.json');
const technologiesPath = path.join(__dirname, 'data', 'technologies.json');

async function main() {
  const categories = JSON.parse(readFileSync(categoriesPath, 'utf8'));
  const technologies = JSON.parse(readFileSync(technologiesPath, 'utf8'));

  const categoriesResult = await prisma.actionCategories.createMany({
    data: categories,
    skipDuplicates: true,
  });

  console.log(
    `Seed actionCategories: inserted ${categoriesResult.count} (of ${categories.length}; existing skipped).`,
  );

  const technologiesResult = await prisma.technologies.createMany({
    data: technologies,
    skipDuplicates: true,
  });

  console.log(
    `Seed technologies: inserted ${technologiesResult.count} (of ${technologies.length}; existing skipped).`,
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
