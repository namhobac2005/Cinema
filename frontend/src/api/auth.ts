const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  message?: string;
  // add fields your backend returns (token, user, etc.)
  [key: string]: any;
}

export async function login(credentials: LoginCredentials): Promise<LoginResponse> {
  const url = `${API_BASE.replace(/\/$/, '')}/login`;

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });

  // try to parse JSON safely
  let data: any = null;
  try {
    data = await res.json();
  } catch (err) {
    // non-json response
    data = null;
  }

  if (!res.ok) {
    const message = data?.message || res.statusText || 'Login failed';
    throw new Error(message);
  }

  return data || { message: 'OK' };
}

export default { login };
