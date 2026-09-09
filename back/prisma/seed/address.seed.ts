import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { Address, PrismaClient } from '../generated/prisma/client';

const prisma = new PrismaClient({
  adapter: new PrismaMariaDb(process.env.DATABASE_URL!),
});

export async function seedAddresses() {
  console.log('Seeding Addresses...');

  const addresses: Omit<Address, 'id' | 'createdAt' | 'updatedAt'>[] = [
    { address: '12 Industrial Street', city: 'Paris', postal_code: '75001' },
    { address: '5 Energy Avenue', city: 'Lyon', postal_code: '69001' },
    { address: '22 Water Street', city: 'Marseille', postal_code: '13001' },
    { address: '88 Skyline Road', city: 'Toulouse', postal_code: '31000' },
    { address: '14 Builder Lane', city: 'Lille', postal_code: '59000' },
    { address: '9 Color Street', city: 'Bordeaux', postal_code: '33000' },
    { address: '17 Wood Avenue', city: 'Nantes', postal_code: '44000' },
    { address: '21 Ceramic Road', city: 'Nice', postal_code: '06000' },
    { address: '3 Energy Street', city: 'Strasbourg', postal_code: '67000' },
    { address: '45 Climate Avenue', city: 'Rennes', postal_code: '35000' },
    { address: '7 Market Street', city: 'Montpellier', postal_code: '34000' },
    { address: '11 Harbor Road', city: 'Marseille', postal_code: '13002' },
    { address: '19 Garden Avenue', city: 'Lyon', postal_code: '69003' },
    { address: '4 Industrial Park', city: 'Toulon', postal_code: '83000' },
    { address: '33 River Lane', city: 'Nîmes', postal_code: '30000' },
    { address: '50 Sunset Boulevard', city: 'Nice', postal_code: '06001' },
    { address: '28 Oak Street', city: 'Strasbourg', postal_code: '67001' },
    { address: '6 Hilltop Avenue', city: 'Dijon', postal_code: '21000' },
    { address: '12 Central Square', city: 'Reims', postal_code: '51100' },
    { address: '9 Riverside Drive', city: 'Tours', postal_code: '37000' },
  ];

  for (const addr of addresses) {
    await prisma.address.upsert({
      where: {
        address_city_postal_code: {
          address: addr.address,
          city: addr.city,
          postal_code: addr.postal_code,
        },
      },
      update: {},
      create: addr,
    });
  }

  console.log('Addresses seeded successfully!');
}
