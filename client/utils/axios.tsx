"use client";

import axios from "axios";

const baseUrl = process.env.BACKEND_URL || "http://localhost:4444";
if (!baseUrl) {
  throw new Error("BACKEND_URL is not defined");
}

const axiosInstance = axios.create({
  baseURL: `${baseUrl}/`,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
