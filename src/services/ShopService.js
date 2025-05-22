import axios from "axios";

const API_PREFIX = "http://localhost:8091/api/v1/";

const ShopService = {
  getProducts: async (page = null, limit = null) => {
    const params = {};
    if (page !== null) params.page = page;
    if (limit !== null) params.limit = limit;

    try {
      console.log("📥 [GET] /products", params);
      const res = await axios.get(`${API_PREFIX}products`, { params });

      const BASE_IMAGE_URL = `${API_PREFIX}products/images/`;

      const products = res.data.products.map((p) => ({
        id: p.id,
        name: p.name,
        price: p.price,
        thumbnail: p.thumbnail ? BASE_IMAGE_URL + p.thumbnail : null,
        description: p.description,
        category_id: p.category_id,
      }));

      return { products, totalPages: res.data.totalPages };
    } catch (error) {
      console.error("❌ GET /products failed:", error.response?.data || error.message);
      throw error;
    }
  },


  createProduct: async (data) => {
    const { thumbnail, ...info } = data;
    const res = await axios.post(`${API_PREFIX}products`, info);
    const id = res.data.id;

    if (thumbnail instanceof File) {
      const formData = new FormData();
      formData.append("file", thumbnail);
      await axios.post(`${API_PREFIX}products/uploads/${id}`, formData);
    }
  },

  updateProduct: async (id, data) => {
    const { thumbnail, ...info } = data;
    await axios.put(`${API_PREFIX}products/${id}`, info);

    if (thumbnail instanceof File) {
      const formData = new FormData();
      formData.append("file", thumbnail);
      await axios.post(`${API_PREFIX}products/uploads/${id}`, formData);
    }
  },

  deleteProduct: async (id) => {
    await axios.delete(`${API_PREFIX}products/${id}`);
  },
};

export default ShopService;
