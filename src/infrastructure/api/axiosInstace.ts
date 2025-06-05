import axios from "axios";

export const axiosInstace = axios.create({baseURL: "http://localhost:3000/", withCredentials: true})