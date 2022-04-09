import { base_url } from "../utils";
import axios from "axios";
import { GET_PLATFORMS, RECEIVED_POST } from "../action-types/types";

const getPlatforms = () => {
  return async (dispatch) => {
    try {
      const { data } = await axios.get(`${base_url}/platforms`);
      dispatch({ type: GET_PLATFORMS, payload: data });
      dispatch({ type: RECEIVED_POST });
    } catch (error) {
      console.log("No se pudo traer las plataformas");
      console.log(error);
    }
  };
};

export { getPlatforms };
