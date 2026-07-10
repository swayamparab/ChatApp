import { api } from "@/lib/api";
import { SignupRequest } from "@/schemas/auth";
import { AuthResponse, GetCurrentUserResponse, LoginRequest } from "@/types/auth";

export async function getCurrentUser() {
    const response = await api.get<GetCurrentUserResponse>("auth/me")

    return response.data;
}

export async function login(data: LoginRequest) {
    const response = await api.post<AuthResponse>(
        "/auth/login",
        data
    );

    return response.data;
}

export async function signup(data: SignupRequest) {
  const response = await api.post<AuthResponse>(
    "/auth/signup",
    data
  );

  return response.data;
}