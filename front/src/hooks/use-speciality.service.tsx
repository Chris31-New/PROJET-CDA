// use-speciality.service.ts
import { useQuery } from '@tanstack/react-query';
import type { Speciality } from '../interfaces/speciality';
import { SpecialitiesApi } from '../services/api/specialities.api';

export function useGetSpecialities() {
  return useQuery<Speciality[]>({
    queryKey: ['specialities'],
    queryFn: SpecialitiesApi.getAll,
  });
}