const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

export interface CustomerResponse {
  id: string;
  name: string;
  membershipTier: string;
  points: number;
}

export interface EmployeeResponse {
  id: string;
  name: string;
  joinDate: string;
  salary: number;
}

async function handleResponse<T>(response: Response): Promise<T> {
  let payload: any = null;
  try {
    payload = await response.json();
  } catch (err) {
    payload = null;
  }

  if (!response.ok) {
    const message = payload?.message || response.statusText || "Request failed";
    throw new Error(message);
  }

  return payload as T;
}

export async function fetchCustomers(): Promise<CustomerResponse[]> {
  const url = `${API_BASE.replace(/\/$/, "")}/users/customers`;
  const res = await fetch(url);
  return handleResponse<CustomerResponse[]>(res);
}

export async function fetchEmployees(): Promise<EmployeeResponse[]> {
  const url = `${API_BASE.replace(/\/$/, "")}/users/employees`;
  const res = await fetch(url);
  return handleResponse<EmployeeResponse[]>(res);
}

export default { fetchCustomers, fetchEmployees };
