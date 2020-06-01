"use strict";
exports.__esModule = true;
/**
 * Current player/user in the game
 *
 * @export
 * @class Player
 */
var Player = /** @class */ (function () {
    /**
     *Creates an instance of Player.
     * @param {string} name
     * @param {Socket} socket
     * @memberof Player
     */
    function Player(name, socket) {
        this.name = name;
        this.socket = socket;
    }
    /**
     *
     * Gets name of the player
     * @returns
     * @memberof Player
     */
    Player.prototype.getName = function () {
        return this.name;
    };
    /**
     *
     * Gets socket on which is player connected
     * @returns
     * @memberof Player
     */
    Player.prototype.getSocket = function () {
        return this.socket;
    };
    return Player;
}());
exports["default"] = Player;
