import axios from "axios";

const API_URL = "http://localhost:5000/products"; 

export const getProducts = async () => {
  const res = await axios.get(API_URL);
  return res.data;
};

export const addProduct = async (product: any) => {
  const res = await axios.post(API_URL, product, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
};

export const updateProduct = async (id: number, product: any) => {
  const res = await axios.put(`${API_URL}/${id}`, product, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
};

export const deleteProduct = async (id: number) => {
  const res = await axios.delete(`${API_URL}/${id}`);
  return res.data;
};
