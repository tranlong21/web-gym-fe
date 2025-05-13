import React, { useContext } from "react";
import { CartContext } from "./CartContext"; // Import CartContext

const Cart = () => {
  const { cartItems, removeFromCart } = useContext(CartContext); // Lấy dữ liệu từ Context

  const total = cartItems.reduce((acc, item) => acc + item.price, 0);

  return (
    <div>
      <h2 className="text-lg font-bold mb-2">🛒 Giỏ hàng</h2>
      {cartItems.length === 0 ? (
        <p>Không có sản phẩm.</p>
      ) : (
        <div className="space-y-3 max-h-[300px] overflow-y-auto">
          {cartItems.map((item, index) => (
            <div
              key={index}
              className="flex justify-between items-center border p-2 rounded"
            >
              <div>
                <p className="font-semibold">{item.name}</p>
                <p className="text-green-600 text-sm">
                  {item.price.toLocaleString()} đ
                </p>
              </div>
              <button
                className="text-red-500 hover:underline text-sm"
                onClick={() => removeFromCart(index)}
              >
                Xóa
              </button>
            </div>
          ))}
          <div className="pt-2 text-right font-bold border-t">
            Tổng: {total.toLocaleString()} đ
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;