import api from "./api";

export const createContributionRequest = async (data, token) => {
  const response = await api.post("/contributions", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};