import Joi from "joi";
import { http } from "./httpService";
import { baseURL } from "../constants/config";
import { showFailureToaster, showSuccessToaster } from "../utils/toaster";

const gigApiEndpoint = baseURL + "gigs";

const gigSchema = Joi.object({
  user: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required(),
  title: Joi.string().min(4).max(200).required(),
  image: Joi.string().required(),
  description: Joi.string().min(10).max(2000).required(),
  category: Joi.string()
    .valid(
      "digitalArtists",
      "craftArtists",
      "painters",
      "photographers",
      "sculptors",
      "illustrators",
      "aiArtists"
    )
    .required(),
  deliveredIn: Joi.number().integer().min(1).max(30).required(),
  NoOfRevisions: Joi.number().integer().min(0).max(10).required(),
  price: Joi.number().min(1).max(99999999).required(),
});

async function addGig(gig) {
  try {
    const response = await http.post(gigApiEndpoint, { ...gig });
    showSuccessToaster("Successfuly added new gig!");
    return response;
  } catch (err) {
    showFailureToaster(err.data.errorMessage);
    return false;
  }
}

async function getAllGigs(params) {
  try {
    if (params) return await http.get(gigApiEndpoint + "?" + params);
    else return await http.get(gigApiEndpoint);
  } catch (err) {
    showFailureToaster(err.data.errorMessage);
    return false;
  }
}

async function getDetails(id) {
  try {
    return await http.get(gigApiEndpoint + "/" + id);
  } catch (err) {
    showFailureToaster(err.data.errorMessage);
    return false;
  }
}

async function getMyGigs(id) {
  try {
    return await http.get(gigApiEndpoint + "/myGigs/" + id);
  } catch (err) {
    showFailureToaster(err.data.errorMessage);
    return false;
  }
}

async function deleteGig(id) {
  try {
    return await http.delete(gigApiEndpoint + "/" + id);
  } catch (err) {
    showFailureToaster(err.data.errorMessage);
    return false;
  }
}

export const gigService = {
  gigSchema,
  addGig,
  getAllGigs,
  getDetails,
  getMyGigs,
  deleteGig,
};
