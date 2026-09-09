export interface User {
  id: number;
  email: string;
  role: roleEnum;
  profile: Profile;
}
export type roleEnum = "INDIVIDUAL" | "COMPANY" | "SITE_MANAGER";

export interface Profile {
  userId: number | null;
  firstName: string;
  lastName: string;
  phone: string;
}

