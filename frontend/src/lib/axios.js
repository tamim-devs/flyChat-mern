import axios from "axios";

export const axiosInsance =  axios.create({
  baseURL: 'http://localhost:4000/api',
  withCredentials: true
})