import type { Speciality } from "../../interfaces/speciality";
import { api } from "../../utils/axios.client";


export const SpecialitiesApi  = {
  getAll:  async () : Promise<Speciality[]> => {
    const { data } = await api.get('/specialities');
    return data;
  },
};