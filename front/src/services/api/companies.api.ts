import type { Company, CreateCompanyPayload } from '../../interfaces/company';
import { api } from '../../utils/axios.client';


export class CompaniesApi {
  

  // Récupérer toutes les entreprises
  static async getCompanies(): Promise<Company[]> {
    const { data } = await api.get<Company[]>('/companies');
    return data;
  }

  // Récupérer les types d'entreprises
  static async getCompanyTypes(): Promise<string[]> {
    const { data } = await api.get<string[]>('/companies/types');
    return data;
  }

  // Récupérer une entreprise par ID
  static async getCompanyById(id: number): Promise<Company> {
    const { data } = await api.get<Company>(`/companies/${id}`);
    return data;
  }

  // Créer une nouvelle entreprise
 // companies.api.ts
static async createCompany(company: Omit<CreateCompanyPayload, "id">): Promise<Company> {
  const { data } = await api.post<Company>('/companies', company);
  return data;
}

  // Mettre à jour une entreprise existante
  static async updateCompany(id: number, company: Partial<Company>): Promise<Company> {
    const { data } = await api.patch<Company>(`/companies/${id}`, company);
    return data;
  }

  // Supprimer une entreprise
  static async deleteCompany(id: number): Promise<void> {
    await api.delete(`/companies/${id}`);
  }

};