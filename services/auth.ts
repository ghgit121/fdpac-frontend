import { api } from "./api";

export interface LoginPayload {
  email: string;
  password: string;
}

export async function login(payload: LoginPayload) {
  const response = await api.post("/auth/login", payload);
  const token = response.data?.data?.access_token;
  if (token) {
    localStorage.setItem("access_token", token);
  }
  return response.data;
}

export async function getMe() {
  const response = await api.get("/auth/me");
  return response.data;
}

export function logout() {
  localStorage.removeItem("access_token");
}
