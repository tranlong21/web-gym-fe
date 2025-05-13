import React, { useState, useEffect } from "react";
import { FaPlus, FaSearch, FaEdit, FaTrash, FaVideo } from "react-icons/fa";
import AdminSidebar from "../layout _admin/AdminSidebar";
import ExercisesFormModal from "../share/modals/ExercisesFormModal";
import {
  getExercises,
  createExercise,
  updateExercise,
  deleteExercise,
} from "../../services/ExerciseService";

const ExercisesAdmin = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);

  const limit = 5;

  const fetchExercises = async () => {
    setLoading(true);
    try {
      const { exercises, totalPages } = await getExercises(page, limit);
      const normalizedData = exercises.map((e) => ({ ...e, id: e.exercise_id }));
      setData(normalizedData);
      setTotalPages(totalPages);
    } catch (error) {
      console.error("Error fetching exercises:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setData([]);
    fetchExercises();
  }, [page]);

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete?");
    if (confirmed) {
      try {
        await deleteExercise(id);
        await fetchExercises();
      } catch (error) {
        console.error("Error deleting exercise:", error);
      }
    }
  };

  const handleSubmit = async (exercise) => {
    try {
      if (editingItem) {
        await updateExercise(editingItem.id, exercise);
      } else {
        await createExercise(exercise);
      }
      await fetchExercises();
    } catch (error) {
      console.error("Error submitting exercise:", error);
    }
    setEditingItem(null);
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
      <div className="flex-1 bg-white shadow-md rounded-lg">
        <div className="flex items-center justify-between px-4 py-3 bg-gray-100 border-b">
          <button
            onClick={() => {
              setEditingItem(null);
              setModalOpen(true);
            }}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            <FaPlus /> Add Exercise
          </button>
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-gray-400">
              <FaSearch />
            </span>
            <input
              type="text"
              placeholder="Search by exercise name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-md text-sm focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-10 text-gray-500 text-lg">
            Loading...
          </div>
        ) : (
          <div className="overflow-x-auto max-h-[80vh] overflow-y-auto">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-4 py-3">STT</th>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Muscle Group ID</th>
                  <th className="px-4 py-3">Muscle Section</th>
                  <th className="px-4 py-3">Technique</th>
                  <th className="px-4 py-3">Equipment</th>
                  <th className="px-4 py-3">% Target</th>
                  <th className="px-4 py-3">Sets</th>
                  <th className="px-4 py-3">Reps</th>
                  <th className="px-4 py-3">Rest</th>
                  <th className="px-4 py-3 text-center">Video</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data
                  .filter((item) =>
                    item.exercise_name
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase())
                  )
                  .map((item, index) => (
                    <tr key={item.id || index} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3">{page * limit + index + 1}</td>
                      <td className="px-4 py-3">{item.exercise_name}</td>
                      <td className="px-4 py-3">{item.muscle_group_id}</td>
                      <td className="px-4 py-3">{item.muscle_section}</td>
                      <td className="px-4 py-3">{item.technique_description}</td>
                      <td className="px-4 py-3">{item.equipment_required}</td>
                      <td className="px-4 py-3">{item.target_muscle_percentage}</td>
                      <td className="px-4 py-3">{item.recommended_sets}</td>
                      <td className="px-4 py-3">{item.recommended_reps}</td>
                      <td className="px-4 py-3">{item.rest_between_sets}</td>
                      <td className="px-4 py-3 text-center">
                        {item.video_url ? (
                          <a
                            href={item.video_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            <FaVideo />
                          </a>
                        ) : (
                          <span className="text-gray-400">NULL</span>
                        )}
                      </td>
                      <td className="px-4 py-3 flex gap-3">
                        <button
                          onClick={() => {
                            setEditingItem(item);
                            setModalOpen(true);
                          }}
                          className="text-gray-600 hover:text-yellow-500"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        <div className="flex justify-center items-center mt-4 gap-2">
          <button
            onClick={() => handlePageChange("prev")}
            disabled={page === 0}
            className={`px-4 py-2 rounded ${
              page === 0 ? "bg-gray-300" : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            Previous
          </button>

          {/* Page Numbers */}
          {(() => {
            const maxPagesToShow = 5;
            const startPage = Math.max(0, page - Math.floor(maxPagesToShow / 2));
            const endPage = Math.min(totalPages, startPage + maxPagesToShow);

            const pages = [];
            for (let i = startPage; i < endPage; i++) {
              pages.push(
                <button
                  key={`page-${i}`}
                  onClick={() => setPage(i)}
                  className={`px-3 py-1 rounded ${
                    page === i ? "bg-blue-700 text-white" : "bg-gray-200 text-black"
                  }`}
                >
                  {i + 1}
                </button>
              );
            }
            return pages;
          })()}

          <button
            onClick={() => handlePageChange("next")}
            disabled={page === totalPages - 1}
            className={`px-4 py-2 rounded ${
              page === totalPages - 1 ? "bg-gray-300" : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            Next
          </button>
        </div>

        {/* Modal */}
        <ExercisesFormModal
          visible={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setEditingItem(null);
          }}
          onSubmit={handleSubmit}
          initialData={editingItem}
        />
      </div>
    </div>
  );
};

export default ExercisesAdmin;
