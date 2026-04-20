import api from "./api";

export const getUsersRequest = async (token) => {
  const response = await api.get("/users", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};