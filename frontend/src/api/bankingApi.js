import axios from "axios";

const apiBaseUrl = typeof __API_BASE_URL__ === "string" ? __API_BASE_URL__ : "";

export async function getUsers() {
  const response = await axios.get(`${apiBaseUrl}/api/users`);
  return response.data;
}

export async function getAccounts(userId) {
  const response = await axios.get(`${apiBaseUrl}/api/users/${userId}/accounts`);
  return response.data;
}

export async function getTransactions(accountId) {
  const response = await axios.get(
    `${apiBaseUrl}/api/accounts/${accountId}/transactions`,
  );
  return response.data;
}
