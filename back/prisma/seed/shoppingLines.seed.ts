import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from '../generated/prisma/client';

const prisma = new PrismaClient({
  adapter: new PrismaMariaDb(process.env.DATABASE_URL!),
});

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomSubset<T>(array: T[], min: number, max: number): T[] {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  const count = randomInt(min, max);
  return shuffled.slice(0, count);
}

export async function seedShoppingLines() {
  console.log('Seeding Shopping Lines from existing Articles...');

  const tasks = await prisma.task.findMany({
    include: { speciality: true },
  });

  const articles = await prisma.article.findMany({
    include: { category: true },
  });

  console.log('Tasks:', tasks.length);
  console.log('Articles:', articles.length);

  for (const task of tasks) {
    const selectedArticles = getRandomSubset(articles, 2, 6);

    for (const article of selectedArticles) {
      await prisma.shopping_Line.upsert({
        where: {
          task_id_article_id: {
            task_id: task.id,
            article_id: article.id,
          },
        },
        update: {},
        create: {
          task_id: task.id,
          article_id: article.id,
          quantity: randomInt(1, 20),
          unit_price: randomInt(10, 200),
        },
      });
    }
  }

  console.log('Shopping Lines seeded successfully!');
}
