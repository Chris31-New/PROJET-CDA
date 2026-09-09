// import axios from "axios";
import type { Profile, User } from "../../interfaces/user";
import { api } from "../../utils/axios.client";

export class UsersApi {
  private static readonly API_URL = "https://jsonplaceholder.typicode.com";
  // static fakeUsers: User[] = [
  //   {
  //     id: 1,
  //     email: "john.doe@gmail.com",
  //     role: "INDIVIDUAL",
  //     firstname: "John",
  //     lastname: "Doe",
  //   },
  //   {
  //     id: 2,
  //     email: "jane.smith@yahoo.com",
  //     role: "INDIVIDUAL",
  //     firstname: "Jane",
  //     lastname: "Smith",
  //   },
  //   {
  //     id: 3,
  //     email: "contact@acme-corp.com",
  //     role: "COMPANY",
  //     firstname: "Alice",
  //     lastname: "Martin",
  //     company_id: "COMP-001",
  //   },
  //   {
  //     id: 4,
  //     email: "manager@buildco.com",
  //     role: "SITE_MANAGER",
  //     firstname: "Robert",
  //     lastname: "Johnson",
  //     company_id: "COMP-002",
  //   },
  //   {
  //     id: 5,
  //     email: "info@techsolutions.io",
  //     role: "COMPANY",
  //     firstname: "Sophie",
  //     lastname: "Dubois",
  //     company_id: "COMP-003",
  //   },
  //   {
  //     id: 6,
  //     email: "paul.bernard@gmail.com",
  //     role: "INDIVIDUAL",
  //     firstname: "Paul",
  //     lastname: "Bernard",
  //   },
  //   {
  //     id: 7,
  //     email: "manager@constructpro.fr",
  //     role: "SITE_MANAGER",
  //     firstname: "Lucas",
  //     lastname: "Moreau",
  //     company_id: "COMP-004",
  //   },
  //   {
  //     id: 8,
  //     email: "contact@greenenergy.fr",
  //     role: "COMPANY",
  //     firstname: "Emma",
  //     lastname: "Lefevre",
  //     company_id: "COMP-005",
  //   },
  //   {
  //     id: 9,
  //     email: "marie.laurent@gmail.com",
  //     role: "INDIVIDUAL",
  //     firstname: "Marie",
  //     lastname: "Laurent",
  //   },
  //   {
  //     id: 10,
  //     email: "site.manager@urbanbuild.fr",
  //     role: "SITE_MANAGER",
  //     firstname: "Nathan",
  //     lastname: "Garcia",
  //     company_id: "COMP-006",
  //   },
  // ];
  static async getAllIndividual(): Promise<User[]> {
    const { data } = await api.get<User[]>(`/users/individual`);
    // const data = UsersApi.fakeUsers.filter(
    //   (item: User) => item.role === "INDIVIDUAL",
    // );
    // console.log(data);
    // if (data.length === 0) {
    //   throw new Error("User not found");
    // }
    return data;
  }

  static async getUserProfile(userId: number | undefined): Promise<Profile | null> {
    const { data } = await api.get<Profile>(`/profile/${userId}`);
    if (!data) return null;
    return data;
  }

  static async createProfile(profile: Profile): Promise<Profile> {
    const { data } = await api.post<Profile>(`/profile/${profile.userId}`, profile);
    return data;
  }

  static async updateProfile(profile: Profile): Promise<Profile> {
    const { data } = await api.patch<Profile>(`/profile/update/${profile.userId}`, profile);
    return data;
  }
}
