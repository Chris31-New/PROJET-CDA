import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient, Speciality } from '../generated/prisma/client';
const prisma = new PrismaClient({
  adapter: new PrismaMariaDb(process.env.DATABASE_URL!),
});

export async function seedSpecialities() {
  ///////////////////
  // SPECIALITIES
  ///////////////////
  console.log('Seeding Specialities...');

  const specialities: Omit<Speciality, 'id' | 'createdAt' | 'updatedAt'>[] = [
    { name: 'Masonry' },
    { name: 'Electrical' },
    { name: 'Plumbing' },
    { name: 'Painting' },
    { name: 'Carpentry' },
    { name: 'Tiling' },
    { name: 'Insulation' },
    { name: 'Roofing' },
    { name: 'Drywall Installation' },
    { name: 'Flooring' },
    { name: 'HVAC Installation' },
    { name: 'Landscaping' },
    { name: 'Demolition' },
    { name: 'Concrete Work' },
    { name: 'Glass Installation' },
  ];

  await prisma.speciality.createMany({
    data: specialities,
    skipDuplicates: true,
  });
  console.log('Specialities seeded successfully!');
}
