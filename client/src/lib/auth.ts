import { apiRequest } from "./queryClient";
import { LoginData, RegisterData } from "@shared/schema";

export interface AuthUser {
  id: number;
  username: string;
  flatId: number;
  karma: number;
  flatCode: string;
}

export const authApi = {
  login: async (data: LoginData): Promise<AuthUser> => {
    const response = await apiRequest("POST", "/api/auth/login", data);
    const result = await response.json();
    return result.user;
  },

  register: async (data: RegisterData): Promise<AuthUser> => {
    const response = await apiRequest("POST", "/api/auth/register", data);
    const result = await response.json();
    return result.user;
  },
};
