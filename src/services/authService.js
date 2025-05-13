import axios from 'axios';

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
    throw error.response?.data?.message || 'Login failed'; // Xử lý lỗi
  }
};

// Hàm gọi API đăng ký
export const register = async (userData) => {
  try {
    const response = await axios.post(`${API_PREFIX}users/register`, userData);
    return response.data; // Trả về dữ liệu từ API
  } catch (error) {
    throw error.response?.data?.message || 'Registration failed'; // Xử lý lỗi
  }
};

// Hàm xử lý đăng nhập
import { getUserById } from './userService';

export const handleLogin = async (phone, password, setError, navigate) => {
  try {
    const data = await login(phone, password); // Gọi API đăng nhập
    const userDetails = await getUserById(data.id); // Lấy thông tin chi tiết người dùng bằng id

    // Lưu thông tin đầy đủ vào localStorage
    localStorage.setItem(
      'user',
      JSON.stringify({
        id: data.id,
        username: userDetails.username,
        role_id: data.role_id, // Lưu role_id nếu cần
      })
    );
    localStorage.setItem('token', data.token); // Lưu token

    // Điều hướng dựa trên role_id
    if (data.role_id === "1") {
      navigate('/admin'); // Chuyển đến trang admin
    } else if (data.role_id === "2") {
      navigate('/home'); // Chuyển đến trang home
    }
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    setError(error); // Hiển thị lỗi
  }
};

// Hàm xử lý đăng ký
export const handleRegister = async (userData, setError, navigate) => {
  try {
    const data = await register(userData);
    // Lưu thông tin người dùng vào localStorage
    localStorage.setItem('user', JSON.stringify({ id: data.id, username: data.username }));
    localStorage.setItem('token', data.token); // Lưu token nếu cần
    navigate('/home'); // Điều hướng đến trang chính
  } catch (error) {
    setError(error); // Hiển thị lỗi
  }
};