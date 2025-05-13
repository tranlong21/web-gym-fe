import React, { useState, useEffect, useContext } from "react";
import { FaShoppingCart, FaTimes, FaBell } from "react-icons/fa"; // Import FaTimes
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "../shop/CartContext"; // Import Context

const Header = ({ onToggleCart }) => {
  const { cartItems } = useContext(CartContext); // Lấy trạng thái giỏ hàng từ Context
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false); // Trạng thái mở/đóng giỏ hàng
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.username) {
      setUsername(user.username);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('chatMessages');
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/");
  };

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen); 
    onToggleCart(); 
  };

  return (
    <header className="flex justify-between items-center px-6 py-4 bg-black text-white shadow z-10">
      <div className="flex items-center gap-2 ml-10">
        <Link to="/home" className="text-xl font-bold bg-gradient-to-r from-red-500 via-pink-500 to-blue-500 text-transparent bg-clip-text">
          LT GYM
        </Link>
      </div>

      <div className="flex items-center gap-4 relative">
        <Link to="/shop" className="text-xl font-bold bg-gradient-to-r from-blue-500 via-yellow-200 to-white text-transparent bg-clip-text">
          Sản phẩm
        </Link>

        {/* Giỏ hàng */}
        <div className="relative cursor-pointer" onClick={toggleCart}>
          {isCartOpen ? (
            <FaTimes className="text-lg" /> // Hiển thị dấu "X" khi giỏ hàng mở
          ) : (
            <FaShoppingCart className="text-lg" /> // Hiển thị biểu tượng giỏ hàng khi đóng
          )}
          {cartItems.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-600 text-xs text-white rounded-full w-5 h-5 flex items-center justify-center">
              {cartItems.length}
            </span>
          )}
        </div>

        {/* Thông báo */}
        <div className="relative cursor-pointer">
          <FaBell className="text-lg" />
          <span className="absolute -top-2 -right-2 bg-red-500 text-xs text-white rounded-full w-5 h-5 flex items-center justify-center">
            3
          </span>
        </div>

        {/* Dropdown người dùng */}
        <div className="relative">
          <div
            className="flex items-center gap-2 mr-10 cursor-pointer"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <img
              src="https://i.pravatar.cc/30"
              alt="avatar"
              className="w-8 h-8 rounded-full"
            />
            <div>
              <p className="text-sm font-semibold">{username || "Guest"} ▼</p>
              <p className="text-xs text-gray-400">Premium Member</p>
            </div>
          </div>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded shadow-lg">
              <Link
                to="/profile"
                className="block px-4 py-2 hover:bg-gray-100"
                onClick={() => setIsDropdownOpen(false)}
              >
                Thông tin cá nhân
              </Link>
              <button
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                onClick={() => {
                  setIsDropdownOpen(false);
                  handleLogout();
                }}
              >
                Đăng xuất
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;