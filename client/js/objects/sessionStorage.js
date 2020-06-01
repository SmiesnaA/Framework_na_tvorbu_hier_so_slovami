"use strict";
exports.__esModule = true;
exports.saveToSession = exports.SessionStorage = void 0;
/**
 *
 * Saves and gets values by key in local storage
 * @export
 * @class LocalStorage
 */
var SessionStorage = /** @class */ (function () {
    function SessionStorage() {
    }
    SessionStorage.getInstance = function () {
        if (!SessionStorage.sessionStorage) {
            SessionStorage.sessionStorage = new SessionStorage();
        }
        return SessionStorage.sessionStorage;
    };
    /**
     * Saves type of game and name of the current player
     *
     * @param {string} object
     * @param {string} typeOfGame
     * @param {string} name
     * @memberof LocalStorage
     */
    SessionStorage.prototype.save = function (typeOfGame, name) {
        this.set("NAME", name);
        this.set("GAME", typeOfGame);
    };
    /**
     * Sets value and key to storage
     *
     * @param {*} key
     * @param {*} value
     * @returns
     * @memberof LocalStorage
     */
    SessionStorage.prototype.set = function (key, value) {
        if (!key || !value) {
            return;
        }
        var newValue = value;
        if (typeof value === "object") {
            newValue = JSON.stringify(value);
        }
        sessionStorage.setItem(key, newValue);
    };
    /**
     * Gets key by value
     *
     * @param {*} key
     * @returns
     * @memberof LocalStorage
     */
    SessionStorage.prototype.get = function (key) {
        var value = sessionStorage.getItem(key);
        if (!value) {
            return;
        }
        if (value == null) {
            return "";
        }
        if (value[0] === "{") {
            value = JSON.parse(value);
        }
        return value;
    };
    SessionStorage.sessionStorage = new SessionStorage();
    return SessionStorage;
}());
exports.SessionStorage = SessionStorage;
/**
 * Promise of saving to the the local storage
 *
 * @param {string} object
 * @param {string} typeOfGame
 * @param {string} name
 * @returns
 */
function saveToSession(object, typeOfGame, name) {
    return new Promise(function (resolve) {
        SessionStorage.getInstance().save(typeOfGame, name);
        resolve("ok");
    });
}
exports.saveToSession = saveToSession;
