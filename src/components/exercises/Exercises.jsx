import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Muscle from "../Muscle";
import { getExercisesByMuscleGroup, API_PREFIX } from "../../services/ExerciseService";
import Layout from "../LayOut";

const Exercises = () => {
  const { muscleId } = useParams();
  const [exercises, setExercises] = useState([]);
  const [selectedMuscleId, setSelectedMuscleId] = useState(muscleId || null);
  const navigate = useNavigate();

  const handleMuscleClick = async (muscleId) => {
    setSelectedMuscleId(muscleId);

    navigate(`/exercises/${muscleId}`);

    try {
      const data = await getExercisesByMuscleGroup(muscleId);
      setExercises(data);
    } catch (error) {
      console.error("Error fetching exercises:", error);
    }
  };

  useEffect(() => {
    if (muscleId) {
      handleMuscleClick(muscleId);
    }
  }, [muscleId]);

  return (
    <Layout>
      <div className="min-h-screen flex flex-col">
        <div className="flex w-full h-full overflow-y-auto">
          {/* 2/3 bên trái */}
          <div className="w-2/3 p-8 font-sans">
            {Array.isArray(exercises) && exercises.map((exercise, index) => (
              <div key={index} style={{ backgroundColor: "#f9f9f9", borderRadius: "10px", padding: "1.5rem", marginBottom: "2rem", boxShadow: "0 2px 10px rgba(0,0,0,0.1)" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", backgroundColor: "#1e3a8a", padding: "1rem", borderRadius: "8px 8px 0 0", color: "white" }}>
                  <h2 style={{ margin: 0 }}>{exercise.exercise_name || "Không có tên"}</h2>
                  <span style={{ backgroundColor: "#facc15", color: "#000", padding: "4px 8px", borderRadius: "6px", fontWeight: "bold" }}>
                    {exercise.muscle_section || "Không rõ vùng cơ"}
                  </span>
                </div>
                <div style={{ marginTop: "1rem" }}>
                  <p><strong>Mục tiêu cơ bắp:</strong> {exercise.target_muscle_percentage || "..."}</p>
                </div>

                <div className="mt-3">
                  <button
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
                    onClick={() => navigate(`/exercise-detail/${exercise.exercise_id}`)}
                  >
                    Xem chi tiết
                  </button>
                </div>
              </div>
            ))}

          </div>

          {/* 1/3 bên phải */}
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
    </Layout>
  );
};

export default Exercises;