import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { Category, PrismaClient } from '../generated/prisma/client';
const prisma = new PrismaClient({
  adapter: new PrismaMariaDb(process.env.DATABASE_URL!),
});

export async function seedCategories() {
  ///////////////////
  // CATEGORIES
  ///////////////////
  console.log('Seeding Categories...');

  const categories: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>[] = [
    { name: 'Electrical Supplies' },
    { name: 'Plumbing Supplies' },
    { name: 'Painting Supplies' },
    { name: 'Masonry Materials' },
    { name: 'Carpentry Materials' },
    { name: 'Tiling Materials' },
    { name: 'Insulation Materials' },
    { name: 'Roofing Materials' },
    { name: 'Drywall Materials' },
    { name: 'Flooring Materials' },
    { name: 'HVAC Materials' },
    { name: 'Hardware' },
  ];

  await prisma.category.createMany({
    data: categories,
    skipDuplicates: true,
  });

  console.log('Categories seeded successfully!');
}
