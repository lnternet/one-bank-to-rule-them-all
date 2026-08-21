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

export async function getTransaction(transactionId) {
  const response = await axios.get(
    `${apiBaseUrl}/api/transactions/${transactionId}`,
  );
  return response.data;
}

export async function categorizeTransaction(transactionId) {
  const response = await axios.patch(
    `${apiBaseUrl}/api/transactions/${transactionId}/spending-category`,
  );
  return response.data;
}

export async function categorizeAccountTransactions(accountId) {
  const response = await axios.patch(
    `${apiBaseUrl}/api/accounts/${accountId}/transactions/spending-categories`,
  );
  return response.data;
}

export async function getConfigurations() {
  const response = await axios.get(`${apiBaseUrl}/api/configurations`);
  return response.data;
}
