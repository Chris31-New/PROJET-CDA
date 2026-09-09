import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import {
  PrismaClient,
  Profile,
  RoleEnum,
  User,
} from '../generated/prisma/client';
import argon2 from 'argon2';

const prisma = new PrismaClient({
  adapter: new PrismaMariaDb(process.env.DATABASE_URL!),
});

type UserSeed = Omit<
  User,
  'id' | 'refreshToken' | 'password' | 'createdAt' | 'updatedAt'
> & {
  profile: Omit<Profile, 'id' | 'userId' | 'createdAt' | 'updatedAt'>;
};

export async function seedUsers() {
  ///////////////////
  // USERS
  ///////////////////
  console.log('Seeding Users...');

  const hashedPassword = await argon2.hash('password123!');

  const usersData: UserSeed[] = [
    // 10 COMPANY users
    {
      email: 'atlas@company.com',
      role: RoleEnum.COMPANY,
      profile: { firstName: 'Lucas', lastName: 'Martin', phone: '0611111111' },
    },
    {
      email: 'voltix@company.com',
      role: RoleEnum.COMPANY,
      profile: {
        firstName: 'Thomas',
        lastName: 'Bernard',
        phone: '0622222222',
      },
    },
    {
      email: 'flowmaster@company.com',
      role: RoleEnum.COMPANY,
      profile: { firstName: 'Hugo', lastName: 'Robert', phone: '0633333333' },
    },
    {
      email: 'skyroof@company.com',
      role: RoleEnum.COMPANY,
      profile: {
        firstName: 'Nathan',
        lastName: 'Richard',
        phone: '0644444444',
      },
    },
    {
      email: 'primemasonry@company.com',
      role: RoleEnum.COMPANY,
      profile: { firstName: 'Leo', lastName: 'Petit', phone: '0655555555' },
    },
    {
      email: 'perfectpaint@company.com',
      role: RoleEnum.COMPANY,
      profile: { firstName: 'Enzo', lastName: 'Durand', phone: '0666666666' },
    },
    {
      email: 'elitecarpentry@company.com',
      role: RoleEnum.COMPANY,
      profile: { firstName: 'Noah', lastName: 'Dubois', phone: '0677777777' },
    },
    {
      email: 'tilecraft@company.com',
      role: RoleEnum.COMPANY,
      profile: { firstName: 'Louis', lastName: 'Moreau', phone: '0688888888' },
    },
    {
      email: 'insulpro@company.com',
      role: RoleEnum.COMPANY,
      profile: { firstName: 'Adam', lastName: 'Simon', phone: '0699999999' },
    },
    {
      email: 'hvacmasters@company.com',
      role: RoleEnum.COMPANY,
      profile: {
        firstName: 'Gabriel',
        lastName: 'Laurent',
        phone: '0600000000',
      },
    },

    // 10 INDIVIDUAL users
    {
      email: 'individual1@example.com',
      role: RoleEnum.INDIVIDUAL,
      profile: { firstName: 'Alice', lastName: 'Petit', phone: '0601111111' },
    },
    {
      email: 'individual2@example.com',
      role: RoleEnum.INDIVIDUAL,
      profile: { firstName: 'Bob', lastName: 'Moreau', phone: '0602222222' },
    },
    {
      email: 'individual3@example.com',
      role: RoleEnum.INDIVIDUAL,
      profile: { firstName: 'Charlie', lastName: 'Simon', phone: '0603333333' },
    },
    {
      email: 'individual4@example.com',
      role: RoleEnum.INDIVIDUAL,
      profile: { firstName: 'Diana', lastName: 'Lemoine', phone: '0604444444' },
    },
    {
      email: 'individual5@example.com',
      role: RoleEnum.INDIVIDUAL,
      profile: { firstName: 'Ethan', lastName: 'Durand', phone: '0605555555' },
    },
    {
      email: 'individual6@example.com',
      role: RoleEnum.INDIVIDUAL,
      profile: { firstName: 'Fiona', lastName: 'Roche', phone: '0606666666' },
    },
    {
      email: 'individual7@example.com',
      role: RoleEnum.INDIVIDUAL,
      profile: { firstName: 'George', lastName: 'Dupont', phone: '0607777777' },
    },
    {
      email: 'individual8@example.com',
      role: RoleEnum.INDIVIDUAL,
      profile: { firstName: 'Hannah', lastName: 'Colin', phone: '0608888888' },
    },
    {
      email: 'individual9@example.com',
      role: RoleEnum.INDIVIDUAL,
      profile: { firstName: 'Ian', lastName: 'Laurent', phone: '0609999999' },
    },
    {
      email: 'individual10@example.com',
      role: RoleEnum.INDIVIDUAL,
      profile: { firstName: 'Julia', lastName: 'Morel', phone: '0610000000' },
    },

    // 4 SITE_MANAGER users
    {
      email: 'manager1@example.com',
      role: RoleEnum.SITE_MANAGER,
      profile: { firstName: 'Claire', lastName: 'Dubois', phone: '0611111122' },
    },
    {
      email: 'manager2@example.com',
      role: RoleEnum.SITE_MANAGER,
      profile: { firstName: 'Marc', lastName: 'Lemoine', phone: '0611111133' },
    },
    {
      email: 'manager3@example.com',
      role: RoleEnum.SITE_MANAGER,
      profile: { firstName: 'Sophie', lastName: 'Durand', phone: '0611111144' },
    },
    {
      email: 'manager4@example.com',
      role: RoleEnum.SITE_MANAGER,
      profile: { firstName: 'Lucas', lastName: 'Petit', phone: '0611111155' },
    },
  ];

  for (const userData of usersData) {
    await prisma.user.upsert({
      where: { email: userData.email },
      update: {},
      create: {
        email: userData.email,
        password: hashedPassword,
        role: userData.role,
        profile: {
          create: {
            firstName: userData.profile.firstName,
            lastName: userData.profile.lastName,
            phone: userData.profile.phone,
          },
        },
      },
    });
  }
  console.log('Users seeded successfully!');
}
