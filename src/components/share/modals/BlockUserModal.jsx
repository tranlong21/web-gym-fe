import React, { useState } from "react";

const BlockUserModal = ({ visible, onClose, onSubmit, user }) => {
  const [reason, setReason] = useState("");

  if (!visible || !user) return null;

  const handleSubmit = () => {
    if (!reason.trim()) {
      alert("Vui lòng nhập lý do khóa.");
      return;
    }
    onSubmit(user.id, reason);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded p-6 w-[400px]">
        <h2 className="text-lg font-bold mb-4">Khóa người dùng: {user.username}</h2>

        <label className="block mb-1">Lý do vi phạm:</label>
        <input
          type="text"
          className="w-full border p-2 mb-4"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="VD: Spam, nội dung phản cảm..."
        />

        <div className="flex justify-end gap-2">
          <button
            className="bg-gray-300 px-3 py-1 rounded hover:bg-gray-400"
            onClick={onClose}
          >
            Hủy
          </button>
          <button
            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            onClick={handleSubmit}
          >
            Khóa
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlockUserModal;
