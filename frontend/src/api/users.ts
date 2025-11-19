const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

export interface CustomerResponse {
  id: string;
  name: string;
  membershipTier: string;
  points: number;
  email?: string;
  phone?: string;
  dateOfBirth?: string;
}

export interface EmployeeResponse {
  id: string;
  name: string;
  joinDate: string;
  salary: number;
}

export interface CustomerPayload {
  name: string;
  phone: string;
  email?: string;
  dateOfBirth?: string;
  points?: number;
}

export interface UpdateCustomerPayload extends Partial<CustomerPayload> {}

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

export async function createCustomer(payload: CustomerPayload): Promise<CustomerResponse> {
  const url = `${API_BASE.replace(/\/$/, '')}/users/customers`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleResponse<CustomerResponse>(res);
}

export async function updateCustomer(
  id: string,
  payload: UpdateCustomerPayload,
): Promise<CustomerResponse> {
  const url = `${API_BASE.replace(/\/$/, '')}/users/customers/${id}`;
  const res = await fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleResponse<CustomerResponse>(res);
}

export async function deleteCustomer(id: string): Promise<void> {
  const url = `${API_BASE.replace(/\/$/, '')}/users/customers/${id}`;
  const res = await fetch(url, { method: 'DELETE' });
  await handleResponse<{ success: boolean }>(res);
}

export default { fetchCustomers, fetchEmployees, createCustomer, updateCustomer, deleteCustomer };
