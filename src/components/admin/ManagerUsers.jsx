import React, { useEffect, useState } from "react";
import { getUsers, banUserById } from "../../services/userService";
import AdminSidebar from "../layout _admin/AdminSidebar";
import UserFormModal from "../share/modals/UserFormModal";
import BlockUserModal from "../share/modals/BlockUserModal";
import { FaEdit, FaLock, FaLockOpen } from "react-icons/fa";

const ManagerUsers = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [blockModalOpen, setBlockModalOpen] = useState(false);
  const [blockingUser, setBlockingUser] = useState(null);

  const limit = 3;

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { users: fetchedUsers, totalPages } = await getUsers(page, limit);
      setUsers(fetchedUsers);
      setTotalPages(totalPages);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page]);

  const handleUpdate = async (userData) => {
    try {
      if (editingUser) {
        await updateUserById(editingUser.id, userData);
        await fetchUsers();
        setEditingUser(null);
      }
    } catch (err) {
      console.error("Error updating user:", err);
    }
  };

  const handleOpenBlockModal = (user) => {
    if (!user.is_active) {
      const confirmUnlock = window.confirm(`Bạn chắc chắn muốn mở khóa người dùng "${user.username}" chứ?`);
      if (confirmUnlock) {
        // TODO: Gửi API mở khóa ở đây
        alert("Đã gửi yêu cầu mở khóa (giả lập)");

        fetchUsers();
      }
    } else {
      setBlockingUser(user);
      setBlockModalOpen(true);
    }
  };

  const handleBlockUser = async (id, reason) => {
    try {
      await banUserById(id, reason);
      fetchUsers();
    } catch (err) {
      console.error("Lỗi khi khóa người dùng:", err);
    }
  };

  const handlePageChange = (direction) => {
    if (direction === "next" && page < totalPages - 1) {
      setPage(page + 1);
    } else if (direction === "prev" && page > 0) {
      setPage(page - 1);
    }
  };

  return (
    <div className="flex h-screen">
      <AdminSidebar />
      <div className="p-6 w-full">
        <h1 className="text-2xl font-bold mb-4">Manage Users</h1>

        {loading ? (
          <div className="text-center text-gray-500">Loading...</div>
        ) : (
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr>
                <th className="border border-gray-300 px-4 py-2">STT</th>
                <th className="border border-gray-300 px-4 py-2">Username</th>
                <th className="border border-gray-300 px-4 py-2">Full Name</th>
                <th className="border border-gray-300 px-4 py-2">Sex</th>
                <th className="border border-gray-300 px-4 py-2">Date of Birth</th>
                <th className="border border-gray-300 px-4 py-2">Address</th>
                <th className="border border-gray-300 px-4 py-2">Email</th>
                <th className="border border-gray-300 px-4 py-2">Phone</th>
                <th className="border border-gray-300 px-4 py-2">Height (cm)</th>
                <th className="border border-gray-300 px-4 py-2">Weight (kg)</th>
                <th className="border border-gray-300 px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={user.id || `fallback-${index}`}>
                  <td className="border border-gray-300 px-4 py-2">{page * limit + index + 1}</td>
                  <td className="border border-gray-300 px-4 py-2">{user.username}</td>
                  <td className="border border-gray-300 px-4 py-2">{user.full_name}</td>
                  <td className="border border-gray-300 px-4 py-2">{user.sex}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    {user.date_of_birth
                      ? new Date(user.date_of_birth).toLocaleDateString("vi-VN")
                      : "N/A"}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">{user.address || "N/A"}</td>
                  <td className="border border-gray-300 px-4 py-2">{user.email}</td>
                  <td className="border border-gray-300 px-4 py-2">{user.phone}</td>
                  <td className="border border-gray-300 px-4 py-2">{user.height_cm || "N/A"}</td>
                  <td className="border border-gray-300 px-4 py-2">{user.weight_kg || "N/A"}</td>
                  <td className="border border-gray-300 px-4 py-2 text-center flex gap-2 justify-center">
                    <button
                      onClick={() => {
                        setEditingUser(user);
                        setModalOpen(true);
                      }}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleOpenBlockModal(user)}
                      className={`hover:text-red-700 ${user.is_active ? "text-red-500" : "text-gray-400"}`}
                      title={user.is_active ? "Khóa người dùng" : "Đã bị khóa"}
                    >
                      {user.is_active ? <FaLockOpen /> : <FaLock />}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <div className="flex justify-center items-center mt-4 gap-2">
          <button
            onClick={() => handlePageChange("prev")}
            disabled={page === 0}
            className={`px-4 py-2 rounded ${page === 0 ? "bg-gray-300" : "bg-blue-600 text-white hover:bg-blue-700"}`}
          >
            Previous
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button key={`page-${i}`}>{i + 1}</button>
          ))}
          <button
            onClick={() => handlePageChange("next")}
            disabled={page === totalPages - 1}
            className={`px-4 py-2 rounded ${page === totalPages - 1 ? "bg-gray-300" : "bg-blue-600 text-white hover:bg-blue-700"}`}
          >
            Next
          </button>
        </div>

        <UserFormModal
          visible={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setEditingUser(null);
          }}
          onSubmit={handleUpdate}
          initialData={editingUser}
        />
        <BlockUserModal
          visible={blockModalOpen}
          user={blockingUser}
          onClose={() => setBlockModalOpen(false)}
          onSubmit={handleBlockUser}
        />
      </div>
    </div>
  );
};

export default ManagerUsers;
