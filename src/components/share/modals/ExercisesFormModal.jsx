import React, { useState, useEffect } from "react";
import { API_PREFIX } from "../../../services/ExerciseService";

const defaultForm = {
  exercise_name: "",
  muscle_group_id: "",
  muscle_section: "",
  technique_description: [],
  equipment_required: "",
  target_muscle_percentage: "",
  recommended_sets: "",
  recommended_reps: "",
  rest_between_sets: "",
  video_url: "",
  video_file: null,
};

const ExercisesFormModal = ({ visible, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState(defaultForm);

  useEffect(() => {
    if (initialData) {
      const parsedTechnique = (() => {
        try {
          return JSON.parse(initialData.technique_description);
        } catch {
          return initialData.technique_description
            ? [initialData.technique_description]
            : [];
        }
      })();

      setFormData({
        ...defaultForm,
        ...initialData,
        technique_description: parsedTechnique,
        video_file: null,
      });
    } else {
      setFormData(defaultForm);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTechniqueChange = (index, value) => {
    const updated = [...formData.technique_description];
    updated[index] = value;
    setFormData((prev) => ({ ...prev, technique_description: updated }));
  };

  const addStep = () => {
    setFormData((prev) => ({
      ...prev,
      technique_description: [...prev.technique_description, ""],
    }));
  };

  const removeStep = (index) => {
    const updated = [...formData.technique_description];
    updated.splice(index, 1);
    setFormData((prev) => ({ ...prev, technique_description: updated }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({ ...prev, video_file: file }));
  };

  const handleSubmit = () => {
  if (!formData.exercise_name || formData.technique_description.length === 0) {
    alert("Vui lòng điền đầy đủ thông tin.");
    return;
  }

  const dataToSubmit = {
    ...formData,
    // Không JSON.stringify nữa
  };

  console.log("📤 Gửi từ Modal:", dataToSubmit); // 👈 kiểm tra có gọi không

  onSubmit(dataToSubmit);
  onClose();
};


  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 overflow-auto">
      <div className="bg-white w-full max-w-3xl rounded-lg p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">
          {initialData ? "Edit Exercise" : "Add Exercise"}
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            name="exercise_name"
            value={formData.exercise_name}
            onChange={handleChange}
            placeholder="Tên bài tập"
            className="col-span-2 border px-3 py-2 rounded"
          />
          <input
            type="number"
            name="muscle_group_id"
            value={formData.muscle_group_id}
            onChange={handleChange}
            placeholder="ID nhóm cơ"
            className="border px-3 py-2 rounded"
          />
          <input
            type="text"
            name="muscle_section"
            value={formData.muscle_section}
            onChange={handleChange}
            placeholder="Phân vùng cơ"
            className="border px-3 py-2 rounded"
          />
          <input
            type="text"
            name="equipment_required"
            value={formData.equipment_required}
            onChange={handleChange}
            placeholder="Dụng cụ"
            className="border px-3 py-2 rounded"
          />
          <input
            type="text"
            name="target_muscle_percentage"
            value={formData.target_muscle_percentage}
            onChange={handleChange}
            placeholder="Tỷ lệ cơ tác động"
            className="border px-3 py-2 rounded"
          />
          <input
            type="number"
            name="recommended_sets"
            value={formData.recommended_sets}
            onChange={handleChange}
            placeholder="Số hiệp"
            className="border px-3 py-2 rounded"
          />
          <input
            type="number"
            name="recommended_reps"
            value={formData.recommended_reps}
            onChange={handleChange}
            placeholder="Số lần lặp"
            className="border px-3 py-2 rounded"
          />
          <input
            type="number"
            name="rest_between_sets"
            value={formData.rest_between_sets}
            onChange={handleChange}
            placeholder="Nghỉ giữa hiệp"
            className="border px-3 py-2 rounded"
          />

          {/* TECHNIQUE ARRAY */}
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1">Các bước kỹ thuật:</label>
            {formData.technique_description.map((step, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={step}
                  onChange={(e) => handleTechniqueChange(index, e.target.value)}
                  className="flex-1 border px-3 py-2 rounded"
                />
                <button onClick={() => removeStep(index)} className="text-red-500">X</button>
              </div>
            ))}
            <button onClick={addStep} className="text-blue-600 mt-1">+ Thêm bước</button>
          </div>

          {/* VIDEO */}
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1">Upload Video</label>
            <input type="file" accept="video/*" onChange={handleFileChange} />
            {formData.video_file ? (
              <video controls className="mt-2 w-full max-h-64">
                <source src={URL.createObjectURL(formData.video_file)} type="video/mp4" />
              </video>
            ) : formData.video_url ? (
              <video controls className="mt-2 w-full max-h-64">
                <source src={`${API_PREFIX}exercises/videos/${formData.video_url}`} type="video/mp4" />
              </video>
            ) : null}
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {initialData ? "Update" : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExercisesFormModal;