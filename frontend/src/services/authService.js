import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/auth";

export async function registerStudent(data) {
  const response = await axios.post(`${API_URL}/register`, data);
  return response.data;
}

export async function loginStudent(data) {
  const response = await axios.post(`${API_URL}/login`, data);
  return response.data;
}

export async function getCurrentStudent(token) {
  const response = await axios.get(`${API_URL}/me`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
}
