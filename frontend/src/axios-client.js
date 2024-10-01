import axios from "axios";
import Cookies from "js-cookie";

const axiosClient = axios.create({
  baseURL: `http://localhost:8080/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosClient.interceptors.request.use((config) => {
  const token = Cookies.get("_auth");
  console.log("Token in request:", token);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    try {
      const { response } = error;
      if (response.status === 401) {
        Cookies.remove("_auth");
        localStorage.setItem(
          "TOKEN_EXPIRE",
          "Your login has expired. Please log in again to continue."
        );
        // Redirect to login page or perform any other action, like logging the user out
      }
    } catch (error) {
      console.error(error);
    }
    throw error;
  }
);

export default axiosClient;
