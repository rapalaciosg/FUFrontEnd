import Keycloak from "keycloak-js";

const keycloakConfig = {
    url: `${import.meta.env.VITE_APP_KEYCLOAK_URL}`,
    realm: `${import.meta.env.VITE_APP_KEYCLOAK_REALM}`,
    clientId: `${import.meta.env.VITE_APP_KEYCLOAK_CLIENT_ID}`
}

const keycloak = new Keycloak(keycloakConfig)

export default keycloak;