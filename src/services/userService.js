import Joi from "joi";
import { http } from "./httpService";
import { baseURL } from "../constants/config";
import { showFailureToaster, showSuccessToaster } from "../utils/toaster";
import { setLocalStorageItem } from "../utils/localStorage";
import { auth } from "./authService";

const userApiEndpoint = baseURL + "users";

const newUserSchema = Joi.object({
  name: Joi.string().min(3).max(128).required(),
  email: Joi.string()
    .min(3)
    .max(128)
    .required()
    .email({ tlds: { allow: false } }),
  password: Joi.string(),
  phoneNo: Joi.string().min(3).max(20).required(),
});

async function addNewUser(user) {
  try {
    const response = await http.post(userApiEndpoint, { ...user });
    setLocalStorageItem("token", response.headers["x-auth-token"]);
    showSuccessToaster("Successfuly created new account!");
    return true;
  } catch (err) {
    showFailureToaster(err.data.errorMessage);
    return false;
  }
}

async function getMyDetails() {
  try {
    http.setJwt(auth.getJwt());
    return await http.get(userApiEndpoint + "/me");
  } catch (err) {
    showFailureToaster(err.data.errorMessage);
    return false;
  }
}

async function userDetails(id) {
  try {
    const response = await http.get(userApiEndpoint + "/details/" + id);
    return response;
  } catch (err) {
    showFailureToaster(err.data.errorMessage);
    return false;
  }
}

async function updateUser(user) {
  try {
    await http.put(userApiEndpoint, { ...user });
    showSuccessToaster("Successfuly updated.");
    return true;
  } catch (err) {
    showFailureToaster(err.data.errorMessage);
    return false;
  }
}

export const userService = {
  newUserSchema,
  addNewUser,
  getMyDetails,
  userDetails,
  updateUser,
};
