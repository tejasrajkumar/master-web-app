import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3030/",
});

axiosInstance.interceptors.request.use(async (config) => {
  return config;
}, function (error) {
  return Promise.reject(error);
});

axiosInstance.interceptors.response.use(null, (error) => {
  const expectedError =
    error.response &&
    error.response.status >= 400 &&
    error.response.status < 500;

  if (!expectedError) {
    console.log("An unexpected error occurrred.");
  }
  return Promise.reject(error);
});

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  get: axiosInstance.get,
  post: axiosInstance.post,
  put: axiosInstance.put,
  delete: axiosInstance.delete,
  patch: axiosInstance.patch,
};
