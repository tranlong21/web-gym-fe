import React, { useState, useEffect } from "react";

const defaultForm = {
  // id: null,
  username: "",
  full_name: "",
  sex: "Male", 
  email: "",
  phone: "",
  address: "",
  date_of_birth: "",
  height_cm: "",
  weight_kg: "",
};

const UserFormModal = ({ visible, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState(defaultForm);

  useEffect(() => {
    if (initialData) {
      const cleanData = { ...initialData };
      if (cleanData.date_of_birth) {
        cleanData.date_of_birth = cleanData.date_of_birth.split("T")[0];
      }
      setFormData(cleanData);
    } else {
      setFormData(defaultForm);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dataToSubmit = {
      ...formData,
      sex: formData.sex || "Male",
    };

    await onSubmit(dataToSubmit);
    onClose();
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-auto">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">
          {initialData ? "Edit User" : "Add User"}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(defaultForm).map(([key, _]) => (
              <div key={key} className="col-span-1">
                <label className="block text-sm font-medium mb-1 capitalize">
                  {key.replace(/_/g, " ")}
                </label>
                {key === "sex" ? (
                  <select
                    name="sex"
                    value={formData.sex}
                    onChange={handleChange}
                    className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring focus:border-blue-300"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                ) : (
                  <input
                    type={
                      ["height_cm", "weight_kg"].includes(key)
                        ? "number"
                        : key === "date_of_birth"
                        ? "date"
                        : "text"
                    }
                    name={key}
                    value={formData[key] || ""}
                    onChange={handleChange}
                    className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring focus:border-blue-300"
                  />
                )}
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-between items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              {initialData ? "Save Changes" : "Add User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserFormModal;
