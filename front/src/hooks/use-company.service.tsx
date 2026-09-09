import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationResult,
  type UseQueryResult,
} from "@tanstack/react-query";
import type { Company, CreateCompanyPayload } from "../interfaces/company";
import { CompaniesApi } from "../services/api/companies.api";
import { useToastStore } from "../store/toast.store";

// Hook pour récupérer les entreprises avec filtres et pagination
export function useGetCompany(): UseQueryResult<Company[], Error> {
  return useQuery<Company[], Error>({
    queryKey: ["companies"],
    queryFn: CompaniesApi.getCompanies,
  });
}


// Hook pour récupérer les types d'entreprises
export function useGetCompanyTypes(): UseQueryResult<string[], Error> {
  return useQuery({
    queryKey: ["companyTypes"],
    queryFn: CompaniesApi.getCompanyTypes,
  });
}

// Hook pour récupérer une entreprise par ID
export function useGetCompanyId(id: string): UseQueryResult<Company, Error> {
  return useQuery({
    queryKey: ["company", id],
    queryFn: () => CompaniesApi.getCompanyById(Number(id)),
    enabled: !!id,
  });
}

export function useCreateCompany(): UseMutationResult<
  Company,
  Error,
  CreateCompanyPayload>
 {
  const queryClient = useQueryClient();
  const addToast = useToastStore((s) => s.addToast);

  return useMutation({
    mutationFn: (company: CreateCompanyPayload) => CompaniesApi.createCompany(company),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
      addToast("new company created", "success");
    },
    onError: () => {
      addToast("Failed to create", "error");
    },
  });
}
