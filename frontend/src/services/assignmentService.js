import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/assignments";

export const getAssignments = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const createAssignment = async (assignment) => {
  const response = await axios.post(API_URL, assignment);
  return response.data;
};

export const updateAssignment = async (id, assignment) => {
  const response = await axios.put(`${API_URL}/${id}`, assignment);
  return response.data;
};

export const setAssignmentCompletion = async (id, completed) => {
  const response = await axios.patch(
    `${API_URL}/${id}/complete`,
    { completed }
  );
  return response.data;
};

export const deleteAssignment = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};


axios.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("sams_token");

  if (token && config.url?.startsWith(API_URL)) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
