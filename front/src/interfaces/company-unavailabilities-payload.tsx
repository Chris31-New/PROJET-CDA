export interface CreateCompanyUnavailabilityPayload {
    company_id: number | null,
    start_date: Date,
    end_date: Date
}

export interface UpdateCompanyUnavailabilityPayload extends Partial<CreateCompanyUnavailabilityPayload> {
    unavailability_id: number | null;
}