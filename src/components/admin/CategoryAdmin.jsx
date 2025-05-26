import React, { useEffect, useState } from "react";
import AdminSidebar from "../layout _admin/AdminSidebar";
import CategoryService from "../../services/CategoryService";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";

const CategoryAdmin = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [showInput, setShowInput] = useState(false);

  const fetchCategories = async () => {
    const data = await CategoryService.getCategories();
    setCategories(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await CategoryService.updateCategory(editingId, { name });
      } else {
        await CategoryService.createCategory(name);
      }
      setName("");
      setEditingId(null);
      setShowInput(false);
      fetchCategories();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa danh mục này?")) {
      await CategoryService.deleteCategory(id);
      fetchCategories();
    }
  };

  const handleEdit = (cat) => {
    setName(cat.name);
    setEditingId(cat.id);
    setShowInput(true);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="flex h-screen overflow-hidden">
      <AdminSidebar />
      <div className="flex-1 p-6 overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Quản lý danh mục</h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {/* Box thêm mới */}
          {showInput ? (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col justify-between border border-blue-400 rounded-xl p-4 shadow bg-white"
            >
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Tên danh mục"
                className="border px-3 py-2 rounded mb-3 text-sm"
                required
              />
              <button
                type="submit"
                className="bg-blue-600 text-white py-1 rounded hover:bg-blue-700 text-sm"
              >
                {editingId ? "Cập nhật" : "Thêm mới"}
              </button>
            </form>
          ) : (
            <button
              onClick={() => setShowInput(true)}
              className="border border-dashed border-blue-400 rounded-xl p-4 flex items-center justify-center text-blue-500 hover:bg-blue-50 transition-colors"
            >
              <FaPlus className="text-2xl" />
            </button>
          )}

          {/* Danh sách danh mục */}
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="relative group border rounded-xl p-4 shadow bg-white hover:shadow-md transition"
            >
              <p className="text-center text-sm font-semibold text-gray-800">
                {cat.name}
              </p>
              <div className="absolute top-2 right-2 hidden group-hover:flex gap-2">
                <button onClick={() => handleEdit(cat)} className="text-yellow-600 hover:text-yellow-800">
                  <FaEdit />
                </button>
                <button onClick={() => handleDelete(cat.id)} className="text-red-600 hover:text-red-800">
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryAdmin;