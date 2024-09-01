import axios from "axios";

const BASE_URL = "http://localhost:3000";

export const createWallet = async (data: any) => {
  const response = await axios.post(`${BASE_URL}/user`, JSON.stringify(data));

  return response.data;
};

export const getAddressData = async (address: string) => {
  const response = await axios.get(`${BASE_URL}/addrs/${address}`);

  return response.data;
};

export const getTransactions = async (address: string) => {
  const response = await axios.get(`${BASE_URL}/addrs/${address}/full`);
  return response.data.txs;
};
