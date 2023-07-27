import Axios from "axios";

const URL = `/admin/realms/${import.meta.env.VITE_APP_KEYCLOAK_REALM}/groups`;

export default {
  getRoles(accessToken) {
    let config = {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    };
    return Axios.get(URL, config);
  },
  getRolDetails(accessToken, id) {
    let config = {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    };
    return Axios.get(`${URL}/${id}`, config);
  },
  createRol(data, accessToken) {
    let config = {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    };
    return Axios.post(URL, data, config);
  },
  updateRol(data, accessToken, id) {
    let config = {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    };
    return Axios.put(`${URL}/${id}`, data, config);
  },
  deleteRol(accessToken, id) {
    let config = {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    };
    return Axios.delete(`${URL}/${id}`, config);
  },
};
