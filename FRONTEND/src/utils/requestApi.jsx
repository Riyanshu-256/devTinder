import axios from "axios";
import { BASE_URL } from "./constants";

// IGNORE USER
export const sendIgnoredRequest = async (toUserId) => {
  return await axios.post(
    `${BASE_URL}/request/send/ignored/${toUserId}`,
    {},
    { withCredentials: true }
  );
};

// INTERESTED USER
export const sendInterestedRequest = async (toUserId) => {
  return await axios.post(
    `${BASE_URL}/request/send/interested/${toUserId}`,
    {},
    { withCredentials: true }
  );
};
