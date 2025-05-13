import axios from "axios";

const API_PREFIX = "http://localhost:8091/api/v1/";

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
      video_url: exercise.video_url,
    }));
    return { exercises, totalPages: data.totalPages };
  } catch (error) {
    console.error("❌ Error fetching exercises:", error);
    throw error;
  }
};

export const createExercise = async (data) => {
  const { video_file, id, exercise_id, ...info } = data; // loại bỏ id trước khi POST
  console.log("📝 [POST] /exercises", info);
  const res = await axios.post(`${API_PREFIX}exercises`, info);
  const newId = res.data.id ?? res.data.exercise_id;

  if (video_file instanceof File) {
    const formData = new FormData();
    formData.append("file", video_file);
    console.log("📤 [POST] /exercises/uploads/" + newId, video_file.name);
    await axios.post(`${API_PREFIX}exercises/uploads/${newId}`, formData);
  }
};

export const updateExercise = async (id, data) => {
  const { video_file, ...info } = data;
  console.log("✏️ [PUT] /exercises/" + id, info);
  await axios.put(`${API_PREFIX}exercises/${id}`, info);

  if (video_file instanceof File) {
    const formData = new FormData();
    formData.append("file", video_file);
    console.log("📤 [POST] /exercises/uploads/" + id, video_file.name);
    await axios.post(`${API_PREFIX}exercises/uploads/${id}`, formData);
  }
};

export const deleteExercise = async (id) => {
  console.log("🗑️ [DELETE] /exercises/" + id);
  await axios.delete(`${API_PREFIX}exercises/${id}`);
};
