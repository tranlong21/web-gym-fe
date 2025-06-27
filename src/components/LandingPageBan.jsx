import React from 'react';
import { useLocation } from 'react-router-dom';

export default function LandingPageBan() {
  const location = useLocation();
  const reason = location.state?.reason || 'Tài khoản của bạn đã bị khóa do vi phạm quy định.';

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white shadow-md rounded-lg w-full max-w-md p-6 text-center">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 2a4 4 0 00-4 4v2H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-1V6a4 4 0 00-4-4zm-2 6V6a2 2 0 114 0v2H8zm2 5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>

        <h2 className="text-xl font-bold text-gray-800 mb-2">Tài khoản của bạn đã bị khóa</h2>

        <p className="text-red-600 font-semibold mb-4">{reason}</p>

        <div className="bg-blue-50 border border-blue-200 p-4 rounded-md text-sm text-left mb-6">
          <p className="font-semibold text-blue-600 mb-1">🔒 Ngày khóa tài khoản: <span className="font-bold">21/05/2025</span></p>
          <p className="text-gray-700">
            Tài khoản của bạn đã bị vô hiệu hóa để bảo vệ bạn và cộng đồng. Vui lòng liên hệ để được hỗ trợ mở khóa.
          </p>
        </div>

        <div className="text-sm text-gray-800 mb-6">
          Liên hệ Admin để được hỗ trợ:<br />
          📞 <a href="tel:0912118365" className="text-blue-600 font-medium">0912118365</a><br />
        </div>

        <button
          className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition"
          onClick={() => window.location.href = 'https://zalo.me/0912118365'}
        >
          Nhắn qua Zalo
        </button>
      </div>
    </div>
  );
}
