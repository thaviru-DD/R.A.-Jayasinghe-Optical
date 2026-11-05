import { PrismaClient } from "@prisma/client";
import { PrismaLibSQL } from "@prisma/adapter-libsql";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
  prismaSchemaVersion?: string;
};

const PRISMA_SCHEMA_VERSION = "turso-v1";

function requireTursoEnv() {
  const url = process.env.TURSO_DATABASE_URL?.trim() ?? "";
  const authToken = process.env.TURSO_AUTH_TOKEN?.trim() ?? "";

  if (!url || !authToken) {
    throw new Error(
      "Database is not configured. Set TURSO_DATABASE_URL and TURSO_AUTH_TOKEN (see .env.example).",
    );
  }

  const placeholders = new Set(["[SENSITIVE]", "SENSITIVE", "PLACEHOLDER", "your-turso-auth-token"]);
  if (
    placeholders.has(url) ||
    placeholders.has(authToken) ||
    url.includes("your-db") ||
    !url.startsWith("libsql://")
  ) {
    throw new Error(
      "Turso environment values look invalid or still use placeholders. Check TURSO_DATABASE_URL and TURSO_AUTH_TOKEN.",
    );
  }

  return { url, authToken };
}

const { url, authToken } = requireTursoEnv();

const adapter = new PrismaLibSQL({
  url,
  authToken,
});

if (globalForPrisma.prismaSchemaVersion !== PRISMA_SCHEMA_VERSION) {
  void globalForPrisma.prisma?.$disconnect();
  globalForPrisma.prisma = undefined;
  globalForPrisma.prismaSchemaVersion = PRISMA_SCHEMA_VERSION;
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
