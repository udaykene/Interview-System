import axios from "axios";

const rawApiUrl = (import.meta.env.VITE_API_URL || "").trim();
const normalizedApiUrl = (() => {
  if (!rawApiUrl) return "/api";
  const withoutTrailingSlash = rawApiUrl.replace(/\/+$/, "");
  return /\/api$/i.test(withoutTrailingSlash)
    ? withoutTrailingSlash
    : `${withoutTrailingSlash}/api`;
})();

const axiosInstance = axios.create({
  baseURL: normalizedApiUrl,
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry && !original.url.includes("/auth/refresh")) {
      original._retry = true;
      try {
        await axiosInstance.post("/auth/refresh");
        return axiosInstance(original);
      } catch {
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
