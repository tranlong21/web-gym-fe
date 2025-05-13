import React, { useState, useEffect } from "react";
import { FaPlus, FaSearch, FaEdit, FaTrash } from "react-icons/fa";
import AdminSidebar from "../layout _admin/AdminSidebar";
import ShopFormModal from "../share/modals/ShopFormModal";
import ShopService from "../../services/ShopService";

const ShopAdmin = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);

  const limit = 4; // Số sản phẩm trên mỗi trang
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { products, totalPages } = await ShopService.getProducts(page, limit);
      setData(products);
      setTotalPages(totalPages);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setData([]); // 🧹 Clear data mỗi lần đổi page
    fetchProducts();
  }, [page]);

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete?");
    if (confirmed) {
      try {
        await ShopService.deleteProduct(id);
        await fetchProducts();
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };


  const handleSubmit = async (item) => {
    try {
      if (editingItem) {
        console.log("🛠 Sửa sản phẩm ID:", editingItem.id); // THÊM DÒNG NÀY
        await ShopService.updateProduct(editingItem.id, item);
      } else {
        await ShopService.createProduct(item);
      }
      await fetchProducts();
    } catch (error) {
      console.error("Error submitting product:", error);
    }
    setEditingItem(null);
  };



  const handlePageChange = (direction) => {
    if (direction === "next" && page < totalPages - 1) {
      setPage(page + 1);
    } else if (direction === "prev" && page > 0) {
      setPage(page - 1);
    }
  };

  return (
    <div className="flex h-screen">
      <AdminSidebar />
      <div className="flex-1 bg-white shadow-md rounded-lg">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-gray-100 border-b">
          <button
            onClick={() => {
              setEditingItem(null);
              setModalOpen(true);
            }}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            <FaPlus />
            Add Product
          </button>
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-gray-400">
              <FaSearch />
            </span>
            <input
              type="text"
              placeholder="Search by product name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-md text-sm focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="flex justify-center items-center py-10 text-gray-500 text-lg">
            Loading...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-4 py-3">STT</th>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3">Thumbnail</th>
                  <th className="px-4 py-3">Description</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data
                  .filter((item) =>
                    item.name.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((item, index) => (
                    <tr key={item.id}>
                      <td className="px-4 py-3">{page * limit + index + 1}</td>
                      <td className="px-4 py-3">{item.name}</td>
                      <td className="px-4 py-3">{item.price.toLocaleString()} VND</td>
                      <td className="px-4 py-3">
                        <img
                          src={item.thumbnail || "/placeholder.jpg"}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                      </td>
                      <td className="px-4 py-3">{item.description}</td>
                      <td className="px-4 py-3">{item.category_id}</td>
                      <td className="px-4 py-3 flex gap-3">
                        <button
                          onClick={() => {
                            setEditingItem(item);
                            setModalOpen(true);
                          }}
                          className="text-gray-600 hover:text-yellow-500"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        <div className="flex justify-center items-center mt-4 gap-2">
          <button
            onClick={() => handlePageChange("prev")}
            disabled={page === 0}
            className={`px-4 py-2 rounded ${page === 0 ? "bg-gray-300" : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
          >
            Previous
          </button>

          {/* Page Numbers */}
          {Array.from({ length: Math.min(totalPages, 5) }, (_, idx) => {
            const pageNum = Math.max(0, page - 2) + idx;
            if (pageNum >= totalPages) return null;

            return (
              <button
                key={pageNum}
                onClick={() => setPage(pageNum)}
                className={`px-3 py-1 rounded ${page === pageNum ? "bg-blue-700 text-white" : "bg-gray-200 text-black"
                  }`}
              >
                {pageNum + 1}
              </button>
            );
          })}


          <button
            onClick={() => handlePageChange("next")}
            disabled={page === totalPages - 1}
            className={`px-4 py-2 rounded ${page === totalPages - 1 ? "bg-gray-300" : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
          >
            Next
          </button>
        </div>

        {/* Modal Thêm/Sửa */}
        <ShopFormModal
          visible={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setEditingItem(null);
          }}
          onSubmit={handleSubmit}
          initialData={editingItem}
        />
      </div>
    </div>
  );
};

export default ShopAdmin;
