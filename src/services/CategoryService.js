import axios from "axios";

const API_PREFIX = "http://localhost:8091/api/v1/";

const CategoryService = {
  getCategories: async (page = 1, limit = 100) => {
    try {
      const response = await axios.get(`${API_PREFIX}categories`, {
        params: { page, limit },
      });
      return response.data;
    } catch (error) {
      console.error("❌ Lỗi khi lấy danh mục:", error.response?.data || error.message);
      return [];
    }
  },

  createCategory: async (name) => {
    try {
      const res = await axios.post(`${API_PREFIX}categories`, { name });
      return res.data;
    } catch (error) {
      console.error("❌ Lỗi khi tạo danh mục:", error.response?.data || error.message);
      throw error;
    }
  },

  updateCategory: async (id, { name }) => {
    try {
      const res = await axios.put(`${API_PREFIX}categories/${id}`, { name });
      return res.data;
    } catch (error) {
      console.error("❌ Lỗi khi cập nhật danh mục:", error.response?.data || error.message);
      throw error;
    }
  },

  deleteCategory: async (id) => {
    try {
      const res = await axios.delete(`${API_PREFIX}categories/${id}`);
      return res.data;
    } catch (error) {
      console.error("❌ Lỗi khi xóa danh mục:", error.response?.data || error.message);
      throw error;
    }
  },
};

export default CategoryService;