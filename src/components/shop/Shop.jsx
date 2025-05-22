import React, { useState, useEffect, useContext } from "react";
import Header from "../share/Header";
import Cart from "./Cart";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ShopService from "../../services/ShopService";
import { CartContext } from "./CartContext";
import axios from "axios";

const Shop = () => {
  const { cartItems, addToCart: contextAddToCart, fetchCart } = useContext(CartContext);
  const [products, setProducts] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [showCart, setShowCart] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { products, totalPages } = await ShopService.getProducts(page, 6);
      setProducts(products);
      setTotalPages(totalPages);
    } catch (error) {
      toast.error("❌ Lỗi khi tải sản phẩm!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page]);

  const handleQuantityChange = (productId, value) => {
    const num = parseInt(value);
    if (num >= 1) {
      setQuantities((prev) => ({ ...prev, [productId]: num }));
    }
  };

  const handleAddToCart = async (product) => {
    const quantity = quantities[product.id] || 1;

    try {
      await contextAddToCart(product.id, quantity); // gọi từ context
      await fetchCart(); // cập nhật cart
      toast.success("✅ Đã thêm vào giỏ!");
    } catch (error) {
      toast.error("❌ Thêm vào giỏ thất bại!");
      console.error(error);
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-200 text-black">
      <Header onToggleCart={() => setShowCart(!showCart)} />

      {loading ? (
        <div className="flex justify-center items-center py-10">
          <div className="text-gray-500 text-lg">Loading...</div>
        </div>
      ) : (
        <>
          <div className="max-w-[1180px] mx-auto p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
            {products.map((product, index) => (
              <div
                key={index}
                className="w-full h-auto bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 border border-indigo-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-transform hover:scale-[1.03] flex flex-col items-center"
              >
                <div className="w-full h-52 flex items-center justify-center bg-white rounded-lg mb-4 overflow-hidden">
                  <img
                    src={product.thumbnail || "/placeholder.jpg"}
                    alt={product.name}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                <h2 className="text-base font-semibold text-center text-gray-800">{product.name}</h2>
                <p className="text-green-600 font-bold mt-1">{product.price.toLocaleString()} đ</p>

                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={() =>
                      handleQuantityChange(product.id, (quantities[product.id] || 1) - 1)
                    }
                    className="px-2 bg-gray-200 rounded text-lg font-bold"
                  >
                    −
                  </button>
                  <span>{quantities[product.id] || 1}</span>
                  <button
                    onClick={() =>
                      handleQuantityChange(product.id, (quantities[product.id] || 1) + 1)
                    }
                    className="px-2 bg-gray-200 rounded text-lg font-bold"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={() => handleAddToCart(product)}
                  className="mt-3 bg-gradient-to-r from-pink-500 to-violet-600 text-white px-4 py-2 rounded-lg hover:opacity-90 text-sm shadow-md transition"
                >
                  🛒 Thêm vào giỏ
                </button>
              </div>
            ))}
          </div>

          <div className="flex justify-center items-center gap-2 py-6">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 0}
              className={`px-4 py-2 rounded ${
                page === 0
                  ? "bg-gray-300"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, idx) => (
              <button
                key={idx}
                onClick={() => setPage(idx)}
                className={`px-3 py-1 rounded ${
                  page === idx
                    ? "bg-blue-700 text-white"
                    : "bg-gray-200 text-black"
                }`}
              >
                {idx + 1}
              </button>
            ))}

            <button
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages - 1}
              className={`px-4 py-2 rounded ${
                page === totalPages - 1
                  ? "bg-gray-300"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              Next
            </button>
          </div>
        </>
      )}

      {showCart && (
        <div className="absolute top-20 right-4 w-80 bg-white text-black border shadow-lg rounded-lg p-4 z-50">
          <Cart />
        </div>
      )}

      <ToastContainer position="top-right" autoClose={2500} />
    </div>
  );
};

export default Shop;