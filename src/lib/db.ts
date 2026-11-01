import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
  prismaSchemaVersion?: string;
};

// Bump this whenever the Prisma schema changes so hot reload drops a stale client.
const PRISMA_SCHEMA_VERSION = "offer-banner-v2";

if (globalForPrisma.prismaSchemaVersion !== PRISMA_SCHEMA_VERSION) {
  void globalForPrisma.prisma?.$disconnect();
  globalForPrisma.prisma = undefined;
  globalForPrisma.prismaSchemaVersion = PRISMA_SCHEMA_VERSION;
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
