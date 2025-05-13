import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // Import useLocation
import { musclePathsFront, musclePathsBack } from "../app/data";

const Muscle = ({ onMuscleClick }) => {
  const navigate = useNavigate();
  const location = useLocation(); // Lấy state từ navigate
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    // Nếu có state từ navigate, đặt selectedId
    if (location.state?.selectedId) {
      setSelectedId(location.state.selectedId);
    }
  }, [location.state]);

  const handleClick = (muscleLabel, muscleId) => {
    setSelectedId(muscleId); // Cập nhật id phần cơ được chọn
    if (onMuscleClick) {
      onMuscleClick(muscleId);
    } else {
      navigate(`/exercises/${muscleId}`, { state: { selectedId: muscleId } }); // Truyền selectedId qua state
    }
  };

  return (
    <div className="min-h-screen bg-[#f1f6fa] flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Chọn nhóm <span className="text-[#fe5b7f]">cơ</span> bạn muốn tập luyện
      </h1>

      <div className="max-w-[99%] mx-auto flex gap-12 justify-center items-center">
        {/* Body phía trước */}
        <svg viewBox="0 0 660 1206" xmlns="http://www.w3.org/2000/svg" className="w-[300px] h-auto drop-shadow-md">
          {musclePathsFront.map(({ label, d, fill, id }, index) => {
            const isInteractive = fill !== "none";
            const defaultColor = selectedId === id ? "#fe5b7f" : isInteractive ? "#FFF0F5" : "none";
            const hoverColor = "#fe5b7f";

            return (
              <path
                key={index}
                d={d}
                fill={defaultColor}
                stroke="#1e293b"
                strokeWidth="1.2"
                className={`transition-all duration-200 ease-in-out ${isInteractive ? "cursor-pointer" : ""}`}
                {...(isInteractive && {
                  onClick: () => handleClick(label, id),
                  onMouseEnter: (e) => e.target.setAttribute("fill", hoverColor),
                  onMouseLeave: (e) => e.target.setAttribute("fill", selectedId === id ? hoverColor : "#FFF0F5"),
                })}
              />
            );
          })}
        </svg>

        {/* Body phía sau */}
        <svg viewBox="0 0 660 1206" xmlns="http://www.w3.org/2000/svg" className="w-[300px] h-auto drop-shadow-md">
          {musclePathsBack.map(({ label, d, fill, id }, index) => {
            const isInteractive = fill !== "none";
            const defaultColor = selectedId === id ? "#fe5b7f" : isInteractive ? "#FFF0F5" : "none";
            const hoverColor = "#fe5b7f";

            return (
              <path
                key={index}
                d={d}
                fill={defaultColor}
                stroke="#1e293b"
                strokeWidth="1.2"
                className={`transition-all duration-200 ease-in-out ${isInteractive ? "cursor-pointer" : ""}`}
                {...(isInteractive && {
                  onClick: () => handleClick(label, id),
                  onMouseEnter: (e) => e.target.setAttribute("fill", hoverColor),
                  onMouseLeave: (e) => e.target.setAttribute("fill", selectedId === id ? hoverColor : "#FFF0F5"),
                })}
              />
            );
          })}
        </svg>
      </div>
    </div>
  );
};

export default Muscle;