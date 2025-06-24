import axios from "axios";

export const authAxiosInstace = axios.create({
  baseURL: "http://localhost:3000/",
  withCredentials: true,
});
