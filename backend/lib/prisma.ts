import { PrismaClient } from '@prisma/client';

// Create a single shared Prisma instance in development to avoid socket exhaustion
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

const client = global.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') global.prisma = client;

export default client;
