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

export const cancelOrderById = async (orderId) => {
  try {
    const res = await axios.delete(`${API_PREFIX}orders/${orderId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error(`❌ DELETE /orders/${orderId} thất bại:`, error.response?.data || error.message);
    throw error;
  }
};

export const getAllOrders = async (page = 0, limit = 5) => {
  try {
    const res = await axios.get(`${API_PREFIX}orders`, {
      params: { page, limit },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return {
      orders: res.data.orders,
      totalPages: res.data.totalPages,
    };
  } catch (error) {
    console.error("❌ Lỗi lấy danh sách đơn hàng:", error.response?.data || error.message);
    throw error;
  }
};

export const updateOrderStatus = async (orderId, status) => {
  const res = await axios.put(`${API_PREFIX}orders/${orderId}/status`, null, {
    params: { status },
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  return res.data;
};
