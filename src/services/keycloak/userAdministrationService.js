import Axios from "axios";

const URL = `/admin/realms/${import.meta.env.VITE_APP_KEYCLOAK_REALM}/users`;

export default {
  getUsers(accessToken) {
    let config = {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    };
    return Axios.get(URL, config);
  },
  getUserByUsername(accessToken, username) {
    let config = {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    };
    return Axios.get(`${URL}?username=${username}`, config);
  },
  getUserDetails(accessToken, id) {
    let config = {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    };
    return Axios.get(`${URL}/${id}`, config);
  },
  getUserGroups(accessToken, id) {
    let config = {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    };
    return Axios.get(`${URL}/${id}/groups`, config);
  },
  createUser(data, accessToken) {
    let config = {
      headers: {
        Authorization: 'Bearer ' + accessToken
      }
    };
    return Axios.post(URL, data, config);
  },
  updateUser(data, accessToken, id) {
    let config = {
      headers: {
        Authorization: 'Bearer ' + accessToken
      }
    };
    return Axios.put(`${URL}/${id}`, data, config);
  }
};
