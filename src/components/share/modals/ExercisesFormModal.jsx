import React, { useState, useEffect } from "react";

const defaultForm = {
  exercise_name: "",
  muscle_group_id: "",
  muscle_section: "",
  technique_description: "",
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
      setFormData({
        ...defaultForm,
        ...initialData,
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({ ...prev, video_file: file }));
  };

  const handleSubmit = () => {
    onSubmit(formData);
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
          {Object.keys(defaultForm)
            .filter((key) => key !== "video_file" && key !== "video_url")
            .map((key) => (
              <div key={key}>
                <label className="block text-sm font-medium mb-1 capitalize">
                  {key.replace(/_/g, " ")}
                </label>
                <input
                  type={key.includes("sets") || key.includes("reps") || key.includes("rest") || key.includes("group") ? "number" : "text"}
                  name={key}
                  value={formData[key]}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2 text-sm"
                />
              </div>
            ))}

          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1">Upload Video</label>
            <input type="file" accept="video/*" onChange={handleFileChange} />
            {formData.video_file ? (
              <video controls className="mt-2 w-full max-h-64">
                <source src={URL.createObjectURL(formData.video_file)} type="video/mp4" />
              </video>
            ) : formData.video_url ? (
              <video controls className="mt-2 w-full max-h-64">
                <source src={formData.video_url} type="video/mp4" />
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
