import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import {
  CompanyType,
  PrismaClient,
  RoleEnum,
} from '../generated/prisma/client';
const prisma = new PrismaClient({
  adapter: new PrismaMariaDb(process.env.DATABASE_URL!),
});

export async function seedCompanies() {
  ///////////////////
  // COMPANIES
  ///////////////////

  console.log('Seeding Companies...');

  const companies = [
    {
      name: 'Atlas Construction',
      type: CompanyType.COMPANY,
      description:
        'General construction company specialized in residential projects.',
      siren: '523456789',
      address: '12 Industrial Street',
      city: 'Paris',
      postal_code: '75001',
      email: 'atlas@company.com',
      logo: 'https://placehold.co/200x200',
      image: 'https://placehold.co/600x400',
      phone: '+33123456789',
      employeeCount: '50',
    },
    {
      name: 'Voltix Electric',
      type: CompanyType.ARTISAN,
      description: 'Electrical installations and maintenance.',
      siren: '623456789',
      address: '5 Energy Avenue',
      city: 'Lyon',
      postal_code: '69001',
      email: 'voltix@company.com',
      logo: 'https://placehold.co/200x200',
      image: 'https://placehold.co/600x400',
      phone: '+33456781234',
      employeeCount: '12',
    },
    {
      name: 'FlowMaster Plumbing',
      type: CompanyType.ARTISAN,
      description: 'Professional plumbing services.',
      siren: '723456789',
      address: '22 Water Street',
      city: 'Marseille',
      postal_code: '13001',
      email: 'flowmaster@company.com',
      logo: 'https://placehold.co/200x200',
      image: 'https://placehold.co/600x400',
      phone: '+33411112222',
      employeeCount: '10',
    },
    {
      name: 'SkyRoof Solutions',
      type: CompanyType.SUBCONTRACTOR,
      description: 'Roof installation specialists.',
      siren: '823456789',
      address: '88 Skyline Road',
      city: 'Toulouse',
      postal_code: '31000',
      email: 'skyroof@company.com',
      logo: 'https://placehold.co/200x200',
      image: 'https://placehold.co/600x400',
      phone: '+33511112222',
      employeeCount: '18',
    },
    {
      name: 'Prime Masonry',
      type: CompanyType.SUBCONTRACTOR,
      description: 'Concrete and brick specialists.',
      siren: '923456789',
      address: '14 Builder Lane',
      city: 'Lille',
      postal_code: '59000',
      email: 'primemasonry@company.com',
      logo: 'https://placehold.co/200x200',
      image: 'https://placehold.co/600x400',
      phone: '+33311112222',
      employeeCount: '25',
    },
    {
      name: 'Perfect Paint',
      type: CompanyType.ARTISAN,
      description: 'Interior and exterior painting.',
      siren: '333456789',
      address: '9 Color Street',
      city: 'Bordeaux',
      postal_code: '33000',
      email: 'perfectpaint@company.com',
      logo: 'https://placehold.co/200x200',
      image: 'https://placehold.co/600x400',
      phone: '+33556778899',
      employeeCount: '8',
    },
    {
      name: 'Elite Carpentry',
      type: CompanyType.SUBCONTRACTOR,
      description: 'Custom carpentry services.',
      siren: '444456789',
      address: '17 Wood Avenue',
      city: 'Nantes',
      postal_code: '44000',
      email: 'elitecarpentry@company.com',
      logo: 'https://placehold.co/200x200',
      image: 'https://placehold.co/600x400',
      phone: '+33255667788',
      employeeCount: '15',
    },
    {
      name: 'TileCraft Experts',
      type: CompanyType.ARTISAN,
      description: 'Tile and ceramic installations.',
      siren: '555456789',
      address: '21 Ceramic Road',
      city: 'Nice',
      postal_code: '06000',
      email: 'tilecraft@company.com',
      logo: 'https://placehold.co/200x200',
      image: 'https://placehold.co/600x400',
      phone: '+33499887766',
      employeeCount: '9',
    },
    {
      name: 'InsulPro',
      type: CompanyType.SUBCONTRACTOR,
      description: 'Thermal insulation specialists.',
      siren: '666456789',
      address: '3 Energy Street',
      city: 'Strasbourg',
      postal_code: '67000',
      email: 'insulpro@company.com',
      logo: 'https://placehold.co/200x200',
      image: 'https://placehold.co/600x400',
      phone: '+33399887766',
      employeeCount: '20',
    },
    {
      name: 'HVAC Masters',
      type: CompanyType.COMPANY,
      description: 'Heating and ventilation systems installation.',
      siren: '777456789',
      address: '45 Climate Avenue',
      city: 'Rennes',
      postal_code: '35000',
      email: 'hvacmasters@company.com',
      logo: 'https://placehold.co/200x200',
      image: 'https://placehold.co/600x400',
      phone: '+33244556677',
      employeeCount: '30',
    },
  ];
  const users = await prisma.user.findMany({
    where: { role: RoleEnum.COMPANY },
    orderBy: { id: 'asc' },
  });

  const specialities = await prisma.speciality.findMany({});

  if (!specialities.length) {
    throw new Error('No specialities found! Seed specialities first.');
  }

  for (let i = 0; i < companies.length; i++) {
    const company = companies[i];
    const user = users[i];

    const address = await prisma.address.findFirst({
      where: {
        address: company.address,
        city: company.city,
        postal_code: company.postal_code,
      },
    });

    if (!address) {
      throw new Error(`Address not found for ${company.name}`);
    }

    const createdCompany = await prisma.company.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        name: company.name,
        type: company.type,
        description: company.description,
        siren: company.siren,
        email: company.email,
        logo: company.logo,
        image: company.image,
        phone: company.phone,
        employeeCount: company.employeeCount,
        userId: user.id,
        address_id: address.id,
        city: company.city,
      },
    });

    ///////////////////
    // COMPANIES HAS SPECIALITY
    ///////////////////
    // ---- Ajouter des spécialités aléatoires à la company ----
    const numSpecialities = Math.floor(Math.random() * 3) + 1; // 1 à 3 spécialités
    const shuffledSpecialities = specialities.sort(() => 0.5 - Math.random());
    const selectedSpecialities = shuffledSpecialities.slice(0, numSpecialities);

    for (const speciality of selectedSpecialities) {
      await prisma.company_Has_Speciality.upsert({
        where: {
          company_id_speciality_id: {
            company_id: createdCompany.id,
            speciality_id: speciality.id,
          },
        },
        update: {},
        create: {
          company_id: createdCompany.id,
          speciality_id: speciality.id,
        },
      });
    }

    ///////////////////
    // COMPANIES UNAVAILABILITIES
    ///////////////////

    function randomDate(start: Date, end: Date) {
      return new Date(
        start.getTime() + Math.random() * (end.getTime() - start.getTime()),
      );
    }
    // Générer entre 1 et 3 indisponibilités pour la company
    const unavailabilityCount = Math.floor(Math.random() * 3) + 1;

    for (let j = 0; j < unavailabilityCount; j++) {
      const start = randomDate(new Date('2026-01-01'), new Date('2026-12-01'));

      const end = new Date(start);
      end.setDate(start.getDate() + Math.floor(Math.random() * 14) + 3);
      // indisponibilité entre 3 et 17 jours

      await prisma.company_Unavailability.create({
        data: {
          company_id: createdCompany.id,
          start_date: start,
          end_date: end,
        },
      });
    }
  }

  console.log('Companies seeded successfully with specialities!');
}
