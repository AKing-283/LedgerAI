import axios from "axios";

const API = axios.create({
  baseURL: "https://ai-accountant-copilot-102553128784.europe-west1.run.app",
});

API.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("token");

    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  }
);

export const login = async (
  email,
  password
) => {

  const res =
    await API.post(
      "/auth/login",
      {
        email,
        password,
      }
    );

  return res.data;
};

export const register = async (
  organization_name,
  email,
  password
) => {

  const res =
    await API.post(
      "/auth/register",
      {
        organization_name,
        email,
        password,
      }
    );

  return res.data;
};

export const uploadDocument =
  async (file) => {

    const formData =
      new FormData();

    formData.append(
      "file",
      file
    );

    const res =
      await API.post(
        "/upload",
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

    return res.data;
};

export const getDocuments =
  async () => {

    const res =
      await API.get(
        "/documents"
      );

    return res.data;
};

export const askQuestion =
  async (question) => {

    const res =
      await API.post(
        "/chat",
        {
          question,
        }
      );

    return res.data;
};

export default API;