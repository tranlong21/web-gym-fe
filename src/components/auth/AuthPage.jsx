import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleLogin, handleRegister } from '../../services/authService';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [phoneNumber, setPhoneNumber] = useState('0702050435');
  const [password, setPassword] = useState('123');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [registerData, setRegisterData] = useState({
    username: '',
    full_name: '',
    phone: '',
    weight_kg: '',
    height_cm: '',
    email: '',
    password_hash: '',
    retype_password: '',
    address: '',
    date_of_birth: '',
    role_id: 2,
  });
  const navigate = useNavigate();

  const onLoginSubmit = async (e) => {
    e.preventDefault();
    await handleLogin(phoneNumber, password, setError, navigate);
  };

  const onRegisterSubmit = async (e) => {
    e.preventDefault();
    if (registerData.password_hash !== registerData.retype_password) {
      setError('Passwords do not match!');
      return;
    }
    await handleRegister(registerData, setError, navigate);
  };

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="flex min-h-screen justify-center items-center bg-gradient-to-r from-blue-700 to-purple-500">
      <div className="w-[900px] flex bg-white shadow-2xl rounded-[30px] overflow-hidden h-[500px]">
        {isLogin ? (
          <>
            {/* FORM LOGIN */}
            <div className="w-1/2 bg-white text-gray-800 p-10 flex flex-col justify-center h-full">
              <h2 className="text-3xl font-bold mb-6 text-center">Sign In</h2>
              <form className="space-y-4" onSubmit={onLoginSubmit}>
                <input
                  type="text"
                  placeholder="Phone Number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full p-3 border rounded-md"
                />
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-3 border rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-600"
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <button
                  type="submit"
                  className="w-full bg-indigo-600 text-white font-bold py-3 rounded hover:bg-indigo-700 transition"
                >
                  SIGN IN
                </button>
              </form>
            </div>
            <div className="w-1/2 bg-indigo-800 text-white flex flex-col items-center justify-center p-10 rounded-l-[200px] h-full">
              <h2 className="text-3xl font-bold mb-4">Hello, Friend!</h2>
              <button
                onClick={() => {
                  setIsLogin(false);
                  setError('');
                  setPassword('');
                }}
                className="border border-white py-2 px-6 rounded hover:bg-white hover:text-indigo-800 transition-all"
              >
                SIGN UP
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="w-1/2 bg-indigo-800 text-white flex flex-col items-center justify-center px-8 py-12 rounded-r-[200px] h-full">
              <h2 className="text-3xl font-bold mb-4">Welcome Back!</h2>
              <button
                onClick={() => {
                  setIsLogin(true);
                  setError('');
                  setPassword('');
                }}
                className="border border-white px-6 py-2 rounded hover:bg-white hover:text-indigo-800 transition"
              >
                SIGN IN
              </button>
            </div>
            <div className="w-1/2 p-10 h-full overflow-y-auto">
              <h2 className="text-3xl font-bold mb-4 text-center">Register</h2>
              <form className="space-y-4" onSubmit={onRegisterSubmit}>
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  value={registerData.username}
                  onChange={handleRegisterChange}
                  className="w-full p-3 border rounded-md"
                />
                <input
                  type="text"
                  name="full_name"
                  placeholder="Full Name"
                  value={registerData.full_name}
                  onChange={handleRegisterChange}
                  className="w-full p-3 border rounded-md"
                />
                <input
                  type="text"
                  name="phone"
                  placeholder="Phone Number"
                  value={registerData.phone}
                  onChange={handleRegisterChange}
                  className="w-full p-3 border rounded-md"
                />
                <input
                  type="text"
                  name="address"
                  placeholder="Address"
                  value={registerData.address}
                  onChange={handleRegisterChange}
                  className="w-full p-3 border rounded-md"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={registerData.email}
                  onChange={handleRegisterChange}
                  className="w-full p-3 border rounded-md"
                />
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password_hash"
                    placeholder="Password"
                    value={registerData.password_hash}
                    onChange={handleRegisterChange}
                    className="w-full p-3 border rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-600"
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="retype_password"
                    placeholder="Confirm Password"
                    value={registerData.retype_password}
                    onChange={handleRegisterChange}
                    className="w-full p-3 border rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-600"
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <button
                  type="submit"
                  className="w-full bg-purple-600 text-white font-bold py-3 rounded hover:bg-purple-700 transition"
                >
                  SIGN UP
                </button>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
} 