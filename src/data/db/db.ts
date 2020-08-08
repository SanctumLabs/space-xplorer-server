import { PrismaClient } from '@prisma/client';

export default new PrismaClient({
  log: [
    {
      emit: 'stdout',
      level: 'query',
    },
    {
      emit: 'stdout',
      level: 'warn',
    },
    {
      emit: 'stdout',
      level: 'info',
    },
  ],
});
