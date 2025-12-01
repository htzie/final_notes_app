export const API_HOST =
  process.env.NEXT_PUBLIC_API_HOST || "http://localhost:3001";

export function getToken() {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
  return null;
}

export async function apiFetch(path, options = {}) {
  const token = getToken();

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const res = await fetch(API_HOST + path, {
    ...options,
    headers,
  });

  // If token expired → force logout
  if (res.status === 401) {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
  }

  return res;
}
