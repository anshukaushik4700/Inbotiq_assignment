const API = process.env.NEXT_PUBLIC_API_URL || "";

type FetchOpts = {
  method?: string;
  body?: any;
  token?: string | null;
};

export async function api<T = any>(path: string, opts: FetchOpts = {}) {
  const { method = "GET", body, token } = opts;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(API + path, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw { status: res.status, data };
  return data as T;
}
