import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './app/globals.css';
import { CartProvider } from './components/shop/CartContext'; 

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CartProvider> 
      <App />
    </CartProvider>
  </StrictMode>,
);