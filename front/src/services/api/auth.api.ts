import { api } from "../../utils/axios.client";
import axios from "axios";
import type { AuthResponse, SigninData, SignupData } from "../../types/auth.type";

export class AuthApi {
  static async login(body: SigninData): Promise<AuthResponse> {
    const { data } = await api.post("auth/login", body);
    return data;
  }

  static async register(body: SignupData): Promise<AuthResponse> {
    const { data } = await api.post("auth/signup", body);
    return data;
  }

  static async refresh(): Promise<AuthResponse> {
    const { data } = await axios.get(
      `${import.meta.env.VITE_API_URL}/auth/refresh-token`,
      { withCredentials: true },
    );

    return data;
  }
}
