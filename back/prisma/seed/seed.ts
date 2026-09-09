import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from '../generated/prisma/client';
import { seedNotifications } from './notifications.seed';
import { seedSpecialities } from './specialities.seed';
import { seedCategories } from './categories.seed';
import { seedArticles } from './articles.seed';
import { seedUsers } from './users.seed';
import { seedCompanies } from './companies.seed';
import { seedAddresses } from './address.seed';
import { seedProjects } from './projects.seed';
import { seedTasks } from './tasks.seed';
import { seedShoppingLines } from './shoppingLines.seed';

const prisma = new PrismaClient({
  adapter: new PrismaMariaDb(process.env.DATABASE_URL!),
});

async function main() {
  try {
    await seedCategories();
    await seedSpecialities();
    await seedArticles();
    await seedUsers();
    await seedAddresses();
    await seedCompanies();
    await seedNotifications();
    await seedProjects();
    await seedTasks();
    await seedShoppingLines();

    console.log('Seeding Done!');
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
