import { PrismaClient } from "@prisma/client";

// Using - https://www.prisma.io/docs/support/help-articles/nextjs-prisma-client-dev-practices
interface CustomNodeJsGlobal extends NodeJS.Global {
  prisma: PrismaClient;
}

declare const global: CustomNodeJsGlobal;

const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV === "development") global.prisma = prisma;

export default prisma;
