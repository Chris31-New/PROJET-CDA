import { useMutation, useQuery, useQueryClient, type UseMutationResult, type UseQueryResult } from "@tanstack/react-query";
import { Company_UnavailabilitiesApi } from "../services/api/company_unavailabilities.api";
import type { Company_Unavailabilities } from "../interfaces/company_unavailabilities";
import type { CreateCompanyUnavailabilityPayload, UpdateCompanyUnavailabilityPayload } from "../interfaces/company-unavailabilities-payload";

export function useGetAllCompaniesUnavailabilities(enabled: boolean): UseQueryResult<Company_Unavailabilities[]> {
    return useQuery<Company_Unavailabilities[], Error>({
        queryKey: ["allCompaniesUnavailabilities"],
        queryFn: Company_UnavailabilitiesApi.getAll,
        enabled,
    })
}

export function useGetCompanyUnavailabilities(companyId: number | null, enabled: boolean) {
    return useQuery({
        queryKey: ["companyUnavailabilities", companyId],
        queryFn: () => Company_UnavailabilitiesApi.getByCompanyId(companyId as number),
        enabled
    });
};

export function useCreateCompanyUnavailability(): UseMutationResult<
    Company_Unavailabilities,
    Error,
    CreateCompanyUnavailabilityPayload
> {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: Company_UnavailabilitiesApi.create,
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: ["companyUnavailabilities", variables.company_id],
            });

            queryClient.invalidateQueries({
                queryKey: ["companyUnavailabilities", "all"],
            });
        },
    });
}

export function useUpdateCompanyUnavailability(): UseMutationResult<
    Company_Unavailabilities,
    Error,
    UpdateCompanyUnavailabilityPayload
> {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: Company_UnavailabilitiesApi.update,
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: ["companyUnavailabilities", variables.company_id],
            });

            queryClient.invalidateQueries({
                queryKey: ["companyUnavailabilities", "all"],
            });
        }
    })
}