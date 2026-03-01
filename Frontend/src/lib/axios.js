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

export default axiosInstance;
