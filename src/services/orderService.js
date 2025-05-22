// src/services/checkoutService.js
import axios from "axios";

const API_PREFIX = "http://localhost:8091/api/v1/";

export const placeOrder = async (orderData) => {
  const response = await axios.post(`${API_PREFIX}orders`, orderData, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  return response.data;
};


export const getOrdersByUser = async (userId) => {
  const res = await axios.get(`${API_PREFIX}orders/user/${userId}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  return res.data;
};