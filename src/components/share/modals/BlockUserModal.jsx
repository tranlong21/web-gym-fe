import React, { useState } from "react";

const BlockUserModal = ({ visible, onClose, onSubmit, user }) => {
  const [days, setDays] = useState("");
  const [reason, setReason] = useState("");

  if (!visible || !user) return null;

  const handleSubmit = () => {
    const until = new Date();
    until.setDate(until.getDate() + Number(days));
    onSubmit(user.id, {
      block_reason: reason,
      block_until: until.toISOString(),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded p-6 w-[400px]">
        <h2 className="text-lg font-bold mb-4">Khóa người dùng: {user.username}</h2>
        <label className="block mb-1">Lý do vi phạm:</label>
        <input
          type="text"
          className="w-full border p-2 mb-3"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="VD: Spam, nội dung phản cảm..."
        />
        <label className="block mb-1">Số ngày khóa:</label>
        <input
          type="number"
          className="w-full border p-2 mb-3"
          value={days}
          onChange={(e) => setDays(e.target.value)}
          placeholder="VD: 7"
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
