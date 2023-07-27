import Axios from "axios";

const URL = `/admin/realms/${import.meta.env.VITE_APP_KEYCLOAK_REALM}/roles`;

export default {
  getPermissions(accessToken) {
    let config = {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    };
    return Axios.get(URL, config);
  },
  getPermissionDetails(accessToken, name) {
    let config = {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    };
    return Axios.get(`${URL}/${name}`, config);
  },
  createPermission(data, accessToken) {
    let config = {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    };
    return Axios.post(URL, data, config);
  },
  updatePermission(data, accessToken, name) {
    let config = {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    };
    return Axios.put(`${URL}/${name}`, data, config);
  },
  deletePermission(accessToken, name) {
    let config = {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    };
    return Axios.delete(`${URL}/${name}`, config);
  },
};
