export const API_BASE =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "http://localhost:8000";

export type AuthResponse = {
  access_token: string;
  token_type: string;
  role: string;
  full_name: string;
  status: string;
};

export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const token = typeof window !== "undefined" ? localStorage.getItem("legalai_token") : null;
  const headers = new Headers(init?.headers);
  if (!(init?.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const res = await fetch(`${API_BASE}${path}`, { ...init, headers });
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;
  if (!res.ok) {
    const detail = data?.detail;
    const message =
      typeof detail === "string"
        ? detail
        : Array.isArray(detail)
          ? detail.map((item: { msg?: string }) => item.msg).join(", ")
          : res.statusText;
    throw new Error(message || "Request failed");
  }
  return data as T;
}

export function persistAuth(auth: AuthResponse) {
  localStorage.setItem("legalai_token", auth.access_token);
  localStorage.setItem("legalai_role", auth.role);
  localStorage.setItem("legalai_name", auth.full_name);
}
