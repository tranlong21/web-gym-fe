import React, { useState } from "react";
import Header from "./share/Header";
import Footer from "./share/Footer";
import Cart from './shop/Cart';

const Layout = ({ children }) => {
    const [showCart, setShowCart] = useState(false);

    return (
        <div className="min-h-screen flex flex-col relative">
            <Header onToggleCart={() => setShowCart(!showCart)} />

            {showCart && (
                <div className="absolute top-20 right-4 w-80 bg-white text-black border shadow-lg rounded-lg p-4 z-50">
                    <Cart />
                </div>
            )}

            <main className="flex-1">{children}</main>
            <Footer />
        </div>
    );
};

export default Layout;
