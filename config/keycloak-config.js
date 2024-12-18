var session = require('express-session');
var Keycloak = require('keycloak-connect');

let _keycloak;

var keycloakConfig = {
    clientId: 'cryptofootClient',
    bearerOnly: false,
    serverUrl: 'http://localhost:8080/',
    realm: 'CRYPTOFOOTRealm',
    credentials: {
        secret: '5686267e-98d0-4553-87eb-ac2575f71765'
        
    }
};

function initKeycloak() {
    if (_keycloak) {
        console.warn("Trying to init Keycloak again!");
        return _keycloak;
    } 
    else {
        console.log("Initializing Keycloak...");
        var memoryStore = new session.MemoryStore();
        _keycloak = new Keycloak({ store: memoryStore }, keycloakConfig);
        return _keycloak;
    }
}

function getKeycloak() {
    if (!_keycloak){
        console.error('Keycloak has not been initialized. Please called init first.');
    } 
    return _keycloak;
}

module.exports = {
    initKeycloak,
    getKeycloak
};