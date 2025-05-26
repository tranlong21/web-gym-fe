import React from "react";
import { useContext, useState } from "react";
import { CartContext } from "../../shop/CartContext";

const ProductDetailModal = ({ isOpen, onClose, product }) => {
  const { addToCart, fetchCart } = useContext(CartContext);
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState(product?.thumbnail || "");

  if (!isOpen || !product) return null;

  const handleAddToCart = async () => {
    await addToCart(product.id, quantity);
    await fetchCart();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white w-full max-w-2xl rounded-xl p-6 relative shadow-lg">
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-red-600 text-xl"
          onClick={onClose}
        >
          &times;
        </button>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Ảnh phụ bên trái */}
          <div className="w-full md:w-1/3 flex flex-col gap-2 items-center">
            <div className="w-full h-64 bg-white flex items-center justify-center border rounded">
              <img
                src={mainImage || product.thumbnail}
                alt={product.name}
                className="max-h-full max-w-full object-contain"
              />
            </div>
            <div className="flex flex-wrap justify-center gap-2 mt-2">
              {[product.thumbnail, ...(product.images || []).map(img => img.url || img.path)].map((imgUrl, idx) => (
                <img
                  key={idx}
                  src={imgUrl}
                  alt="img"
                  onClick={() => setMainImage(imgUrl)}
                  className="w-14 h-14 object-cover rounded border cursor-pointer hover:scale-105"
                />
              ))}
            </div>
          </div>

          {/* Chi tiết bên phải */}
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Tên sản phẩm:</h2>
            <p className="text-lg text-gray-700 mb-4">{product.name}</p>

            <h3 className="text-xl font-semibold text-gray-800 mb-2">Giá:</h3>
            <p className="text-green-600 text-lg font-bold mb-4">{product.price.toLocaleString()} đ</p>

            <h4 className="text-lg font-semibold text-gray-800 mb-2">Mô tả:</h4>
            <p className="text-gray-700 whitespace-pre-line leading-relaxed mb-4">
              {product.description}
            </p>

            <div className="flex items-center gap-3 mb-4">
              <button
                onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                className="px-2 bg-gray-200 rounded text-lg font-bold"
              >−</button>
              <span>{quantity}</span>
              <button
                onClick={() => setQuantity((prev) => prev + 1)}
                className="px-2 bg-gray-200 rounded text-lg font-bold"
              >+</button>
            </div>

            <button
              onClick={handleAddToCart}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            >
              🛒 Thêm vào giỏ hàng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;
