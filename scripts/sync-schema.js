#!/usr/bin/env node

/**
 * This script synchronizes the Prisma schema with the TypeScript types.
 * It uses the Prisma JSON schema output to generate TypeScript types.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Paths
const PRISMA_SCHEMA_PATH = path.join(__dirname, '../apps/backend/prisma/schema.prisma');
const SHARED_TYPES_PATH = path.join(__dirname, '../packages/shared-types/src/prisma-types.ts');

// Generate JSON schema from Prisma
console.log('Generating JSON schema from Prisma...');
try {
  execSync('npx prisma generate --schema=' + PRISMA_SCHEMA_PATH);
  console.log('JSON schema generated successfully.');
} catch (error) {
  console.error('Error generating JSON schema:', error);
  process.exit(1);
}

// Generate TypeScript header
const header = `// THIS FILE IS AUTO-GENERATED. DO NOT EDIT DIRECTLY.
// Generated on ${new Date().toISOString()}
// Run 'pnpm sync-schema' to regenerate

`;

// Generate TypeScript types from Prisma schema
console.log('Generating TypeScript types from Prisma schema...');
try {
  const types = execSync('npx prisma-json-schema-generator --schema=' + PRISMA_SCHEMA_PATH)
    .toString()
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n');

  // Export the models
  const modelsExport = `
// Export Prisma model types
export type { User, SocialAccount, Post, Analytics, Notification, MediaFile, Team, TeamMember, UserSettings, RefreshToken, DeviceToken } from '@prisma/client';
`;

  fs.writeFileSync(SHARED_TYPES_PATH, header + modelsExport);
  console.log('TypeScript types generated successfully.');
} catch (error) {
  console.error('Error generating TypeScript types:', error);
  process.exit(1);
}

console.log('Schema synchronization complete!');
