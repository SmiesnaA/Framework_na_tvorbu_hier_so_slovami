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
var io = require("socket.io-client");
var graph = require("./graph");
var game_1 = require("./game");
/**
 *
 * Connected socket - user
 * @export
 * @class Socket
 */
var Socket = /** @class */ (function () {
    /**
     *Creates an instance of Socket.
     * @memberof Socket
     */
    function Socket() {
        this.count = undefined;
        this.socket = io();
        this.set();
    }
    /**
     *
     * Asynchronous function
     * Checks for socket to send a message after connection
     * @returns
     * @memberof Socket
     */
    Socket.prototype.wait = function () {
        return __awaiter(this, void 0, void 0, function () {
            var thiss;
            return __generator(this, function (_a) {
                thiss = this;
                return [2 /*return*/, new Promise(function (resolve) {
                        var checkExist = setInterval(function () {
                            if (thiss.count != undefined) {
                                clearInterval(checkExist);
                                resolve("done!");
                            }
                        }, 200);
                    })];
            });
        });
    };
    /**
     *
     * Sends message to the server
     * @param {string} event
     * @param {string} data
     * @memberof Socket
     */
    Socket.prototype.send = function (event, data) {
        this.socket.emit(event, data);
    };
    /**
     *
     *
     * @returns number of connected sockets
     * @memberof Socket
     */
    Socket.prototype.getCount = function () {
        return this.count;
    };
    /**
     *
     * Initial settings
     * Catching messages from the server
     * @memberof Socket
     */
    Socket.prototype.set = function () {
        var thiss = this;
        this.socket.on("broadcast", function (data) {
            thiss.count = data;
        });
        this.socket.on("getGraph", function () {
            thiss.send("graph", graph.getGraphJSON());
        });
        this.socket.on("newGraph", function (data) {
            console.log('recreate');
            graph.recreateGraphJSON(data);
        });
        this.socket.on("disconnected", function (data) {
            thiss.count = data;
        });
        this.socket.on("tappedConnect", function (data) {
            graph.onNodeClick_Connect(data);
        });
        this.socket.on("tapped", function (data) {
            graph.onNodeClick(data);
        });
        this.socket.on("tappedDisconnect", function (data) {
            graph.removeEdge(data[0], data[1]);
        });
        this.socket.on("position", function (data) {
            graph.dragged(data[0], data[1], data[2]);
        });
        this.socket.on("correct", function (data) {
            game_1.GAME.setCorrect(data);
        });
        this.socket.on("uncorrect", function () {
            game_1.GAME.setIncorrect();
        });
        this.socket.on("add", function (data) {
            graph.addNode(data[0], data[1], data[2]);
        });
        this.socket.on("edit", function (data) {
            graph.editNode(data[0], data[1]);
        });
        this.socket.on("remove", function (data) {
            graph.removeNode(data);
        });
        this.socket.on("connectE", function (data) {
            graph.addEdge(data[0], data[1]);
        });
        this.socket.on("connectPrev", function () {
            graph.addEdge(graph.getPreviousNodeName(), graph.getCurrNodeName());
        });
        this.socket.on("connectF", function () {
            graph.addEdge(graph.getFirstNodeName(), graph.getCurrNodeName());
        });
        this.socket.on("newGame", function () {
            game_1.GAME.newGameS();
        });
        this.socket.on("rndGame", function () {
            game_1.GAME.randomGameS();
        });
    };
    return Socket;
}());
exports["default"] = Socket;
