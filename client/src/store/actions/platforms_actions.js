const axios = require("axios");
const { GET_PLATFORMS, RECEIVED_POST } = require("../action-types/types");
const base_url = "http://localhost:3001";

const getPlatforms = () => {
  return async (dispatch) => {
    try {
      const { data } = await axios.get(`${base_url}/platforms`);
      dispatch({ type: GET_PLATFORMS, payload: data });
      dispatch({ type: RECEIVED_POST });
    } catch (error) {
      console.log(error);
    }
  };
};

module.exports = { getPlatforms };
