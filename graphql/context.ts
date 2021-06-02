import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export type Context = {
  prisma: PrismaClient;
  req: {
    headers: {
      authorization: string | undefined;
    };
  };
};

export function createContext({ req }: { req: Context["req"] }): Context {
  return { prisma, req };
}
