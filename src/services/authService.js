import Joi from "joi";
import jwtDecode from "jwt-decode";

import { http } from "./httpService";
import { baseURL } from "../constants/config";
import { showFailureToaster, showSuccessToaster } from "../utils/toaster";
import { getLocalStorageItem, removeLocalStorageItem, setLocalStorageItem } from "../utils/localStorage";

const loginApiEndpoint = baseURL + "auth";
const tokenKey = "token";

const userLoginSchema = Joi.object({
  email: Joi.string()
    .min(5)
    .max(255)
    .required()
    .email({ tlds: { allow: false } }),
  password: Joi.string().min(4).max(1024).required(),
});

http.setJwt(getJwt());

async function login(user) {
  try {
    const response = await http.post(loginApiEndpoint, { ...user });
    setLocalStorageItem(tokenKey, response.data.jwt);
    showSuccessToaster("Successfuly Logged In!");
    return true;
  } catch (err) {
    showFailureToaster(err.data.errorMessage);
    return false;
  }
}

function logout() {
  removeLocalStorageItem(tokenKey);
  window.location = "/login";
  return;
}

function getCurrentUserDetails() {
  try {
    const jwt = getLocalStorageItem(tokenKey);
    if (jwt) {
      return jwtDecode(jwt);
    }
    return null;
  } catch (error) {
    return null;
  }
}

function getJwt() {
  return getLocalStorageItem(tokenKey);
}

export const auth = {
  userLoginSchema,
  login,
  logout,
  getCurrentUserDetails,
  getJwt,
};
