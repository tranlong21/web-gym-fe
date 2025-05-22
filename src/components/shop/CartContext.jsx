import React, { createContext, useState, useEffect } from "react";
import CartService from "../../services/cartService";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  const fetchCart = async () => {
    try {
      const data = await CartService.getCartByUserId(user.id);
      setCartItems(data.items);
    } catch (err) {
      console.error("Lỗi lấy giỏ hàng:", err);
    }
  };

  const addToCart = async (productId, quantity) => {
    await CartService.addToCart(user.id, productId, quantity);
    await fetchCart(); // cập nhật lại giỏ
  };

  const removeFromCart = async (productId) => {
    await CartService.removeItem(user.id, productId);
    await fetchCart();
  };

  const clearCart = async () => {
    await CartService.clearCart(user.id);
    setCartItems([]);
  };

  useEffect(() => {
    if (user?.id) fetchCart();
  }, []);

  return (
    <CartContext.Provider
      value={{ cartItems, removeFromCart, clearCart, fetchCart, addToCart, user }}
    >
      {children}
    </CartContext.Provider>
  );
};