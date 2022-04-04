const axios = require("axios");
const { GET_GENRES, RECEIVED_POST } = require("../action-types/types");
const base_url = "http://localhost:3001";

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

module.exports = { getGenres };
