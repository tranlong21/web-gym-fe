import axios from "axios";

const API_PREFIX = "http://localhost:8091/api/v1/";
const BASE_IMAGE_URL = `${API_PREFIX}products/images/`;

const ShopService = {
  getProductById: async (id) => {
    try {
      const res = await axios.get(`${API_PREFIX}products/${id}`);

      return {
        id: res.data.id,
        name: res.data.name,
        price: res.data.price,
        thumbnail: res.data.thumbnail ? BASE_IMAGE_URL + res.data.thumbnail : null,
        description: res.data.description,
        category_id: res.data.category_id,
        images: (res.data.product_images || []).map((img) => {
          const imagePath = img.image_url || img.imageUrl || "";
          return {
            id: img.id,
            path: imagePath,
            url: BASE_IMAGE_URL + imagePath,
          };
        }),
      };
    } catch (error) {
      console.error(`❌ GET /products/${id} failed:`, error.response?.data || error.message);
      return null;
    }
  },

  getProducts: async (page = null, limit = null, categoryId = null) => {
    const params = {};
    if (page !== null) params.page = page;
    if (limit !== null) params.limit = limit;
    if (categoryId !== null) params.category_id = categoryId;
    try {
      const res = await axios.get(`${API_PREFIX}products`, { params });

      console.log("📦 Dữ liệu từ API /products:", res.data);

      const products = res.data.products.map((p) => ({
        id: p.id,
        name: p.name,
        price: p.price,
        thumbnail: p.thumbnail ? BASE_IMAGE_URL + p.thumbnail : null,
        description: p.description,
        category_id: p.category_id,
        images: (p.product_images || []).map((img) => {
          const imagePath = img.image_url || img.imageUrl || "";
          return {
            id: img.id,
            path: imagePath,
            url: BASE_IMAGE_URL + imagePath,
          };
        }),
      }));

      return { products, totalPages: res.data.totalPages };
    } catch (error) {
      console.error("❌ GET /products failed:", error.response?.data || error.message);
      throw error;
    }
  },

  createProduct: async (form) => {
    await axios.post(`${API_PREFIX}products`, form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  updateProduct: async (id, form) => {
    await axios.put(`${API_PREFIX}products/${id}`, form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  deleteProduct: async (id) => {
    await axios.delete(`${API_PREFIX}products/${id}`);
  },
};

export default ShopService;
