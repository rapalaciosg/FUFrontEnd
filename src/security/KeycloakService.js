import Keycloak from "keycloak-js";

const keycloakConfig = {
    url: 'https://justcause-keycloak.azurewebsites.net/auth',
    realm: 'customer',
    clientId: 'vuej-app'
}

const keycloak = new Keycloak(keycloakConfig)

export default keycloak;