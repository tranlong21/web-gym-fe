import React, { useState, useEffect, useContext } from "react";
import { getUserById } from "../../services/userService";
import CartService from "../../services/cartService";
import { CartContext } from "./CartContext";
import { useNavigate } from "react-router-dom";

const Checkout = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const { fetchCart } = useContext(CartContext);
  const [userData, setUserData] = useState(null);
  const [checkoutItems, setCheckoutItems] = useState([]);
  const [note, setNote] = useState("");
  const [shippingMethod, setShippingMethod] = useState("express");
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      if (user?.id) {
        const userInfo = await getUserById(user.id);
        setUserData(userInfo);
      }
      const storedItems = JSON.parse(localStorage.getItem("checkoutItems") || "[]");
      setCheckoutItems(storedItems);
    };
    fetchData();
  }, []);

  const baseTotal = checkoutItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const shippingFee = shippingMethod === "express" ? 5000 : 0;
  const totalMoney = baseTotal + shippingFee;

  const handleOrder = async () => {
    if (checkoutItems.length === 0) {
      alert("❗Bạn chưa chọn sản phẩm nào để thanh toán.");
      return;
    }

    const items = checkoutItems.map((item) => ({
      product_id: item.product.id,
      quantity: item.quantity,
    }));

    const payload = {
      user_id: user.id,
      full_name: userData.full_name,
      email: userData.email,
      phone: userData.phone,
      address: userData.address,
      note,
      total_money: totalMoney,
      shipping_method: shippingMethod,
      payment_method: paymentMethod,
      cart_items: items,
    };

    // Nếu là chuyển khoản thì CHƯA gọi API
    if (paymentMethod === "bank") {
      navigate("/bank-transfer", {
        state: { orderData: payload },
      });
    } else {
      // Nếu COD thì gọi luôn
      try {
        const selectedIds = checkoutItems.map((item) => item.product.id);
        await import("../../services/orderService").then(({ placeOrder }) => placeOrder(payload));
        for (const pid of selectedIds) {
          await CartService.removeItem(user.id, pid);
        }
        await fetchCart();
        localStorage.removeItem("checkoutItems");
        alert("✅ Đặt hàng thành công!");
        navigate("/shop");
      } catch (err) {
        console.error("Lỗi đặt hàng:", err);
        alert("❌ Đặt hàng thất bại!");
      }
    }
  };

  if (!userData || checkoutItems.length === 0) {
    return (
      <div className="p-4 text-red-600 font-semibold">
        Không có sản phẩm nào được chọn để thanh toán.
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-xl mt-10 mb-10 border border-gray-200">
      <h1 className="text-3xl font-extrabold bg-gradient-to-r from-pink-500 via-red-500 to-purple-600 text-transparent bg-clip-text text-center mb-4 tracking-wide uppercase">
        LT GYM
      </h1>

      <h2 className="text-xl font-bold mb-6 text-center text-gray-800">📝 Xác nhận đơn hàng</h2>

      <div className="mb-6 text-sm text-gray-700 space-y-1">
        <p><span className="font-semibold text-gray-900">👤 Họ tên:</span> {userData.full_name}</p>
        <p><span className="font-semibold text-gray-900">📧 Email:</span> {userData.email}</p>
        <p><span className="font-semibold text-gray-900">📞 Điện thoại:</span> {userData.phone}</p>
        <p><span className="font-semibold text-gray-900">🏠 Địa chỉ:</span> {userData.address}</p>
      </div>

      <div className="mb-6">
        <h3 className="font-semibold mb-2 text-pink-600">🛒 Sản phẩm đã chọn:</h3>
        <ul className="list-disc pl-6 space-y-1 text-sm text-gray-800">
          {checkoutItems.map((item, index) => (
            <li key={index}>
              <span className="font-medium">{item.product.name}</span> × {item.quantity} ={" "}
              <span className="text-green-700 font-semibold">
                {(item.product.price * item.quantity).toLocaleString()} đ
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mb-4">
        <label className="block font-semibold mb-1 text-gray-700">🚚 Phương thức giao hàng:</label>
        <select
          value={shippingMethod}
          onChange={(e) => setShippingMethod(e.target.value)}
          className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="standard">Tiết kiệm (Miễn phí)</option>
          <option value="express">Giao nhanh (+5.000Vnđ)</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block font-semibold mb-1 text-gray-700">💳 Phương thức thanh toán:</label>
        <select
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="cod">Thanh toán khi nhận hàng</option>
          <option value="bank">Chuyển khoản ngân hàng</option>
        </select>
      </div>

      <div className="mb-6">
        <label className="block font-semibold mb-1 text-gray-700">📝 Ghi chú đơn hàng:</label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
          className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Ví dụ: Giao giờ hành chính, gọi trước khi đến..."
        />
      </div>

      <div className="text-right text-lg font-bold text-green-600 mb-6">
        💰 Tổng tiền: {totalMoney.toLocaleString()} đ
      </div>

      <button
        onClick={handleOrder}
        className="w-full bg-gradient-to-r from-green-500 to-green-700 text-white py-3 rounded-lg font-semibold text-lg shadow hover:opacity-90 transition"
      >
        ✅ Xác nhận đặt hàng
      </button>
    </div>
  );
};

export default Checkout;
