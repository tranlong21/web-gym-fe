import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './share/Header';
import Muscle from './Muscle.jsx';
import Footer from './share/Footer';
import IconChatBot from './share/IconChatBot';
import Cart from './shop/Cart'; // Import Cart

export default function Home() {
    const navigate = useNavigate();
    const [showCart, setShowCart] = useState(false); // State để quản lý hiển thị giỏ hàng

    return (
        <div
            className="w-full h-screen"
            style={{
                backgroundColor: "#fff",
                width: "100vw",
                minHeight: "100vh", // tự động cao theo nội dung
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                position: "relative",
                overflowX: "hidden",
            }}
        >
            {/* Truyền onToggleCart vào Header */}
            <Header onToggleCart={() => setShowCart(!showCart)} />

            {/* Hiển thị giỏ hàng khi showCart = true */}
            {showCart && (
                <div className="absolute top-20 right-4 w-80 bg-white text-black border shadow-lg rounded-lg p-4 z-50">
                    <Cart /> 
                </div>
            )}

            <Muscle />
            <IconChatBot />
            <Footer />
        </div>
    );
}