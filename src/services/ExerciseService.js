import axios from "axios";

export const API_PREFIX = "http://localhost:8091/api/v1/";

export const getExercisesByMuscleGroup = async (muscleGroupId) => {
  try {
    console.log("📥 [GET] /exercises/main_muscle_group/" + muscleGroupId);
    const response = await fetch(`${API_PREFIX}exercises/main_muscle_group/${muscleGroupId}`);
    if (!response.ok) {
      throw new Error("Failed to fetch exercises data");
    }
    return await response.json();
  } catch (error) {
    console.error("❌ Error fetching exercises by group:", error);
    throw error;
  }
};

export const getExercises = async (page = 0, limit = 6) => {
  try {
    console.log(`📥 [GET] /exercises?page=${page}&limit=${limit}`);
    const response = await fetch(`${API_PREFIX}exercises?page=${page}&limit=${limit}`);
    if (!response.ok) {
      throw new Error("Failed to fetch exercises data");
    }
    const data = await response.json();
    const exercises = data.exercises.map((exercise) => ({
      exercise_id: exercise.exercise_id,
      exercise_name: exercise.exercise_name,
      muscle_group_id: exercise.muscle_group_id,
      muscle_section: exercise.muscle_section,
      technique_description: exercise.technique_description,
      equipment_required: exercise.equipment_required,
      target_muscle_percentage: exercise.target_muscle_percentage,
      recommended_sets: exercise.recommended_sets,
      recommended_reps: exercise.recommended_reps,
      rest_between_sets: exercise.rest_between_sets,
      id: exercise.exercise_id,
      video_url: exercise.videos?.[0]?.video_url || null,
      videos: exercise.videos || [],
    }));
    return { exercises, totalPages: data.totalPages };
  } catch (error) {
    console.error("❌ Error fetching exercises:", error);
    throw error;
  }
};

export const getExerciseById = async (id) => {
  const response = await fetch(`${API_PREFIX}exercises/${id}`);
  if (!response.ok) throw new Error("Failed to fetch exercise by id");
  const data = await response.json();

  return {
    ...data,
    video_url: data.videos?.[0]?.video_url || null,
  };
};

export const uploadExerciseVideo = async (id, video_file) => {
  if (video_file instanceof File && id) {
    const formData = new FormData();
    formData.append("file", video_file);
    console.log("📤 [POST] /exercises/upload-video/" + id, video_file.name);
    await axios.post(`${API_PREFIX}exercises/upload-video/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  }
};

export const createExercise = async (data) => {
  const {
    technique_description,
    ...rest
  } = data;

  const payload = {
    ...rest,
    recommended_sets: Number(data.recommended_sets),
    recommended_reps: Number(data.recommended_reps),
    rest_between_sets: Number(data.rest_between_sets),
    muscle_group_id: Number(data.muscle_group_id),
    technique_description: Array.isArray(technique_description)
      ? technique_description.join(". ") + "."
      : technique_description,
  };

  console.log("📤 Tạo mới - Payload gửi đi:", payload);

  const res = await axios.post(`${API_PREFIX}exercises`, payload, {
    headers: { "Content-Type": "application/json" },
  });

  const newId = res.data.id ?? res.data.exercise_id;
  return newId;
};

export const updateExercise = async (id, data) => {
  const {
    technique_description,
    ...rest
  } = data;

  const payload = {
    ...rest,
    recommended_sets: Number(data.recommended_sets),
    recommended_reps: Number(data.recommended_reps),
    rest_between_sets: Number(data.rest_between_sets),
    muscle_group_id: Number(data.muscle_group_id),
    technique_description: Array.isArray(technique_description)
      ? technique_description.join(". ") + "."
      : technique_description,
  };

  console.log("🔄 Cập nhật - Payload gửi đi:", payload);

  await axios.put(`${API_PREFIX}exercises/${id}`, payload, {
    headers: { "Content-Type": "application/json" },
  });
};




export const deleteExercise = async (id) => {
  console.log("🗑️ [DELETE] /exercises/" + id);
  await axios.delete(`${API_PREFIX}exercises/${id}`);
};

export const deleteExerciseVideo = async (videoId) => {
  try {
    const res = await fetch(`${API_PREFIX}exercises/${videoId}/video`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText || "Xoá video thất bại");
    }

    console.log("✅ Đã xoá video:", videoId);
    return true;
  } catch (err) {
    console.error("❌ Lỗi xoá video:", err);
    throw err;
  }
};
