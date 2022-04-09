import axios from "axios";
import { GET_GENRES } from "../action-types/types";
import { base_url } from "../utils";

const getGenres = () => {
  return async (dispatch) => {
    try {
      const { data } = await axios.get(`${base_url}/genres`);
      dispatch({ type: GET_GENRES, payload: data });
    } catch (error) {
      console.log("No se pudo traer los generos");
      console.log(error);
    }
  };
};

export { getGenres };
