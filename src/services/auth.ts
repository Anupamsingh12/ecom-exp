import { apiCall } from "@/lib/apiUtils";
import { Login, User, SignUpData } from "@/types/user.types";

interface LoginResponse {
  accessToken: string;
  user: User;
}

export async function signup(data: SignUpData) {
  return apiCall<LoginResponse[]>("/auth/register", { body: data, method: "POST" });
}

export async function login(data: Login) {
  return apiCall<LoginResponse>("/auth/login", { body: data, method: "POST" });
}

export async function getCurrentUser() {
  return apiCall<User>("/auth/me", { method: "GET" });
}

export async function updateProfile(data: Partial<User>) {
  return apiCall<User[]>("/auth/me", { body: data, method: "PUT" });
}
