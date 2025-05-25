import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { placeOrder } from "../../services/orderService";
import CartService from "../../services/cartService";
import { useContext } from "react";
import { CartContext } from "./CartContext";

const BankTransferInfo = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { fetchCart } = useContext(CartContext);

  const orderData = state?.orderData;

  if (!orderData) {
    return (
      <div className="text-center text-red-500 mt-10 font-semibold">
        ❌ Không tìm thấy thông tin đơn hàng.
      </div>
    );
  }

  const handleConfirmTransfer = async () => {
    try {
      await placeOrder(orderData);

      for (const item of orderData.cart_items) {
        await CartService.removeItem(orderData.user_id, item.product_id);
      }

      await fetchCart();
      localStorage.removeItem("checkoutItems");

      alert("✅ Đặt hàng thành công!");
      navigate("/shop");
    } catch (err) {
      console.error("Lỗi xác nhận chuyển khoản:", err);
      alert("❌ Giao dịch thất bại!");
    }
  };

  const handleGoBack = () => {
    navigate("/checkout", { state: { orderData } });
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow-lg mt-10 mb-10 text-center">
      <h1 className="text-2xl font-bold text-pink-600 mb-4">💳 Thanh Toán Chuyển Khoản</h1>
      <p className="text-gray-800 mb-2">
        Xin cảm ơn <strong>{orderData.full_name}</strong> đã đặt hàng!
      </p>
      <p className="mb-4 text-gray-600">Vui lòng chuyển khoản với nội dung chính xác như sau:</p>

      <div className="bg-gray-50 rounded p-4 text-left text-sm mb-6 border">
        <p><strong>Ngân hàng:</strong> Vietcombank</p>
        <p><strong>Chủ tài khoản:</strong> Trần Văn Long</p>
        <p><strong>Số tài khoản:</strong> 0123456789</p>
        <p><strong>Số tiền:</strong> <span className="text-green-700 font-bold">{orderData.total_money.toLocaleString()} đ</span></p>
        <p><strong>Nội dung chuyển khoản:</strong> [Tên] + [SĐT]</p>
      </div>

      <img
        src="/background/QR.png"
        alt="QR chuyển khoản"
        className="w-48 h-48 mx-auto mb-6 border rounded"
      />

      <div className="flex justify-center gap-4">
        <button
          onClick={handleGoBack}
          className="bg-gray-300 hover:bg-gray-400 text-black font-medium py-2 px-4 rounded"
        >
          ⬅ Quay lại
        </button>
        <button
          onClick={handleConfirmTransfer}
          className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded"
        >
          ✅ Tôi đã chuyển khoản
        </button>
      </div>
    </div>
  );
};

export default BankTransferInfo;
