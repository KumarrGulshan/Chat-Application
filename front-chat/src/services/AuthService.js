import { httpClient } from "../config/AxiosHelper";

export const registerApi = async (username, password) => {
  return await httpClient.post("/api/v1/auth/register", { username, password });
};

export const loginApi = async (username, password) => {
  const res = await httpClient.post("/api/v1/auth/login", { username, password });
  return res.data.token; // backend returns { token: "..." }
};
