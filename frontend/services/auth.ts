import { api } from "@/lib/api";
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