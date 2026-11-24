/**
 * Env Jest przed importami app/prisma (T-8, T-9).
 * Nie ładujemy dotenv z .env deweloperskiego — unika przypadkowego prod/demo URL.
 */

function resolveTestDatabaseUrl() {
  if (process.env.TEST_DATABASE_URL) {
    return process.env.TEST_DATABASE_URL;
  }
  // Domyślnie kontener z docker-compose.db.test.yml (port 3307).
  return 'mysql://budget_user:budget_password@127.0.0.1:3307/home_budget_test';
}

function assertTestDatabaseName(databaseUrl) {
  let dbName;
  try {
    dbName = decodeURIComponent(new URL(databaseUrl).pathname.replace(/^\//, ''));
  } catch {
    throw new Error('Invalid TEST_DATABASE_URL / DATABASE_URL for Jest (T-8).');
  }
  if (!dbName || !dbName.endsWith('_test')) {
    throw new Error(
      `Refusing Jest against non-test database "${dbName}". Name must end with _test (T-8).`,
    );
  }
}

process.env.JWT_SECRET ??= 'test-secret-for-jest';
process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = resolveTestDatabaseUrl();
assertTestDatabaseName(process.env.DATABASE_URL);

// K-13 / T-9: E2E nie wolno wieszać na prawdziwym SMTP z shell/.env (no-op mail).
delete process.env.SMTP_HOST;
delete process.env.SMTP_USER;
delete process.env.SMTP_PASSWORD;
