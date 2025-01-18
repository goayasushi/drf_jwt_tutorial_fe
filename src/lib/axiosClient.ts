"use client";

import axios, { AxiosInstance } from "axios";

// create axios instance
const axiosClient: AxiosInstance = axios.create({
  baseURL: "http://localhost:8000",
});

// request interceptor
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token && config.headers) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// response interceptor
axiosClient.interceptors.response.use(
  (response) => {
    const newToken = response.headers["x-access-token"];
    if (newToken) {
      localStorage.setItem("access_token", newToken);
    }
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      window.location.href = "/error-auth";
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
