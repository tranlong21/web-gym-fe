import axios from "axios";
const API_PREFIX = 'http://localhost:8091/api/v1/';

// Hàm lấy thông tin người dùng theo ID
export const getUserById = async (id) => {
    try {
        const response = await fetch(`${API_PREFIX}users/get/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (!response.ok) {
            const errorDetails = await response.json();
            console.error('Chi tiết lỗi khi lấy thông tin người dùng:', errorDetails);
            throw new Error('Failed to fetch user data');
        }

        return await response.json(); // Trả về thông tin người dùng
    } catch (error) {
        console.error('Error fetching user data:', error);
        throw error;
    }
};


// Hàm cập nhật thông tin người dùng theo ID
export const updateUserById = async (id, updatedData) => {
    try {
        if (!id) {
            throw new Error("ID không hợp lệ");
        }

        console.log("Dữ liệu gửi lên API:", updatedData);
        const response = await fetch(`${API_PREFIX}users/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`, // Thêm token nếu cần
            },
            body: JSON.stringify(updatedData),
        });

        if (!response.ok) {
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                const errorDetails = await response.json();
                console.error('Chi tiết lỗi từ server khi cập nhật:', errorDetails);
                throw new Error(errorDetails.message || 'Failed to update user data');
            } else {
                const errorText = await response.text();
                console.error('Phản hồi không phải JSON:', errorText);
                throw new Error(errorText || 'Failed to update user data');
            }
        }

        const result = await response.json();
        console.log('Cập nhật thành công:', result);
        return { success: true, message: 'Cập nhật thông tin thành công!', data: result }; // Trả về thông báo thành công
    } catch (error) {
        console.error('Error updating user data:', error);
        return { success: false, message: error.message || 'Lỗi khi cập nhật thông tin' }; // Trả về thông báo lỗi
    }
};

// lấy dữ liệu nhiều người dùng và phân trangtrang
export const getUsers = async (page = 0, limit = 3) => {
    try {
        const params = { page, limit };
        const response = await axios.get(`${API_PREFIX}users`, { params });

        const users = response.data.users.map((user) => ({
            id: user.id,
            username: user.username,
            full_name: user.full_name,
            sex: user.sex,
            email: user.email,
            phone: user.phone,
            address: user.address,
            date_of_birth: user.date_of_birth,
            height_cm: user.height_cm,
            weight_kg: user.weight_kg,
            is_active: user.is_active, 
        }));


        return { users, totalPages: response.data.totalPages };
    } catch (error) {
        console.error("Error fetching users:", error);
        throw error;
    }
};

// Ban (xóa mềm) người dùng bằng DELETE + body
export const banUserById = async (id, reason) => {
  try {
    const response = await fetch(`${API_PREFIX}users/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ ban_reason: reason }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Failed to ban user');
    }

    return { success: true, message: 'Khóa người dùng thành công!' };
  } catch (error) {
    console.error('Lỗi khi khóa người dùng:', error);
    return { success: false, message: error.message };
  }
};
