export interface User {
    id: string;
    username: string;
    email: string;
}

export interface GetCurrentUserResponse {
    success: boolean;
    user: User;
}

export interface LoginRequest {
  identifier: string;
  password: string;
}

export interface SignupRequest {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  user: User;
}