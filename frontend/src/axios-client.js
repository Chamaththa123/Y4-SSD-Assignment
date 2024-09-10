import axios from "axios";
import Cookies from "js-cookie";

const axiosClient = axios.create({
  baseURL: `http://localhost:4000/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Fetch CSRF token and set it in a cookie or localStorage
const fetchCsrfToken = async () => {
  try {
    const response = await axios.get("http://localhost:4000/api/csrf");
    const { csrfToken } = response.data;
    console.log("CSRF Token fetched:", csrfToken);
    Cookies.set("X-CSRF-Token", csrfToken); // Store CSRF token in cookie with an expiry
  } catch (error) {
    console.error("Failed to fetch CSRF token:", error);
  }
};
console.log("Cookies:", document.cookie);

// Add CSRF token to request headers
axiosClient.interceptors.request.use((config) => {
  const csrfToken = Cookies.get("X-CSRF-Token");
  console.log("CSRF Token in request headers:", csrfToken);

  if (csrfToken) {
    config.headers[`X-Csrf-Token`] = `${csrfToken}`;
  }

  const authToken = Cookies.get("_auth");
  console.log("Auth Token in request headers:", authToken);

  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }

  return config;
});

// Handle response errors
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;
    if (response && response.status === 401) {
      Cookies.remove("_auth");
      localStorage.setItem(
        "TOKEN_EXPIRE",
        "Your login has expired. Please log in again to continue."
      );
      // Optionally redirect to login page or handle the session expiration
    }
    return Promise.reject(error);
  }
);

export { axiosClient, fetchCsrfToken };
