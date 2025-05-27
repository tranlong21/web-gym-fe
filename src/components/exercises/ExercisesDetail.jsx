import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getExerciseById, API_PREFIX } from "../../services/ExerciseService";
import { getUserById } from "../../services/userService";
import { FaVideo, FaArrowLeft } from "react-icons/fa";
import MaleGymcanvas from "../canvas/MaleGymcanvas";
import GirlGymcanvas from "../canvas/GirlGymcanvas";

const ExerciseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [exercise, setExercise] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user && user.id) {
          const userDataRes = await getUserById(user.id);
          setUserData({ ...userDataRes, id: user.id });
        }

        const ex = await getExerciseById(id);
        setExercise(ex);
      } catch (err) {
        console.error("❌ Lỗi khi tải dữ liệu:", err);
      }
    };
    fetchData();
  }, [id]);

  if (!exercise) return <p className="p-4">Đang tải dữ liệu...</p>;

  return (
    <div className="w-full min-h-screen flex flex-col md:flex-row bg-white md:px-12">
      {/* Nút quay lại cố định */}
      <button
        className="fixed top-4 left-4 z-50 text-gray-600 hover:text-blue-600 flex items-center gap-2 bg-white/80 px-2 py-1 rounded shadow"
        onClick={() => navigate(-1)}
      >
        <FaArrowLeft />
        <span className="text-sm">Quay lại</span>
      </button>

      {/* BÊN TRÁI */}
      <div className="w-full md:w-1/2 p-6 relative">
        <div className="mb-6 mt-10">
          {exercise.video_url ? (
            <video
              src={`${API_PREFIX}exercises/videos/${exercise.video_url}`}
              controls
              className="w-full rounded-lg shadow"
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-gray-400 py-8">
              <FaVideo size={48} />
              <p className="mt-2 text-sm">Chưa có video minh họa</p>
            </div>
          )}
        </div>

        {/* THÔNG TIN CHI TIẾT & MÔ TẢ KỸ THUẬT */}
        <div className="space-y-4 mt-6 p-6 bg-gradient-to-br from-white via-blue-50 to-white rounded-xl border border-blue-200 shadow-md">
          <h1 className="text-3xl font-extrabold text-[#1a2e66]">{exercise.exercise_name}</h1>

          <div className="text-sm text-gray-800 space-y-1">
            <p><strong className="text-gray-600">🎯 Khu vực cơ:</strong> {exercise.muscle_section}</p>
            <p><strong className="text-gray-600">🏋️ Thiết bị:</strong> {exercise.equipment_required}</p>
            <p><strong className="text-gray-600">🎯 Tỷ lệ cơ mục tiêu:</strong> {exercise.target_muscle_percentage}</p>
            <p><strong className="text-gray-600">🔁 Số hiệp:</strong> {exercise.recommended_sets}</p>
            <p><strong className="text-gray-600">🔂 Số reps:</strong> {exercise.recommended_reps}</p>
            <p><strong className="text-gray-600">⏱️ Nghỉ giữa các hiệp:</strong> {exercise.rest_between_sets} phút</p>
          </div>

          {exercise.technique_description && (
            <div className="mt-4">
              <h2 className="text-lg font-semibold text-[#1a2e66] mb-2">📋 Mô tả kỹ thuật:</h2>
              {exercise.technique_description.startsWith("[") ? (
                <ol className="space-y-3 pl-2 text-sm text-gray-900">
                  {JSON.parse(exercise.technique_description).map((step, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <div className="w-6 h-6 flex items-center justify-center rounded-full bg-gradient-to-b from-[#1a2e66] to-[#17306f] text-white text-xs font-bold shadow-md">
                        {i + 1}
                      </div>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="text-sm text-gray-700">{exercise.technique_description}</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* BÊN PHẢI */}
      <div className="w-full md:w-1/2 flex justify-center items-center bg-[#f1f6fa] p-6">
        {userData?.sex === "Female" ? <GirlGymcanvas /> : <MaleGymcanvas />}
      </div>
    </div>
  );
};

export default ExerciseDetail;
