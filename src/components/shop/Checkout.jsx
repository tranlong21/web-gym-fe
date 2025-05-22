import React, { useState, useEffect, useContext } from "react";
import { getUserById } from "../../services/userService";
import { placeOrder } from "../../services/orderService";
import CartService from "../../services/cartService";
import { CartContext } from "./CartContext"; // đường dẫn đúng tới CartContext
import { useNavigate } from "react-router-dom";

const Checkout = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const { fetchCart } = useContext(CartContext); // ← Lấy fetchCart
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

    const totalMoney = checkoutItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

    const handleOrder = async () => {
        if (checkoutItems.length === 0) {
            alert("❗Bạn chưa chọn sản phẩm nào để thanh toán.");
            return;
        }

        const items = checkoutItems.map(item => ({
            product_id: item.product.id,
            quantity: item.quantity,
        }));
        const selectedIds = checkoutItems.map(item => item.product.id);

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

        try {
            await placeOrder(payload);
            // Xóa từng sản phẩm đã đặt khỏi BE
            for (const pid of selectedIds) {
                await CartService.removeItem(user.id, pid);
            }
            // **Đồng bộ live**: fetch lại giỏ hàng để cập nhật ngay
            await fetchCart();

            alert("✅ Đặt hàng thành công!");
            localStorage.removeItem("checkoutItems");
            navigate("/shop");
        } catch (err) {
            console.error("Lỗi đặt hàng:", err);
            alert("❌ Đặt hàng thất bại!");
        }
    };

    if (!userData || checkoutItems.length === 0) {
        return <div className="p-4 text-red-600 font-semibold">Không có sản phẩm nào được chọn để thanh toán.</div>;
    }

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow mt-6">
            <h2 className="text-xl font-bold mb-4">Xác nhận đơn hàng</h2>

            <div className="mb-4">
                <p><strong>Họ tên:</strong> {userData.full_name}</p>
                <p><strong>Email:</strong> {userData.email}</p>
                <p><strong>Điện thoại:</strong> {userData.phone}</p>
                <p><strong>Địa chỉ:</strong> {userData.address}</p>
            </div>

            <div className="mb-4">
                <h3 className="font-semibold mb-2">Sản phẩm đã chọn:</h3>
                <ul className="list-disc pl-5 space-y-1">
                    {checkoutItems.map((item, index) => (
                        <li key={index}>
                            {item.product.name} x {item.quantity} ={" "}
                            {(item.product.price * item.quantity).toLocaleString()} đ
                        </li>
                    ))}
                </ul>
            </div>

            <div className="mb-4">
                <label className="block font-semibold mb-1">Phương thức giao hàng:</label>
                <select
                    value={shippingMethod}
                    onChange={(e) => setShippingMethod(e.target.value)}
                    className="w-full border border-gray-300 p-2 rounded"
                >
                    <option value="standard">Tiết kiệm</option>
                    <option value="express">Giao nhanh</option>
                </select>
            </div>

            <div className="mb-4">
                <label className="block font-semibold mb-1">Phương thức thanh toán:</label>
                <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full border border-gray-300 p-2 rounded"
                >
                    <option value="cod">Thanh toán khi nhận hàng</option>
                    <option value="bank">Chuyển khoản ngân hàng</option>
                </select>
            </div>

            <div className="mb-4">
                <label className="block font-semibold mb-1">Ghi chú đơn hàng:</label>
                <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    rows={3}
                    className="w-full border border-gray-300 p-2 rounded"
                    placeholder="Ví dụ: Giao giờ hành chính, gọi trước khi đến..."
                />
            </div>

            <div className="font-bold mb-4">
                Tổng tiền: {totalMoney.toLocaleString()} đ
            </div>

            <button
                onClick={handleOrder}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded w-full"
            >
                Xác nhận đặt hàng
            </button>
        </div>
    );
};

export default Checkout;
