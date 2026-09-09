import { CompanyType } from 'prisma/generated/prisma/enums';

export interface CompanyData {
  name: string;

  type: CompanyType;

  description: string;

  siren: string;

  address_id: number;

  city: string;

  phone: string;

  email: string;

  logo: string;

  image: string;

  employeeCount: string;

  specialitiesId: number[];
}
