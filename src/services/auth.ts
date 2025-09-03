import { apiCall } from "@/lib/apiUtils";
import { Signup, Login, User } from "@/types/user.types";

export async function signup(data: Signup) {
  return apiCall<Signup[]>("/auth/register", { body: data, method: "POST" });
}

interface LoginResponse {
  accessToken: string;
  user: Signup;
}

export async function login(data: Login) {
  return apiCall<LoginResponse>("/auth/login", { body: data, method: "POST" });
}

export async function getCurrentUser() {
  return apiCall<User>("/auth/me", { method: "GET" });
}

export async function updateProfile(data: Partial<Signup>) {
  return apiCall<Signup[]>("/auth/me", { body: data, method: "PUT" });
}
