import React, { useEffect, useState } from "react";
import { getOrdersByUser } from "../services/orderService";

const HistoryOrders = () => {
  const [orders, setOrders] = useState([]);
  const userRaw = localStorage.getItem("user");
  const user = userRaw ? JSON.parse(userRaw) : null;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        if (!user?.id) return;
        const data = await getOrdersByUser(user.id);
        setOrders(data);
      } catch (error) {
        console.error("Lỗi khi lấy lịch sử đơn hàng:", error);
      }
    };

    fetchOrders();
  }, [user]);

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Lịch sử đơn hàng</h2>
      {orders.length === 0 ? (
        <p className="text-gray-600">Bạn chưa có đơn hàng nào.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order, idx) => (
            <div key={idx} className="border p-4 rounded shadow-sm">
              <p><strong>Mã đơn hàng:</strong> {order.id}</p>
              <p><strong>Ngày đặt:</strong> {order.created_at ? new Date(order.created_at).toLocaleDateString() : "Không rõ"}</p>
              <p><strong>Phương thức giao hàng:</strong> {order.shipping_method || "-"}</p>
              <p><strong>Thanh toán:</strong> {order.payment_method || "-"}</p>
              <p><strong>Tổng tiền:</strong> {order.total_money?.toLocaleString() || 0} đ</p>
              {Array.isArray(order.cart_items) && order.cart_items.length > 0 && (
                <ul className="mt-2 list-disc pl-5 text-sm">
                  {order.cart_items.map((item, i) => (
                    <li key={i}>{item.product_name} x {item.quantity}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoryOrders;
