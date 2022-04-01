import axios from "axios";
import {
  GET_VIDEOGAMES,
  REQUEST_POST,
  RECEIVED_POST,
  GET_VIDEOGAMES_BY_NAME,
  GET_VIDEOGAME_BY_ID,
  GET_GENRES,
} from "../action-types/types";

const base_url = "http://localhost:3001";

const getAllVideogames = () => {
  return async (dispatch) => {
    try {
      const { data } = await axios.get(`${base_url}/videogames`);
      dispatch({ type: GET_VIDEOGAMES, payload: data });
      dispatch({ type: RECEIVED_POST });
    } catch (error) {
      console.log(error);
    }
  };
};

const getVideogamesByName = (name) => {
  return async (dispatch) => {
    try {
      const { data } = await axios.get(`${base_url}/videogames?name=${name}`);
      dispatch({ type: GET_VIDEOGAMES_BY_NAME, payload: data });
      dispatch({ type: RECEIVED_POST });
    } catch (error) {
      console.log(error);
    }
  };
};

const getVideogameById = (id) => {
  return async (dispatch) => {
    try {
      const { data } = await axios.get(`${base_url}/videogame/${id}`);
      dispatch({ type: GET_VIDEOGAME_BY_ID, payload: data });
      dispatch({ type: RECEIVED_POST });
    } catch (error) {
      console.log(error);
    }
  };
};

const getGenres = () => {
  return async (dispatch) => {
    try {
      const { data } = await axios.get(`${base_url}/genres`);
      dispatch({ type: GET_GENRES, payload: data });
      dispatch({ type: RECEIVED_POST });
    } catch (error) {
      console.log(error);
    }
  };
};

const requestPost = () => {
  return {
    type: REQUEST_POST,
  };
};

const receivedPost = () => {
  return {
    type: RECEIVED_POST,
  };
};

export {
  getAllVideogames,
  requestPost,
  receivedPost,
  getVideogamesByName,
  getVideogameById,
  getGenres,
};