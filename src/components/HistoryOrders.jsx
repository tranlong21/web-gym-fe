import React, { useEffect, useState } from "react";
import {
  getOrdersByUser,
  cancelOrderById,
} from "../services/orderService";
import ShopService from "../services/ShopService";
import Header from "./share/Header";

const HistoryOrders = () => {
  const [orders, setOrders] = useState([]);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [productMap, setProductMap] = useState({});
  const userRaw = localStorage.getItem("user");
  const user = userRaw ? JSON.parse(userRaw) : null;

  useEffect(() => {
    const fetchOrdersAndProducts = async () => {
      try {
        if (!user?.id) return;

        const orderData = await getOrdersByUser(user.id);
        const map = {};

        for (const order of orderData) {
          for (const detail of order.orderDetails) {
            if (!map[detail.id]) {
              const product = await ShopService.getProductById(detail.id);
              if (product) {
                map[detail.id] = product;
              }
            }
          }
        }

        setProductMap(map);
        setOrders(orderData);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
      }
    };

    fetchOrdersAndProducts();
  }, []);

  const toggleExpand = (orderId) => {
    setExpandedOrderId((prev) => (prev === orderId ? null : orderId));
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Bạn có chắc chắn muốn hủy đơn hàng này không?")) return;

    try {
      await cancelOrderById(orderId);
      const updated = await getOrdersByUser(user.id);
      setOrders(updated);
      setExpandedOrderId(null);
      alert("✅ Hủy đơn hàng thành công!");
    } catch (err) {
      alert("❌ Hủy đơn hàng thất bại.");
    }
  };

  const formatDateTime = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleString("vi-VN", {
      hour12: false,
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      <Header />
      <div className="p-4 max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Lịch sử đơn hàng</h2>
        <table className="w-full table-auto border-collapse shadow">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2">STT</th>
              <th className="p-2 text-left">Tên sản phẩm</th>
              <th className="p-2 text-left">Phương thức thanh toán</th>
              <th className="p-2 text-left">Trạng thái</th>
              <th className="p-2 text-left">Tổng tiền</th>
              <th className="p-2 text-center">Chi tiết</th>
              <th className="p-2 text-center">Hủy</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <React.Fragment key={order.id}>
                <tr className="border-t hover:bg-gray-50 transition">
                  <td className="p-2 text-center">{index + 1}</td>
                  <td className="p-2">
                    {order.orderDetails
                      .map((d) => productMap[d.id]?.name || `Sản phẩm #${d.id}`)
                      .join(", ")}
                  </td>
                  <td className="p-2 capitalize">
                    {order.paymentMethod === "cod"
                      ? "Thanh toán khi nhận hàng"
                      : order.paymentMethod}
                  </td>
                  <td className="p-2">
                    {!order.active ? (
                      <span className="italic text-red-600">Bạn đã hủy</span>
                    ) : (
                      order.status
                    )}
                  </td>
                  <td className="p-2">{order.totalMoney?.toLocaleString()} đ</td>
                  <td className="p-2 text-center">
                    <button
                      className="font-bold text-blue-600 hover:underline"
                      onClick={() => toggleExpand(order.id)}
                    >
                      {expandedOrderId === order.id ? "-" : "+"}
                    </button>
                  </td>
                  <td className="p-2 text-center">
                    {order.active && (order.status === "Chưa xử lý" || order.status === "Đang xử lý") ? (
                      <button
                        onClick={() => handleCancelOrder(order.id)}
                        className="text-red-600 hover:underline font-semibold"
                      >
                        Hủy
                      </button>
                    ) : (
                      <button
                        disabled
                        className="text-gray-400 cursor-not-allowed font-semibold"
                        title="Không thể hủy ở trạng thái hiện tại"
                      >
                        Không thể hủy
                      </button>
                    )}
                  </td>
                </tr>

                {expandedOrderId === order.id && (
                  <tr className="bg-gray-100">
                    <td colSpan="7" className="p-4">
                      <ul className="space-y-4">
                        <li className="text-sm text-gray-700 italic">
                          Ngày đặt: {formatDateTime(order.orderDate)}
                        </li>
                        {order.orderDetails.map((item, idx) => {
                          const product = productMap[item.id];
                          return (
                            <li key={idx} className="flex gap-4 items-start">
                              {product?.thumbnail && (
                                <img
                                  src={product.thumbnail}
                                  alt={product.name}
                                  className="w-20 h-20 object-cover rounded-lg border hover:scale-105 transition-transform shadow"
                                />
                              )}
                              <div>
                                <p className="font-semibold text-lg">
                                  {product?.name || `Sản phẩm #${item.id}`}
                                </p>
                                <p className="text-sm text-gray-700">
                                  Giá: {item.price.toLocaleString()} đ – Số lượng: {item.numberOfProducts}
                                </p>
                              </div>
                            </li>
                          );
                        })}
                        <li className="text-sm text-gray-600 italic">
                          Ghi chú: {order.note?.trim() ? order.note : "Không có"}
                        </li>
                      </ul>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default HistoryOrders;
