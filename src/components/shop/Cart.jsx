import React, { useContext, useEffect, useState, useRef } from "react";
import { CartContext } from "./CartContext";
import CartService from "../../services/cartService";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const { cartItems, clearCart, fetchCart } = useContext(CartContext);
  const [selectedItems, setSelectedItems] = useState([]);
  const prevItemIds = useRef([]);
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  useEffect(() => {
    const newItemIds = cartItems.map((item) => item.product.id);
    const addedItems = newItemIds.filter(id => !prevItemIds.current.includes(id));
    const existingSelected = selectedItems.filter(id => newItemIds.includes(id));
    const updatedSelected = [...new Set([...existingSelected, ...addedItems])];
    setSelectedItems(updatedSelected);
    prevItemIds.current = newItemIds;
  }, [cartItems]);

  const toggleSelect = (productId) => {
    setSelectedItems((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const updateQuantity = async (productId, delta) => {
    const current = cartItems.find((i) => i.product.id === productId);
    const newQty = current.quantity + delta;
    if (newQty < 1) return;

    await CartService.updateQuantity(user.id, productId, newQty);
    await fetchCart();
  };

  const total = cartItems.reduce((acc, item) => {
    return selectedItems.includes(item.product.id)
      ? acc + (item.product?.price || 0) * item.quantity
      : acc;
  }, 0);

  const handleCheckout = () => {
    const selected = cartItems.filter(item => selectedItems.includes(item.product.id));

    if (selected.length === 0) {
      alert("❗Bạn chưa chọn sản phẩm nào để thanh toán.");
      return;
    }

    localStorage.setItem("checkoutItems", JSON.stringify(selected));
    navigate("/checkout");
  };

  return (
    <div>
      <h2 className="text-lg font-bold mb-2">🛒 Giỏ hàng</h2>
      {cartItems.length === 0 ? (
        <p>Không có sản phẩm.</p>
      ) : (
        <div className="flex flex-col max-h-[400px] border rounded">
          {/* Danh sách sản phẩm có scroll */}
          <div className="space-y-3 overflow-y-auto p-2 max-h-[400px]">
            {cartItems.map((item, index) => (
              <div
                key={index}
                className="flex gap-3 items-center border p-2 rounded"
              >
                <input
                  type="checkbox"
                  checked={selectedItems.includes(item.product.id)}
                  onChange={() => toggleSelect(item.product.id)}
                />
                <img
                  src={item.product.thumbnail || "/placeholder.jpg"}
                  alt={item.product.name}
                  className="w-16 h-16 object-contain rounded"
                />
                <div className="flex-1">
                  <p className="font-semibold">{item.product.name}</p>
                  <div className="flex items-center gap-2 text-sm mt-1">
                    <button
                      onClick={() => updateQuantity(item.product.id, -1)}
                      className="px-2 bg-gray-200 rounded"
                    >−</button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product.id, 1)}
                      className="px-2 bg-gray-200 rounded"
                    >+</button>
                  </div>
                  <p className="text-green-600 text-sm mt-1">
                    {(item.product?.price || 0).toLocaleString()} đ
                  </p>
                </div>
                <button
                  className="text-red-500 hover:underline text-sm"
                  onClick={async () => {
                    await CartService.removeItem(user.id, item.product.id);
                    await fetchCart();
                  }}
                >
                  Xóa
                </button>
              </div>
            ))}
          </div>

          {/* Thanh toán cố định */}
          <div className="p-3 border-t bg-white">
            <div className="text-right font-bold mb-2">
              Tổng: {total.toLocaleString()} đ
            </div>
            <button
              onClick={handleCheckout}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 text-sm"
            >
              Thanh toán
            </button>
            <button
              onClick={clearCart}
              className="mt-2 w-full bg-red-500 text-white py-1 rounded hover:bg-red-600 text-sm"
            >
              Xóa toàn bộ giỏ hàng
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
