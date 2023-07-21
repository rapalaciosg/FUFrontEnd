import Axios from 'axios';

const URL = `/admin/realms/${import.meta.env.VITE_APP_KEYCLOAK_REALM}/roles`;

export default {
    getPermissions(accessToken) {
        let config = {
            headers: {
                Authorization: 'Bearer ' + accessToken
            }
        };
        return Axios.get(URL, config);
    },
}