import { prisma } from '@/lib/prisma'

// Global test setup
beforeAll(async () => {
  // Ensure we're using a test database
  if (!process.env.DATABASE_URL?.includes('test')) {
    throw new Error('Tests must run against a test database')
  }
  
  // TODO: Add any global setup here (e.g., seed test data)
})

// Clean up after all tests
afterAll(async () => {
  await prisma.$disconnect()
})

// Clean up before each test
beforeEach(async () => {
  // TODO: Add any setup needed before each test
})

// Clean up after each test
afterEach(async () => {
  // Clean up database after each test
  const tablenames = await prisma.$queryRaw<Array<{ tablename: string }>>`
    SELECT tablename FROM pg_tables WHERE schemaname='public'
  `
  
  const tables = tablenames
    .map(({ tablename }) => tablename)
    .filter((name) => name !== '_prisma_migrations')
    .map((name) => `"public"."${name}"`)
    .join(', ')

  try {
    if (tables.length > 0) {
      await prisma.$executeRawUnsafe(`TRUNCATE TABLE ${tables} CASCADE;`)
    }
  } catch (error) {
    console.log({ error })
  }
})
