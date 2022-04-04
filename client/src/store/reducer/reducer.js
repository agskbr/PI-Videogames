import {
  GET_VIDEOGAMES,
  GET_VIDEOGAMES_BY_NAME,
  GET_VIDEOGAME_BY_ID,
  GET_GENRES,
  REQUEST_POST,
  RECEIVED_POST,
  CREATE_VIDEOGAME,
  GET_PLATFORMS,
} from "../action-types/types";

const initialState = {
  videogames: [],
  videogame: {},
  genres: [],
  platforms: [],
  createdGame: false,
  isLoading: false,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_VIDEOGAMES:
      return {
        ...state,
        videogames: action.payload,
      };
    case GET_VIDEOGAMES_BY_NAME:
      return {
        ...state,
        videogames: action.payload,
      };
    case GET_VIDEOGAME_BY_ID:
      return {
        ...state,
        videogame: action.payload,
      };
    case CREATE_VIDEOGAME:
      return {
        ...state,
        createdGame: action.payload,
      };
    case GET_GENRES:
      return {
        ...state,
        genres: action.payload,
      };
    case GET_PLATFORMS:
      return {
        ...state,
        platforms: action.payload,
      };
    case REQUEST_POST:
      return {
        ...state,
        isLoading: true,
      };
    case RECEIVED_POST:
      return {
        ...state,
        isLoading: false,
      };
    default:
      return { ...state };
  }
};

export { reducer };
