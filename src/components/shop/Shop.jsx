import React, { useState, useEffect, useContext } from "react";
import Header from "../share/Header";
import Cart from "./Cart";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ShopService from "../../services/ShopService";
import { CartContext } from "./CartContext"; // Import Context

const Shop = () => {
  const { cartItems, addToCart, removeFromCart } = useContext(CartContext); // Lấy từ Context
  const [products, setProducts] = useState([]);
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

  return (
    <div className="relative min-h-screen bg-gray-100 text-black">
      <Header onToggleCart={() => setShowCart(!showCart)} />

      {/* Loading */}
      {loading ? (
        <div className="flex justify-center items-center py-10">
          <div className="text-gray-500 text-lg">Loading...</div>
        </div>
      ) : (
        <>
          <div className="p-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {products.map((product, index) => (
              <div key={index} className="border rounded-xl p-4 shadow hover:shadow-lg bg-white">
                <img
                  src={product.thumbnail || "/placeholder.jpg"}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded-md"
                />
                <h2 className="text-lg font-semibold mt-3">{product.name}</h2>
                <p className="text-green-600 font-bold">{product.price.toLocaleString()} đ</p>
                <button
                  onClick={() => addToCart(product)} // Sử dụng hàm từ Context
                  className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Thêm vào giỏ
                </button>
              </div>
            ))}
          </div>

          {/* Phân trang */}
          <div className="flex justify-center items-center gap-2 py-6">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 0}
              className={`px-4 py-2 rounded ${
                page === 0 ? "bg-gray-300" : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, idx) => (
              <button
                key={idx}
                onClick={() => setPage(idx)}
                className={`px-3 py-1 rounded ${
                  page === idx ? "bg-blue-700 text-white" : "bg-gray-200 text-black"
                }`}
              >
                {idx + 1}
              </button>
            ))}

            <button
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages - 1}
              className={`px-4 py-2 rounded ${
                page === totalPages - 1 ? "bg-gray-300" : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              Next
            </button>
          </div>
        </>
      )}

      {showCart && (
        <div className="absolute top-20 right-4 w-80 bg-white text-black border shadow-lg rounded-lg p-4 z-50">
          <Cart cartItems={cartItems} removeFromCart={removeFromCart} />
        </div>
      )}

      <ToastContainer position="top-right" autoClose={2500} />
    </div>
  );
};

export default Shop;