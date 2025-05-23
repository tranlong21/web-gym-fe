import React, { useEffect, useState } from "react";
import { getAllOrders, updateOrderStatus } from "../../services/orderService";
import ShopService from "../../services/ShopService";
import AdminSidebar from "../layout _admin/AdminSidebar";

const statusTransitionRules = {
    "Chưa xử lý": ["Đang xử lý", "Đang giao", "Đã giao", "Đã hủy"],
    "Đang xử lý": ["Đang giao", "Đã giao", "Đã hủy"],
    "Đang giao": ["Đã giao", "Đã hủy"],
    "Đã giao": ["Đã hủy"],
    "Đã hủy": [],
};

const OrderAdmin = () => {
    const [orders, setOrders] = useState([]);
    const [productMap, setProductMap] = useState({});
    const [expandedOrderId, setExpandedOrderId] = useState(null);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const limit = 5;

    const fetchOrders = async () => {
        try {
            const { orders, totalPages } = await getAllOrders(page, limit);
            const map = {};

            for (const order of orders) {
                for (const detail of order.order_details) {
                    if (!map[detail.product_id]) {
                        const product = await ShopService.getProductById(detail.product_id);
                        if (product) map[detail.product_id] = product;
                    }
                }
            }

            setOrders(orders);
            setProductMap(map);
            setTotalPages(totalPages);
        } catch (err) {
            console.error("Lỗi khi lấy đơn hàng:", err);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [page]);

    const toggleExpand = (id) => {
        setExpandedOrderId((prev) => (prev === id ? null : id));
    };

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await updateOrderStatus(orderId, newStatus);
            fetchOrders();
        } catch (error) {
            alert("❌ Cập nhật trạng thái thất bại.");
        }
    };

    const formatDate = (dateStr) => new Date(dateStr).toLocaleString("vi-VN");

    return (
        <div className="flex">
            <AdminSidebar />
            <div className="p-6 max-w-7xl mx-auto w-full">
                <h1 className="text-2xl font-bold mb-4">Quản lý đơn hàng</h1>
                <table className="w-full table-auto border-collapse shadow">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="p-2">STT</th>
                            <th className="p-2">Khách hàng</th>
                            <th className="p-2">Trạng thái</th>
                            <th className="p-2">Tổng tiền</th>
                            <th className="p-2">Ngày đặt</th>
                            <th className="p-2">Chi tiết</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order, idx) => (
                            <React.Fragment key={order.id}>
                                <tr className="border hover:bg-gray-50">
                                    <td className="p-2 text-center">{idx + 1 + page * limit}</td>
                                    <td className="p-2">{order.full_name}</td>
                                    <td className="p-2">
                                        {order.active === false ? (
                                            <span className="italic text-red-600">Hủy đơn hàng</span>
                                        ) : (
                                            <select
                                                className="border rounded px-2 py-1"
                                                value={order.status}
                                                onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                            >
                                                {order.status === "Đã hủy" ? (
                                                    <option value="Đã hủy" disabled>Hủy đơn hàng</option>
                                                ) : (
                                                    <>
                                                        <option value={order.status} disabled>{order.status}</option>
                                                        {statusTransitionRules[order.status]?.map((status) => (
                                                            <option key={status} value={status}>{status}</option>
                                                        ))}
                                                    </>
                                                )}
                                            </select>
                                        )}
                                    </td>
                                    <td className="p-2">{order.total_money.toLocaleString()} đ</td>
                                    <td className="p-2">{formatDate(order.order_date)}</td>
                                    <td className="p-2 text-center">
                                        <button
                                            onClick={() => toggleExpand(order.id)}
                                            className="text-blue-600 hover:underline font-semibold"
                                        >
                                            {expandedOrderId === order.id ? "Ẩn" : "Chi tiết"}
                                        </button>
                                    </td>
                                </tr>
                                {expandedOrderId === order.id && (
                                    <tr className="bg-gray-50">
                                        <td colSpan="6" className="p-4">
                                            <ul className="space-y-2">
                                                {order.order_details.map((item, i) => {
                                                    const product = productMap[item.product_id];
                                                    return (
                                                        <li key={i} className="flex items-start gap-4">
                                                            {product?.thumbnail && (
                                                                <img
                                                                    src={product.thumbnail}
                                                                    alt={product.name}
                                                                    className="w-16 h-16 object-cover border rounded-lg"
                                                                />
                                                            )}
                                                            <div>
                                                                <p className="font-semibold">{product?.name || `SP#${item.product_id}`}</p>
                                                                <p className="text-sm text-gray-600">
                                                                    Giá: {item.price.toLocaleString()} đ – SL: {item.number_of_products}
                                                                </p>
                                                            </div>
                                                        </li>
                                                    );
                                                })}
                                                <li className="text-sm text-gray-500 italic">
                                                    Ghi chú: {order.note?.trim() || "Không có"}
                                                </li>
                                            </ul>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>

                <div className="flex justify-center items-center mt-4 gap-2">
                    <button
                        onClick={() => setPage((prev) => Math.max(0, prev - 1))}
                        disabled={page === 0}
                        className={`px-4 py-2 rounded ${page === 0 ? "bg-gray-300" : "bg-blue-600 text-white hover:bg-blue-700"}`}
                    >
                        Previous
                    </button>

                    {Array.from({ length: Math.min(totalPages, 5) }, (_, idx) => {
                        const pageNum = Math.max(0, page - 2) + idx;
                        if (pageNum >= totalPages) return null;
                        return (
                            <button
                                key={pageNum}
                                onClick={() => setPage(pageNum)}
                                className={`px-3 py-1 rounded ${page === pageNum ? "bg-blue-700 text-white" : "bg-gray-200 text-black"}`}
                            >
                                {pageNum + 1}
                            </button>
                        );
                    })}

                    <button
                        onClick={() => setPage((prev) => Math.min(totalPages - 1, prev + 1))}
                        disabled={page === totalPages - 1}
                        className={`px-4 py-2 rounded ${page === totalPages - 1 ? "bg-gray-300" : "bg-blue-600 text-white hover:bg-blue-700"}`}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OrderAdmin;
