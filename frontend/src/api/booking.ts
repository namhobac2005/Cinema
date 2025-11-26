const API_BASE = (import.meta as any).env?.VITE_API_URL || "http://localhost:5000";
export { API_BASE };

const BOOKING_BASE = `${API_BASE.replace(/\/$/, '')}/booking`;

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${BOOKING_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers || {}),
    },
    ...options,
  });

  let payload: any = null;
  try {
    payload = await response.json();
  } catch (err) {
    payload = null;
  }

  if (!response.ok) {
    const message = payload?.message || response.statusText || 'Request failed';
    throw new Error(message);
  }

  return payload as T;
}

export interface TheaterResponse {
  id: number;
  name: string;
  address: string;
  city: string;
  status: string;
}

export interface MovieResponse {
  id: number;
  tenPhim: string;
  moTa: string;
  thoiLuong: number;
  xuatXu: string;
  dangPhim: string;
  ngayPhatHanh: string;
  trailerURL: string | null;
  posterURL: string | null;
  gioiHanTuoi: number;
  longTieng: boolean;
  phuDe: string | null;
}

export interface ShowtimeResponse {
  id: number;
  startTime: string;
  phongChieu: string;
  rapId: number;
  rapName: string;
  dinhDang: string;
  longTieng: boolean;
  phuDe: string | null;
  gioiHanTuoi: number;
  giaVe: number;
}

export type SeatStatus = 'available' | 'booked' | 'processing';

export interface SeatResponse {
  id: string;
  row: string;
  col: number;
  type: string;
  status: SeatStatus;
  price: number;
}

export interface SeatMapResponse {
  showtime: {
    id: number;
    rapId: number;
    rapName: string;
    room: string;
    startTime: string;
    format: string;
    longTieng: boolean;
    phuDe: string | null;
    movieName: string;
  };
  seats: SeatResponse[];
}

export interface VoucherResponse {
  voucherId: number;
  code: string;
  type: 'PhanTram' | 'SoTien';
  amount: number;
  discountValue: number;
}

export interface CheckoutSeatPayload {
  row: string;
  number: number | string;
}

export interface CheckoutProductPayload {
  productId: number;
  quantity: number;
}

export interface CheckoutPayload {
  customerId?: number | null;
  showtimeId: number;
  seats: CheckoutSeatPayload[];
  products?: CheckoutProductPayload[];
  voucherCode?: string;
  paymentMethod: string;
}

export interface CheckoutResponse {
  invoiceId: number;
  bookingCode: string;
  subtotal: number;
  ticketTotal: number;
  productTotal: number;
  discount: number;
  total: number;
  voucher: { id: number; code: string; type: string } | null;
  tickets: Array<{ seatCode: string; price: number; seatType: string }>;
  products: Array<{ id: number; name: string; price: number; quantity: number }>;
  showtime: {
    id: number;
    rapId: number;
    rapName: string;
    room: string;
    startTime: string;
    format: string;
    movieName: string;
  };
}

export const fetchTheaters = () => request<TheaterResponse[]>('/theaters');

export const fetchMovies = (theaterId: number) =>
  request<MovieResponse[]>(`/theaters/${theaterId}/movies`);

export const fetchShowtimes = (params: {
  theaterId: number;
  movieId: number;
  date?: string;
}) => {
  const query = new URLSearchParams({
    theaterId: String(params.theaterId),
    movieId: String(params.movieId),
  });
  if (params.date) {
    query.set('date', params.date);
  }
  return request<ShowtimeResponse[]>(`/showtimes?${query.toString()}`);
};

export const fetchSeatMap = (showtimeId: number) =>
  request<SeatMapResponse>(`/showtimes/${showtimeId}/seats`);

export const applyVoucher = (code: string, total: number) =>
  request<VoucherResponse>('/voucher/apply', {
    method: 'POST',
    body: JSON.stringify({ code, total }),
  });

export const checkoutBooking = (payload: CheckoutPayload) =>
  request<CheckoutResponse>('/checkout', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
