import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import chalk from 'chalk';
import { PrismaClient } from './generated/prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    const adapter = new PrismaMariaDb(process.env.DATABASE_URL!);
    super({ adapter });
  }

  async onModuleInit() {
    try {
      await this.$connect();
      console.log(
        chalk.yellow('[OTOB]'),
        chalk.greenBright('Connected to Batabase'),
      );
    } catch (error) {
      console.error('❌ Failed to connect to the database: ', error);
      process.exit(1);
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
