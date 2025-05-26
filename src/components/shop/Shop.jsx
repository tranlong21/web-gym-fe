import React, { useState, useEffect, useContext } from "react";
import Layout from "../LayOut";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ShopService from "../../services/ShopService";
import CategoryService from "../../services/CategoryService";
import { CartContext } from "./CartContext";
import ProductDetailModal from "../share/modals/ProductDetailModal";

const Shop = () => {
  const { addToCart: contextAddToCart, fetchCart } = useContext(CartContext);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [quantities, setQuantities] = useState({});
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showDetail, setShowDetail] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { products, totalPages } = await ShopService.getProducts(page, 6, selectedCategory);
      setProducts(products);
      setTotalPages(totalPages);
    } catch (error) {
      toast.error("❌ Lỗi khi tải sản phẩm!");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const result = await CategoryService.getCategories();
      setCategories(result);
    } catch (error) {
      toast.error("❌ Không thể tải danh mục");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [page, selectedCategory]);

  const handleQuantityChange = (productId, value) => {
    const num = parseInt(value);
    if (num >= 1) {
      setQuantities((prev) => ({ ...prev, [productId]: num }));
    }
  };

  const handleAddToCart = async (product) => {
    const quantity = quantities[product.id] || 1;
    try {
      await contextAddToCart(product.id, quantity);
      await fetchCart();
      toast.success("Đã thêm vào giỏ!");
    } catch (error) {
      toast.error("❌ Thêm vào giỏ thất bại!");
      console.error(error);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-200 text-black">
        <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar danh mục */}
          <aside className="col-span-1 bg-white p-4 rounded shadow-md h-fit">
            <h3 className="font-bold text-lg mb-4">Danh mục</h3>
            <ul className="space-y-2">
              <li
                className={`cursor-pointer hover:text-blue-600 ${selectedCategory === null ? "text-blue-600 font-semibold" : ""}`}
                onClick={() => {
                  setSelectedCategory(null);
                  setPage(0);
                }}
              >
                Tất cả
              </li>
              {categories.map((cat) => (
                <li
                  key={cat.id}
                  className={`cursor-pointer hover:text-blue-600 ${selectedCategory === cat.id ? "text-blue-600 font-semibold" : ""}`}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    setPage(0);
                  }}
                >
                  {cat.name}
                </li>
              ))}
            </ul>
          </aside>

          {/* Danh sách sản phẩm */}
          <main className="col-span-3 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {loading ? (
              <div className="col-span-full flex justify-center items-center py-10">
                <div className="text-gray-500 text-lg">Loading...</div>
              </div>
            ) : (
              products.map((product, index) => (
                <div
                  key={index}
                  className="cursor-pointer w-full h-auto bg-white border border-gray-200 rounded-xl p-4 shadow hover:shadow-md transition-transform hover:scale-[1.02] flex flex-col items-center"
                  onClick={() => {
                    setSelectedProduct(product);
                    setShowDetail(true);
                  }}
                >
                  <div className="w-full h-48 flex items-center justify-center bg-white rounded mb-4 overflow-hidden">
                    <img
                      src={product.thumbnail || "/placeholder.jpg"}
                      alt={product.name}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <h2 className="text-base font-medium text-center text-gray-800 line-clamp-2">{product.name}</h2>
                  <p className="text-green-600 font-bold mt-1">{product.price.toLocaleString()} đ</p>

                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleQuantityChange(product.id, (quantities[product.id] || 1) - 1);
                      }}
                      className="px-2 bg-gray-200 rounded text-lg font-bold"
                    >−</button>
                    <span>{quantities[product.id] || 1}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleQuantityChange(product.id, (quantities[product.id] || 1) + 1);
                      }}
                      className="px-2 bg-gray-200 rounded text-lg font-bold"
                    >+</button>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart(product);
                    }}
                    className="mt-3 bg-gradient-to-r from-pink-500 to-violet-600 text-white px-4 py-2 rounded-lg hover:opacity-90 text-sm shadow-md transition"
                  >
                    🛒 Thêm vào giỏ
                  </button>
                </div>
              ))
            )}
          </main>
        </div>

        {/* Phân trang */}
        <div className="flex justify-center items-center gap-2 py-6">
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 0}
            className={`px-4 py-2 rounded ${page === 0 ? "bg-gray-300" : "bg-blue-600 text-white hover:bg-blue-700"}`}
          >Previous</button>

          {Array.from({ length: totalPages }, (_, idx) => (
            <button
              key={idx}
              onClick={() => setPage(idx)}
              className={`px-3 py-1 rounded ${page === idx ? "bg-blue-700 text-white" : "bg-gray-200 text-black"}`}
            >
              {idx + 1}
            </button>
          ))}

          <button
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages - 1}
            className={`px-4 py-2 rounded ${page === totalPages - 1 ? "bg-gray-300" : "bg-blue-600 text-white hover:bg-blue-700"}`}
          >Next</button>
        </div>

        <ProductDetailModal
          isOpen={showDetail}
          onClose={() => setShowDetail(false)}
          product={selectedProduct}
        />

        <ToastContainer position="top-right" autoClose={1000} />
      </div>
    </Layout>
  );
};

export default Shop;