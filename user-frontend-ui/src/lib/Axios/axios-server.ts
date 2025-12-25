"use server";
import envConfig from "@/config/envConfig";
import axios from "axios";

const axiosServer = axios.create({
  baseURL: envConfig.baseApi,
});

export default axiosServer;
