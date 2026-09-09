import type { CreateCompanyUnavailabilityPayload, UpdateCompanyUnavailabilityPayload } from "../../interfaces/company-unavailabilities-payload";
import type { Company_Unavailabilities } from "../../interfaces/company_unavailabilities";
import { api } from "../../utils/axios.client";

export class Company_UnavailabilitiesApi {
    // private static readonly API_URL = "https://jsonplaceholder.typicode.com";
    static fake_Unavailabilities: Company_Unavailabilities[] = [
        {
            id: 1,
            start_date: new Date(),
            end_date: new Date(),
            company_id: 1,
        },
        {
            id: 2,
            start_date: new Date(),
            end_date: new Date(),
            company_id: 1,
        },
        {
            id: 3,
            start_date: new Date(),
            end_date: new Date(),
            company_id: 2,
        },
        {
            id: 4,
            start_date: new Date(),
            end_date: new Date(),
            company_id: 3,
        },
        {
            id: 5,
            start_date: new Date(),
            end_date: new Date(),
            company_id: 4,
        },
    ]


    static async getAll(): Promise<Company_Unavailabilities[]> {
        const { data } = await api.get('/planning/companies/unavailabilities');
        return data;
    }

    static async getByCompanyId(companyId: number): Promise<Company_Unavailabilities[]> {
        const { data } = await api.get(`/planning/companies/${companyId}/unavailabilities`);
        return data;
    }

    static async create(payload: CreateCompanyUnavailabilityPayload): Promise<Company_Unavailabilities> {
        const { data } = await api.post(`/unavailabilities/company/${payload.company_id}`, payload);
        return data
    }

    static async update(payload: UpdateCompanyUnavailabilityPayload): Promise<Company_Unavailabilities> {
        const { data } = await api.put(`/unavailabilities/company/${payload.company_id}/unavailabilities/${payload.unavailability_id}`, payload);
        return data;
    }
}