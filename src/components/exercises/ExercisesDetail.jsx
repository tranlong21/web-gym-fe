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
  const [userData, setUserData] = useState({ sex: "Male" });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = localStorage.getItem("user_id");
        if (userId) {
          const user = await getUserById(userId);
          setUserData(user);
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
    <div className="w-full min-h-screen flex flex-col md:flex-row bg-white">
      {/* BÊN TRÁI */}
      <div className="w-full md:w-1/2 p-6 relative">
        {/* Nút quay lại */}
        <button
          className="absolute top-4 left-4 text-gray-600 hover:text-blue-600 flex items-center gap-2"
          onClick={() => navigate(-1)}
        >
          <FaArrowLeft />
          <span className="text-sm">Quay lại</span>
        </button>

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

        <h1 className="text-2xl font-bold mb-4">{exercise.exercise_name}</h1>
        <div className="space-y-1 text-sm text-gray-800">
          <p><strong>Khu vực cơ:</strong> {exercise.muscle_section}</p>
          <p><strong>Thiết bị:</strong> {exercise.equipment_required}</p>
          <p><strong>Tỷ lệ cơ mục tiêu:</strong> {exercise.target_muscle_percentage}</p>
          <p><strong>Số hiệp:</strong> {exercise.recommended_sets}</p>
          <p><strong>Số reps:</strong> {exercise.recommended_reps}</p>
          <p><strong>Nghỉ giữa các hiệp:</strong> {exercise.rest_between_sets} phút</p>
        </div>

        {exercise.technique_description && (
          <div className="mt-4">
            <h2 className="font-semibold mb-2">Mô tả kỹ thuật:</h2>
            {exercise.technique_description.startsWith("[")
              ? <ul className="list-disc pl-6 space-y-1 text-sm text-gray-700">
                  {JSON.parse(exercise.technique_description).map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              : <p className="text-sm text-gray-700">{exercise.technique_description}</p>}
          </div>
        )}
      </div>

      {/* BÊN PHẢI */}
      <div className="w-full md:w-1/2 flex justify-center items-center bg-[#f1f6fa] p-6">
        {userData.sex === "Female" ? <GirlGymcanvas /> : <MaleGymcanvas />}
      </div>
    </div>
  );
};

export default ExerciseDetail;