import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GirlGymcanvas from './canvas/GirlGymcanvas.jsx';
import MaleGymcanvas from './canvas/MaleGymcanvas.jsx';
import Header from './share/Header.jsx';
import { getUserById, updateUserById } from '../services/userService';

export default function Profile() {
    const [userData, setUserData] = useState(null);
    const [isEditing, setIsEditing] = useState(false); // Trạng thái chỉnh sửa
    const [successMessage, setSuccessMessage] = useState(''); // Thông báo thành công
    const [errorMessage, setErrorMessage] = useState(''); // Thông báo lỗi
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const user = JSON.parse(localStorage.getItem('user'));
                if (user && user.id) {
                    const data = await getUserById(user.id);
                    setUserData({ ...data, id: user.id });
                } else {
                    navigate('/auth');
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };
        fetchUserData();
    }, []);

    const handleSave = async () => {
        try {
            if (!userData || !userData.id) {
                console.error("ID người dùng không hợp lệ:", userData);
                return;
            }

            const updatedData = {
                username: userData.username || '',
                email: userData.email || '',
                full_name: userData.full_name || '',
                phone: userData.phone || '',
                address: userData.address || '',
                date_of_birth: userData.date_of_birth || '1975-04-30',
                sex: userData.sex || 'Male',
                height_cm: parseFloat(userData.height_cm) || 0,
                weight_kg: parseFloat(userData.weight_kg) || 0,
            };

            const response = await updateUserById(userData.id, updatedData);
            if (response.success) {
                setSuccessMessage(response.message); // Hiển thị thông báo thành công
                setIsEditing(false);
            } else {
                setErrorMessage(response.message); // Hiển thị thông báo lỗi
            }

            // Ẩn thông báo sau 3 giây
            setTimeout(() => {
                setSuccessMessage('');
                setErrorMessage('');
            }, 3000);
        } catch (error) {
            console.error("Lỗi khi cập nhật thông tin:", error);
            setErrorMessage('Đã xảy ra lỗi khi cập nhật thông tin.');
            setTimeout(() => setErrorMessage(''), 3000);
        }
    };

    if (!userData) {
        return <div>Loading...</div>;
    }

    return (
        <div className="min-h-screen w-full overflow-y-auto">
            <Header />

            <div
                className="w-full min-h-screen flex flex-col md:flex-row"
                style={{
                    backgroundImage: "url('/background/profile-background.png')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                }}
            >

                {/* Phần Canvas bên trái */}
                <div className="w-full md:w-1/2 relative flex justify-center items-center">
                    {userData.sex === 'Male' ? <MaleGymcanvas /> : <GirlGymcanvas />}
                </div>

                {/* Phần Form bên phải */}
                <div className="w-full md:w-1/2 flex justify-center items-center p-4">

                    <div className="w-full max-w-[600px] bg-white/80 backdrop-blur-md p-6 rounded-xl shadow-md border border-gray-300 overflow-y-auto max-h-[80vh]">
                        <div className="flex justify-center mb-6">
                            <img
                                src="https://i.pravatar.cc/100"
                                alt="User Avatar"
                                className="w-24 h-24 rounded-full shadow-md"
                            />
                        </div>
                        <h2 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-orange-400 to-yellow-300 bg-clip-text text-transparent">
                            Thông tin người dùng
                        </h2>



                        <form className="space-y-4">
                            <div>
                                <label className="block mb-1">Họ và tên:</label>
                                <input
                                    type="text"
                                    value={userData.full_name || ''} // Đặt giá trị mặc định là chuỗi rỗng
                                    onChange={(e) => setUserData({ ...userData, full_name: e.target.value })}
                                    readOnly={!isEditing}
                                    className={`w-full p-2 rounded border border-gray-300 ${isEditing ? "bg-white" : "bg-gray-100"}`}
                                    style={{ borderWidth: '0.5px' }}
                                />
                            </div>
                            <div>
                                <label className="block mb-1">Email:</label>
                                <input
                                    type="email"
                                    value={userData.email || ''} // Đặt giá trị mặc định là chuỗi rỗng
                                    onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                                    readOnly={!isEditing}
                                    className={`w-full p-2 rounded border border-gray-300 ${isEditing ? "bg-white" : "bg-gray-100"}`}
                                    style={{ borderWidth: '0.5px' }}
                                />
                            </div>
                            <div>
                                <label className="block mb-1">Số điện thoại:</label>
                                <input
                                    type="text"
                                    value={userData.phone || ''} // Đặt giá trị mặc định là chuỗi rỗng
                                    onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
                                    readOnly={!isEditing}
                                    className={`w-full p-2 rounded border border-gray-300 ${isEditing ? "bg-white" : "bg-gray-100"}`}
                                    style={{ borderWidth: '0.5px' }}
                                />
                            </div>
                            <div>
                                <label className="block mb-1">Ngày sinh:</label>
                                {isEditing ? (
                                    <input
                                        type="date"
                                        value={userData.date_of_birth ? userData.date_of_birth.split('T')[0] : '1975-04-30'} // Đặt giá trị mặc định
                                        onChange={(e) => setUserData({ ...userData, date_of_birth: e.target.value })}
                                        className="w-full p-2 rounded border border-gray-300 bg-white"
                                        style={{ borderWidth: '0.5px' }}
                                    />
                                ) : (
                                    <input
                                        type="text"
                                        value={
                                            userData.date_of_birth
                                                ? new Date(userData.date_of_birth).toLocaleDateString()
                                                : '30/04/1975' // Giá trị mặc định
                                        }
                                        readOnly
                                        className="w-full p-2 rounded border border-gray-300 bg-gray-100"
                                        style={{ borderWidth: '0.5px' }}
                                    />
                                )}
                            </div>
                            <div>
                                <label className="block mb-1">Chiều cao (cm):</label>
                                <input
                                    type="number"
                                    value={userData.height_cm || ''} // Đặt giá trị mặc định là chuỗi rỗng
                                    onChange={(e) => setUserData({ ...userData, height_cm: e.target.value })}
                                    readOnly={!isEditing}
                                    className={`w-full p-2 rounded border border-gray-300 ${isEditing ? "bg-white" : "bg-gray-100"}`}
                                    style={{ borderWidth: '0.5px' }}
                                />
                            </div>
                            <div>
                                <label className="block mb-1">Cân nặng (kg):</label>
                                <input
                                    type="number"
                                    value={userData.weight_kg || ''} // Đặt giá trị mặc định là chuỗi rỗng
                                    onChange={(e) => setUserData({ ...userData, weight_kg: e.target.value })}
                                    readOnly={!isEditing}
                                    className={`w-full p-2 rounded border border-gray-300 ${isEditing ? "bg-white" : "bg-gray-100"}`}
                                    style={{ borderWidth: '0.5px' }}
                                />
                            </div>
                            <div>
                                <label className="block mb-1">Giới tính:</label>
                                {isEditing ? (
                                    <select
                                        value={userData.sex || 'Male'} // Đặt giá trị mặc định là 'Male'
                                        onChange={(e) => setUserData({ ...userData, sex: e.target.value })}
                                        className="w-full p-2 rounded border border-gray-300 bg-white"
                                        style={{ borderWidth: '0.5px' }}
                                    >
                                        <option value="Male">Nam</option>
                                        <option value="Female">Nữ</option>
                                    </select>
                                ) : (
                                    <input
                                        type="text"
                                        value={userData.sex === 'Male' ? 'Nam' : 'Nữ'}
                                        readOnly
                                        className="w-full p-2 rounded border border-gray-300 bg-gray-100"
                                        style={{ borderWidth: '0.5px' }}
                                    />
                                )}
                            </div>
                            <div>
                                {/* Hiển thị thông báo thành công */}
                                {successMessage && (
                                    <div className="mb-4 p-2 text-green-700 bg-green-100 border border-green-400 rounded">
                                        {successMessage}
                                    </div>
                                )}

                                {/* Hiển thị thông báo lỗi */}
                                {errorMessage && (
                                    <div className="mb-4 p-2 text-red-700 bg-red-100 border border-red-400 rounded">
                                        {errorMessage}
                                    </div>
                                )}
                            </div>
                            {isEditing ? (
                                <button
                                    type="button"
                                    onClick={handleSave}
                                    className="w-full py-2 rounded bg-green-500 text-white font-bold hover:bg-green-600 transition duration-300"
                                >
                                    Lưu
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => setIsEditing(true)}
                                    className="w-full py-2 rounded bg-blue-500 text-white font-bold hover:bg-blue-600 transition duration-300"
                                >
                                    Sửa
                                </button>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}