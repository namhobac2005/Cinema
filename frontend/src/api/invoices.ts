import axios from "axios";
const API = "http://localhost:5000";

export const getInvoices = () =>
  axios.get(`${API}/invoice`).then(res => res.data);

export const getInvoiceDetails = (id: number) =>
  axios.get(`${API}/invoice/${id}`).then(res => res.data);
