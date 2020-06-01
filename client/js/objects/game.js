"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.Game = exports.GAME = void 0;
var $ = require("../../lib/jquery/jquery-3.4.1.min");
var graph = require("../objects/graph");
var player_1 = require("../objects/player");
var dialog_1 = require("./dialog");
var sessionStorage_1 = require("./sessionStorage");
var socket_1 = require("./socket");
/**
 *
 * Abstract class for creating games
 * @export
 * @abstract
 * @class Game
 */
var Game = /** @class */ (function () {
    /**
     *Creates an instance of Game.
     * @memberof Game
     */
    function Game() {
        this.done = false;
        this.correctAnswers = [];
        exports.GAME = this;
    }
    /**
     *
     *
     * @returns instance of subclass
     * @memberof Game
     */
    Game.prototype.getInstance = function () {
        return this;
    };
    /**
     *
     * Gets number of connected sockets  - players
     * @returns number of sockets
     * @memberof Game
     */
    Game.prototype.getSocketsLn = function () {
        var c = 0;
        if (this.player.getSocket() != null) {
            c = this.player.getSocket().count;
        }
        return c;
    };
    /**
     * Creates new player
     * Gets name, type of game from local storage
     * Checks for number of sockets connected
     * Creates graph
     * @param {string} file
     * @memberof Game
     */
    Game.prototype.createPlayer = function (file) {
        return __awaiter(this, void 0, void 0, function () {
            var thiss, name, typeOfGame, socket;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        thiss = this;
                        name = sessionStorage_1.SessionStorage.getInstance().get("NAME");
                        typeOfGame = sessionStorage_1.SessionStorage.getInstance().get("GAME");
                        socket = null;
                        if (!(typeOfGame == "multiplayer")) return [3 /*break*/, 2];
                        socket = new socket_1["default"]();
                        return [4 /*yield*/, socket.wait()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        thiss.player = new player_1["default"](name, socket);
                        if (this.getSocketsLn() < 2) {
                            this.setNew(file);
                        }
                        else {
                            this.setNewRecreate();
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Sets new graph
     * @param file
     */
    Game.prototype.setNew = function (file) {
        return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/];
        }); });
    };
    /**
     * Recreates graph
     */
    Game.prototype.setNewRecreate = function () {
        return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/];
        }); });
    };
    /**
     *
     * Gets player
     * @returns current player of the game
     * @memberof Game
     */
    Game.prototype.getPlayer = function () {
        return this.player;
    };
    /**
     *
     * Sets name of the player in div
     * @param {string} div
     * @memberof Game
     */
    Game.prototype.setNameOfPlayer = function (div) {
        $(document).ready(function () {
            document.getElementById(div).innerHTML = sessionStorage_1.SessionStorage.getInstance().get("NAME");
        });
    };
    Game.prototype.setAllNodes = function (Nodes) {
        var all = JSON.parse(Nodes);
        var a1 = [];
        var num = 0;
        for (var _i = 0, all_1 = all; _i < all_1.length; _i++) {
            var Nodes_2 = all_1[_i];
            var a2 = [];
            for (var _a = 0, Nodes_1 = Nodes_2; _a < Nodes_1.length; _a++) {
                var Node_1 = Nodes_1[_a];
                a2.push(new Node_1(Node_1.id, Node_1.name));
            }
            num++;
            a1.push(a2);
        }
        graph.setAllWords(a1);
        this.allWords = a1;
    };
    /**
     *
     * Removes a word from answers
     * @param {string} word
     * @memberof Game
     */
    Game.prototype.removeWord = function (word) {
        this.answers = this.answers.filter(function (w) { return w.name != word; });
    };
    /**
     *
     * Calls dialog
     * @param {string} title
     * @param {string} text
     * @param {string} icon - warning, error or success
     * @param {string} confirmButtonText - text on submit button
     * @memberof Game
     */
    Game.prototype.callDialog = function (title, text, icon, confirmButtonText) {
        dialog_1.Dialog.callDialogIcon(title, text, icon, confirmButtonText);
    };
    /**
     *
     * Checks whether the word is correct
     * Is in answers
     * @param {string} word
     * @returns
     * @memberof Game
     */
    Game.prototype.checkWord = function (word) {
        return this.answers.some(function (w) { return w.name == word; });
    };
    /**
     *
     * Sets the word as correct
     * Sets correct nodes to green color
     * @param {string} word
     * @memberof Game
     */
    Game.prototype.setCorrect = function (word, color) {
        graph.setColorClickedNodes(color);
        this.setWord(word);
    };
    /**
     *
     * Checks if all words are correct
     * If there are no answers left, game is done
     * @memberof Game
     */
    Game.prototype.checkDone = function () {
        if (this.answers.length == 0) {
            this.callDialog("Super", "Chceš pokračovať?", "success", "Jasné");
            $("#checkCorrect").click(false);
            graph.unselectify(true);
            graph.ungrabify(true);
            this.done = true;
        }
    };
    /**
     * Sets the word as incorrect
     * Calls the dialog
     * Unsets all clicked nodes
     * @memberof Game
     */
    Game.prototype.setIncorrect = function () {
        graph.unsetClickedNodes();
    };
    /**
     * Sets word
     * @param word
     */
    Game.prototype.setWord = function (word) { };
    /**
     * Checks clicked - connected Nodes
     * Checks correctness of the word
     * If there are sockets connected - send message to server
     * @param game
     */
    Game.prototype.checkConnected = function (color) {
        var letters = graph.getClickedNodesName();
        var word = letters.join("");
        if (this.getSocketsLn() == 0) {
            if (this.checkWord(word)) {
                this.setCorrect(word, color);
            }
            else {
                this.callDialog("Ups", "Skús to znova", "error", "Tentoraz to dám!");
                this.setIncorrect();
            }
        }
        else {
            if (this.checkWord(word)) {
                graph.send("correct", '{"name" : "' + word + '"}');
            } /* else {
              graph.Graph.getInstance().send("uncorrect", "");
            }*/
        }
    };
    /**
     *
     * Sets executioning of the functions on button click
     * @param {string} div
     * @param {string[]} args
     * @param {Game} game
     * @memberof Game
     */
    Game.prototype.setOnButtonClick = function (div, args) {
        var thiss = this;
        $(document).ready(function () {
            $(div).on("click", function () {
                for (var key in args) {
                    var value = args[key];
                    var execute = thiss[key];
                    if (typeof execute === "function") {
                        execute.apply(thiss, value);
                    }
                }
            });
        });
    };
    /**
     *
     * Sets letters as HTML objects - divs
     * @memberof Game
     */
    Game.prototype.setWordsDiv = function (div) {
        return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/];
        }); });
    };
    /**
     * Random game
     * Sets game as done
     * Clears the elements in graph
     */
    Game.prototype.unDone = function () {
        exports.GAME.done = false;
        graph.clearGraph();
    };
    /**
     * New game with specific attributes
     *
     * @memberof Game
     */
    Game.prototype.newGameS = function () { };
    /**
     * Random game with specific attributes
     *
     * @memberof Game
     */
    Game.prototype.randomGameS = function () { };
    /**
     * New game
     * Sends to server if a socket is connected
     */
    Game.prototype.newGame = function () {
        if (this.player.getSocket() == null) {
            exports.GAME.newGameS();
        }
        else {
            graph.send("newGame", "");
        }
    };
    /**
     * Random game
     * Sends to server if a socket is connected
     */
    Game.prototype.randomGame = function () {
        if (this.player.getSocket() == null) {
            exports.GAME.randomGameS();
        }
        else {
            graph.send("rndGame", "");
        }
    };
    return Game;
}());
exports.Game = Game;
