export interface SpecialityItem {
  speciality_id: number;
  speciality: {
    id: number;
    name: string;
  };
}
import type { Speciality } from "./speciality";

export interface Company {
  id: number;
  name: string;
  type: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  logo?: string;
  siren: string;
  description: string;
  speciality? : Speciality[];
  speciality_id?: number[];
  specialities?: {        
    speciality_id: number;
    speciality: {
      id: number;
      name: string;
    };
  }[];
  employeeCount?: string;
  image?: string;
  userId: number;
  unavailabilities?: []
}

export interface CreateCompanyPayload extends Omit<Company, 'id' | 'specialities'> {
  siren: string;
  specialitiesId?: number[]; // ← pour la création
}