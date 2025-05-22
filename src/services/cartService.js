import axios from "axios";
const API_PREFIX = "http://localhost:8091/api/v1";
const BASE_IMAGE_URL = `${API_PREFIX}products/images/`;

const CartService = {
  getCartByUserId: async (userId) => {
    const res = await axios.get(`${API_PREFIX}/carts/${userId}`);
    const data = res.data;

    const itemsWithThumbnails = data.items.map((item) => {
      const product = item.product;
      return {
        ...item,
        product: {
          ...product,
          thumbnail: product.thumbnail ? BASE_IMAGE_URL + product.thumbnail : null,
        },
      };
    });

    return { ...data, items: itemsWithThumbnails };
  },

  addToCart: async (userId, productId, quantity = 1) => {
    await axios.post(`${API_PREFIX}/carts/add/${userId}?productId=${productId}&quantity=${quantity}`);
  },

  updateQuantity: async (userId, productId, quantity) => {
    await axios.put(`${API_PREFIX}/carts/update/${userId}?productId=${productId}&quantity=${quantity}`);
  },

  removeItem: async (userId, productId) => {
    await axios.delete(`${API_PREFIX}/carts/remove/${userId}/${productId}`);
  },

  clearCart: async (userId) => {
    await axios.delete(`${API_PREFIX}/carts/clear/${userId}`);
  },
};

export default CartService;