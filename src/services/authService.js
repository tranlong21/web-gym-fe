import axios from 'axios';
import { getUserById } from './userService';

const API_PREFIX = 'http://localhost:8091/api/v1/'; // Đặt URL API của bạn

// Hàm gọi API đăng nhập
export const login = async (phone, password) => {
  try {
    const response = await axios.post(`${API_PREFIX}users/login`, {
      phone,
      password_hash: password, // Backend yêu cầu trường "password_hash"
    });
    console.log("RESPONSE FROM LOGIN:", response.data);
    return response.data; // Trả về dữ liệu từ API
  } catch (error) {
    // Nếu BE trả về string lỗi → ném chính chuỗi đó
    throw error.response?.data || 'Login failed';
  }
};

// Hàm gọi API đăng ký
export const register = async (userData) => {
  try {
    const response = await axios.post(`${API_PREFIX}users/register`, userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || 'Registration failed';
  }
};

// Hàm xử lý đăng nhập
export const handleLogin = async (phone, password, setError, navigate) => {
  try {
    const data = await login(phone, password); // Nếu thành công
    const userDetails = await getUserById(data.id);

    // Lưu thông tin người dùng
    localStorage.setItem('user', JSON.stringify({
      id: data.id,
      username: userDetails.username,
      role_id: data.role_id,
    }));
    localStorage.setItem('token', data.token);

    // Điều hướng theo role
    if (data.role_id === "1") {
      navigate('/admin');
    } else if (data.role_id === "2") {
      navigate('/home');
    }
  } catch (error) {
    // Đảm bảo luôn chuyển thành string để kiểm tra
    const errMsg = typeof error === 'string'
      ? error
      : (error?.message || error?.toString());

    console.error("LOGIN ERROR:", errMsg);

    // Nếu tài khoản bị khóa → điều hướng đến trang bị khóa
    if (errMsg.toLowerCase().includes('tài khoản đã bị vô hiệu hóa')) {
      navigate('/banned', { state: { reason: errMsg } });
      return;
    }

    // Lỗi khác → hiển thị tại form
    setError(errMsg);
  }
};

// Hàm xử lý đăng ký
export const handleRegister = async (userData, setError, navigate) => {
  try {
    const data = await register(userData);
    localStorage.setItem('user', JSON.stringify({ id: data.id, username: data.username }));
    localStorage.setItem('token', data.token);
    navigate('/home');
  } catch (error) {
    const errMsg = typeof error === 'string'
      ? error
      : (error?.message || error?.toString());
    setError(errMsg);
  }
};
