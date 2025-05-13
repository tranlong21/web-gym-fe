import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // Import useParams để lấy muscleId từ URL
import { Header } from "../share";
import Muscle from "../muscle"; // Import Muscle component
import { getExercisesByMuscleGroup } from "../../services/ExerciseService"; // Import service

const ExercisesDetail = () => {
  const { muscleId } = useParams(); // Lấy muscleId từ URL
  const [exercises, setExercises] = useState([]);
  const [selectedMuscleId, setSelectedMuscleId] = useState(muscleId || null);

  // Hàm xử lý khi chọn nhóm cơ
  const handleMuscleClick = async (muscleId) => {
    setSelectedMuscleId(muscleId);
    try {
      const data = await getExercisesByMuscleGroup(muscleId);
      setExercises(data);
    } catch (error) {
      console.error("Error fetching exercises:", error);
    }
  };

  useEffect(() => {
    if (muscleId) {
      handleMuscleClick(muscleId); // Gọi hàm khi có muscleId từ URL
    }
  }, [muscleId]);

  return (
    <div style={{ height: "100vh", overflow: "auto", display: "flex", flexDirection: "column" }}>
      <Header />
      
      <div className="flex w-full h-full">
        {/* Phần 2/3 bên trái */}
        <div className="w-2/3 p-8 font-sans">
          {exercises.map((exercise, index) => (
            <div
              key={index}
              style={{
                backgroundColor: "#f9f9f9",
                borderRadius: "10px",
                padding: "1.5rem",
                marginBottom: "2rem",
                boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  backgroundColor: "#1e3a8a",
                  padding: "1rem",
                  borderRadius: "8px 8px 0 0",
                  color: "white"
                }}
              >
                <h2 style={{ margin: 0 }}>{exercise.exercise_name}</h2>
                <span
                  style={{
                    backgroundColor: "#facc15",
                    color: "#000",
                    padding: "4px 8px",
                    borderRadius: "6px",
                    fontWeight: "bold"
                  }}
                >
                  {exercise.muscle_section}
                </span>
              </div>

              <div style={{ marginTop: "1rem" }}>
                <p><strong>Thiết bị:</strong> {exercise.equipment_required}</p>
                <p><strong>Mục tiêu cơ bắp:</strong> {exercise.target_muscle_percentage}</p>
                <p><strong>Số hiệp:</strong> {exercise.recommended_sets}</p>
                <p><strong>Số lần lặp của 1 hiệp:</strong> {exercise.recommended_reps}</p>
                <p><strong>Thời gian nghỉ giữa hiệp:</strong> {exercise.rest_between_sets} minutes</p>
              </div>

              <div style={{ marginTop: "1rem" }}>
                <h3>Mô tả kỹ thuật:</h3>
                <ul style={{ paddingLeft: "1.5rem" }}>
                  {JSON.parse(exercise.technique_description).map((step, i) => (
                    <li key={i} style={{ marginBottom: "0.5rem" }}>{step}</li>
                  ))}
                </ul>
              </div>

              {exercise.video_url && (
                <div style={{ marginTop: "1rem" }}>
                  <video
                    src={exercise.video_url}
                    controls
                    style={{ width: "100%", borderRadius: "8px" }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Phần 1/3 bên phải */}
        <div
  className="w-1/3 p-8 bg-[#f1f6fa]"
  style={{
    position: "fixed", 
    right: 0, 
    top: 0, 
    height: "100vh", 
    overflowY: "auto", 
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)", 
  }}
>
  <Muscle onMuscleClick={handleMuscleClick} />
</div>

      </div>
    </div>
  );
};

export default ExercisesDetail;