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
exports.editNode = exports.removeNode = exports.addNode = exports.getCurrNodeName = exports.getPreviousNodeName = exports.getFirstNodeName = exports.removeEdge = exports.addEdge = exports.recreateGraphJSON = exports.getGraphJSON = exports.setNodes = exports.getAllNodes = exports.setAllNodesUneditable = exports.getGraph = exports.clearClickedNodes = exports.unsetCurrentClickedNodes = exports.setUnclickableNodes = exports.lockNodes = exports.onNodeClick_Connect = exports.onNodeClick = exports.getAnswers = exports.getNodes = exports.clearGraph = exports.send = exports.getClickedNodes = exports.getClickedNodesName = exports.unsetClickedNodes = exports.ungrabify = exports.unselectify = exports.setColorClickedNodes = exports.setAllWords = exports.recreateGraph = exports.dragged = exports.setOnButtonClick = exports.createGraphFromFile = exports.split = exports.readFromFileL = exports.readFromFileW = exports.readFromFileA = exports.readFromFile = exports.checkIfExists = exports.typeOfFile = void 0;
var $ = require("../../lib/jquery/jquery-3.4.1.min");
var cytoscape = require("../../lib/cytoscape/cytoscape.min");
var base64ToBlob = require("../../lib/base64toblob");
var file_saver_1 = require("file-saver");
var edge_1 = require("../objects/edge");
var node_1 = require("../objects//node");
var cxtmenu = require("cytoscape-cxtmenu");
var popper = require("cytoscape-popper");
var game_1 = require("./game");
var dialog_1 = require("./dialog");
cytoscape.use(cxtmenu);
cytoscape.use(popper);
var typeOfFile;
(function (typeOfFile) {
    typeOfFile[typeOfFile["W"] = 0] = "W";
    typeOfFile[typeOfFile["A"] = 1] = "A";
    typeOfFile[typeOfFile["L"] = 2] = "L";
})(typeOfFile = exports.typeOfFile || (exports.typeOfFile = {}));
/**
 *
 * Creates graphs
 * Note: node equals Node equals element
 * @export
 * @class Graph
 */
var Graph = /** @class */ (function () {
    function Graph() {
        /**
         *
         * Increasing number for ids
         * @type {number}
         * @memberof Graph
         */
        this.number = 0;
        /**
         *
         * Style used for nodes in graph
         * [node color, font color, shape, width, height, font size]
         * @type {string[]}
         * @memberof Graph
         */
        this.nodesStyle = new Array(6);
        /**
         *
         * Style used for edges in graph
         * [color, width];
         * @type {string[]}
         * @memberof Graph
         */
        this.edgeStyle = new Array(3);
        /**
         *
         * Layout of the graph
         * circle, preset, random, grid
         * @type {string}
         * @memberof Graph
         */
        this.layout = "";
        /**
         *
         * Editability of the graph nodes
         * nodes can be edited and deleted
         * @type {boolean}
         * @memberof Graph
         */
        this.editable = false;
        /**
         *
         * All nodes in the graph
         * @type {Node[]}
         * @memberof Graph
         */
        this.nodes = [];
        /**
         *
         * nodes read from the file
         * @type {Node[][]}
         * @memberof Graph
         */
        this.allNodes = [];
        /**
         *
         * Edges that connect nodes
         * @private
         * @type {Edge[]}
         * @memberof Graph
         */
        this.edges = [];
        /**
         *
         *
         * @type {Node}
         * @memberof Graph
         */
        this.prevNode = undefined;
        this.currNode = undefined;
        this.firstElement = undefined;
        this.currClicked = undefined;
        this.clickedNodes = [];
        this.clickedEdges = [];
        /**
         *
         * Answers to words read from the file
         * @type {Node[]}
         * @memberof Graph
         */
        this.answers = [];
        /**
         *
         * File was read and graph was made
         * Graph is ready to use or not
         * @type {boolean}
         * @memberof Graph
         */
        this.ready = false;
    }
    /**
     *
     * Gets instance of singleton class Graph
     * @static
     * @returns {Graph}
     * @memberof Graph
     */
    Graph.getInstance = function () {
        if (!Graph.instance) {
            Graph.instance = new Graph();
        }
        return Graph.instance;
    };
    /**
     *
     * Sets styles, layout and editability of graph
     * @param {string[]} nodestyle
     * @param {string[]} edgeStyle
     * @param {string} lay
     * @param {boolean} editable
     * @memberof Graph
     */
    Graph.prototype.set = function (nodestyle, edgeStyle, lay, editable) {
        for (var i = 0; i < this.nodesStyle.length; i++) {
            this.nodesStyle[i] = nodestyle[i];
        }
        for (var i = 0; i < this.edgeStyle.length; i++) {
            this.edgeStyle[i] = edgeStyle[i];
        }
        this.layout = lay;
        this.editable = editable;
    };
    /**
     *
     * Gets graph in JSON string
     * @returns
     * @memberof Graph
     */
    Graph.prototype.getGraphJSON = function () {
        var nodes = [];
        var edges = [];
        var nodePositions = [];
        for (var _i = 0, _a = this.nodes; _i < _a.length; _i++) {
            var Node = _a[_i];
            var x = this.cyElement.$("#" + Node.id).renderedPosition("x");
            var y = this.cyElement.$("#" + Node.id).renderedPosition("y");
            nodePositions.push([x, y]);
            nodes.push([Node.name, Node.id]);
        }
        for (var _b = 0, _c = this.edges; _b < _c.length; _b++) {
            var edge = _c[_b];
            edges.push([edge.source.name, edge.target.name]);
        }
        return JSON.stringify({
            nodes: nodes,
            nodePositions: nodePositions,
            edges: edges,
            answers: this.answers,
            nodestyle: this.nodesStyle,
            edgeStyle: this.edgeStyle,
            layout: this.layout,
            editable: this.editable,
            uneditablenodes: this.getUneditablenodes(),
            firstElement: this.getFirstElementString(),
            prevNode: this.getprevnodestring(),
            allNodes: this.getallNodesStringify(),
            correctAnswers: game_1.GAME.correctAnswers
        });
    };
    /**
     *
     * Recreates graph from JSON string
     * @param {string} graph
     * @memberof Graph
     */
    Graph.prototype.recreateJSON = function (graph) {
        return __awaiter(this, void 0, void 0, function () {
            var g, nodes, nodePositions, edges, lasti, uneditable, i, x, y, Node, contains, _i, edges_1, edge;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        g = JSON.parse(graph);
                        nodes = g.nodes;
                        nodePositions = g.nodePositions;
                        edges = g.edges;
                        this.answers = g.answers;
                        this.layout = g.layout;
                        this.editable = g.editable;
                        this.nodesStyle = g.nodestyle;
                        this.edgeStyle = g.edgeStyle;
                        this.nodes = [];
                        this.edges = [];
                        lasti = nodes[nodes.length - 1][1];
                        this.number = lasti.substring(lasti.indexOf("n"));
                        uneditable = g.uneditablenodes;
                        this.firstElement =
                            g.firstElement == undefined
                                ? undefined
                                : new Node(g.firstElement[0], g.firstElement[1]);
                        this.prevNode =
                            g.prevNode == undefined
                                ? undefined
                                : new Node(g.prevNode[0], g.prevNode[1]);
                        game_1.GAME.setallNodes(g.allNodes);
                        game_1.GAME.correctAnswers = g.correctAnswers;
                        for (i = nodes.length - 1; i >= 0; i--) {
                            x = nodePositions[i][0];
                            y = nodePositions[i][1];
                            Node = new Node(nodes[i][1], nodes[i][0], x, y);
                            contains = uneditable.some(function (i) { return i == Node.id; });
                            Node.editable = !contains;
                            this.nodes.push(Node);
                        }
                        this.number = nodes.length;
                        this.ready = false;
                        createGraphReuseCy();
                        return [4 /*yield*/, checkIfExists()];
                    case 1:
                        _a.sent();
                        for (_i = 0, edges_1 = edges; _i < edges_1.length; _i++) {
                            edge = edges_1[_i];
                            this.addEdge(edge[0], edge[1]);
                        }
                        this.setSocket();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     *
     * Gets all nodes in graph
     * @returns
     * @memberof Graph
     */
    Graph.prototype.getnodes = function () {
        return this.nodes;
    };
    /**
     *
     * Gets all nodes read from the file
     * Ready to use for new or random game
     * @returns
     * @memberof Graph
     */
    Graph.prototype.getAllNodes = function () {
        return this.allNodes;
    };
    /**
     *
     * Gets first element added to graph
     * @returns
     * @memberof Graph
     */
    Graph.prototype.getFirstElementString = function () {
        if (this.firstElement != undefined) {
            return [this.firstElement.id, this.firstElement.name];
        }
        return undefined;
    };
    /**
     *
     * Gets element that was previously added to graph
     * @returns
     * @memberof Graph
     */
    Graph.prototype.getprevnodestring = function () {
        if (this.prevNode != undefined) {
            return [this.prevNode.id, this.prevNode.name];
        }
        return undefined;
    };
    /**
     *
     * Gets nodes that can not be deleted and edited
     * @returns
     * @memberof Graph
     */
    Graph.prototype.getUneditablenodes = function () {
        var ar = [];
        this.nodes.forEach(function (i) {
            if (!i.editable) {
                ar.push(i.id);
            }
        });
        return ar;
    };
    /**
     * Gets all nodes in JSON string
     *
     * @returns
     * @memberof Graph
     */
    Graph.prototype.getallNodesStringify = function () {
        var data = [];
        this.allNodes.forEach(function (i) {
            var d = [];
            i.forEach(function (i1) {
                d.push({
                    id: i1.id,
                    name: i1.name
                });
            });
            data.push(d);
        });
        return JSON.stringify(data);
    };
    /**
     * Sets current connected socket
     *
     * @memberof Graph
     */
    Graph.prototype.setSocket = function () {
        this.socket = game_1.GAME.getPlayer().getSocket();
    };
    /**
     *
     * Gets graph object of cytoscape.js library
     * @returns
     * @memberof Graph
     */
    Graph.prototype.getCyElement = function () {
        return this.cyElement;
    };
    /**
     *
     * Gets answers read from the graph deliminated by empty line
     * @returns
     * @memberof Graph
     */
    Graph.prototype.getAnswers = function () {
        return this.answers;
    };
    /**
     * Changes color of the node
     *
     * @param {string} id
     * @param {string} color
     * @memberof Graph
     */
    Graph.prototype.changeColor = function (id, color) {
        this.getElement(id).style({ "background-color": color });
    };
    /**
     * Not used function
     * Sends the positions to clients through the server
     */
    Graph.prototype.setOnDrag = function () {
        this.cyElement.on("drag", "node", function (evt) {
            Graph.getInstance().send("position", '{"id" : "' +
                this.data("id") +
                '", "x" : "' +
                this.renderedPosition().x +
                '", "y" : "' +
                this.renderedPosition().y +
                '", "name" : "' +
                this.data("name") +
                '"}');
        });
    };
    /**
     *
     * Set on node click event
     * Node changes color
     * @param {string} color
     * @memberof Graph
     */
    Graph.prototype.onNodeClick = function (color, send) {
        if (send === void 0) { send = true; }
        return __awaiter(this, void 0, void 0, function () {
            var promise;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        promise = checkIfExists();
                        return [4 /*yield*/, promise];
                    case 1:
                        _a.sent();
                        this.colorClicked = color;
                        this.cyElement.on("tap", "node", function (evt) {
                            if (!game_1.GAME.done) {
                                if (this.socket == null) {
                                    this.clicked([this.data("id"), this.data("name")]);
                                }
                                else {
                                    this.send("tap", '{"id" : "' +
                                        this.data("id") +
                                        '", "x" : "' +
                                        this.position("x") +
                                        '", "y" : "' +
                                        this.position("x") +
                                        '", "name" : "' +
                                        this.data("name") +
                                        '"}');
                                }
                            }
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    Graph.prototype.clicked = function (data) {
        var id = data[0];
        var name = data[1];
        if (this.getnodesByName(name).length == 1) {
            id = this.getNodeByName(name).id;
        }
        var element = this.getNodeById(id);
        if (element.clickable) {
            this.currClicked = new node_1["default"](id, name);
            if (!this.wasClicked(id)) {
                this.addClickedElement(this.currClicked);
                this.changeColor(id, this.colorClicked);
            }
            else {
                this.changeColor(id, this.color);
                this.clickedNodes = this.clickedNodes.filter(function (i) { return i.id != id; });
                this.currClicked = this.clickedNodes[this.clickedNodes.length - 1];
            }
        }
    };
    Graph.prototype.clickedConnect = function (data) {
        var id = data[0];
        var name = data[1];
        if (this.getnodesByName(name).length == 1) {
            id = this.getNodeByName(name).id;
        }
        var element = this.getNodeById(id);
        if (element.clickable) {
            var prevClicked = this.currClicked;
            this.currClicked = new node_1["default"](id, name);
            if (!this.wasClicked(id)) {
                this.addClickedElement(this.currClicked);
                if (prevClicked != undefined && id != prevClicked.id) {
                    this.addEdge(id, prevClicked.id);
                }
                this.changeColor(id, this.colorClicked);
            }
            else {
                this.changeColor(id, this.color);
                this.clickedNodes = this.clickedNodes.filter(function (i) { return i.id != id; });
                this.disaddEdge(prevClicked.id, id);
                this.currClicked = this.clickedNodes[this.clickedNodes.length - 1];
            }
        }
    };
    /**
     * Sets on node click event
     * Node changes color and addEdge with previous Node after click
     * @param color
     */
    Graph.prototype.onNodeClick_Connect = function (color) {
        return __awaiter(this, void 0, void 0, function () {
            var promise;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        promise = checkIfExists();
                        return [4 /*yield*/, promise];
                    case 1:
                        _a.sent();
                        this.colorClicked = color;
                        this.cyElement.on("tap", "node", function (evt) {
                            if (!game_1.GAME.done) {
                                if (this.socket == null) {
                                    Graph.getInstance().clickedConnect([this.data("id"), this.data("name")]);
                                }
                                else {
                                    Graph.getInstance().send("tapConnect", '{"id" : "' +
                                        this.data("id") +
                                        '", "x" : "' +
                                        this.position("x") +
                                        '", "y" : "' +
                                        this.position("x") +
                                        '", "name" : "' +
                                        this.data("name") +
                                        '"}');
                                }
                            }
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Sends event to server
     * @param evt
     * @param JSON
     */
    Graph.prototype.send = function (evt, JSON) {
        if (this.socket != null) {
            this.socket.send(evt, JSON);
        }
    };
    /**
     *
     * Unsets nodes that user clicked
     * DisaddEdge all connected nodes
     * @memberof Graph
     */
    Graph.prototype.unsetClickedNodes = function () {
        for (var _i = 0, _a = this.clickedNodes; _i < _a.length; _i++) {
            var el = _a[_i];
            this.getElement(el.id).style({ "background-color": this.color });
            for (var _b = 0, _c = this.edges; _b < _c.length; _b++) {
                var edge = _c[_b];
                if (edge != undefined) {
                    if (edge.source.id == el.id) {
                        this.disaddEdge(edge.source.id, edge.target.id);
                    }
                    else if (edge.target.id == el.id) {
                        this.disaddEdge(edge.target.id, edge.source.id);
                    }
                }
            }
        }
        this.unsetCurrentClickedNodes();
        this.clickedNodes = [];
    };
    /**
     *
     * Sets color of nodes
     * @param {Node[]} nodes
     * @param {string} color
     * @memberof Graph
     */
    Graph.prototype.setNodesColor = function (nodes, color) {
        for (var _i = 0, nodes_1 = nodes; _i < nodes_1.length; _i++) {
            var node = nodes_1[_i];
            this.getElement(node.id).style({ "background-color": color });
        }
    };
    /**
     * Forbids the user to click on nodes
     * @param nodes
     */
    Graph.prototype.setUnclickableNodes = function (nodes) {
        for (var _i = 0, nodes_2 = nodes; _i < nodes_2.length; _i++) {
            var node = nodes_2[_i];
            var n = this.getNodeById(node.id);
            n.clickable = false;
        }
    };
    /**
     * Removes all clicked nodes from array
     *
     * @memberof Graph
     */
    Graph.prototype.unsetCurrentClickedNodes = function () {
        this.currClicked = undefined;
    };
    /**
     * Removes all nodes from array
     *
     * @memberof Graph
     */
    Graph.prototype.deleteClickednodes = function () {
        this.nodes = [];
    };
    /**
     * Checks if the Node was clicked
     * Is/Is not in array of clicked elements
     * @param id
     */
    Graph.prototype.wasClicked = function (id) {
        var ar = this.clickedNodes.filter(function (i) { return i.id == id; });
        return ar.length == 1 ? true : false;
    };
    /**
     * Checks if the Node is in graph
     * @param name
     */
    Graph.prototype.isNodeInGraph = function (name) {
        return this.nodes.some(function (Node) { return Node.name === name; });
    };
    /**
     * Sends event add element to server
     * @param str name of the node
     * @param editable can or can not be edited and deleted
     */
    Graph.prototype.addNode = function (id, str, editable) {
        if (editable === void 0) { editable = false; }
        if (this.socket != null) {
            this.send("add", '{"id": "' +
                this.number++ +
                '", "name" : "' +
                str +
                '", "editable" : "' +
                editable +
                '"}');
        }
        else {
            this.addElement(this.number++, str, editable);
        }
    };
    /**
     * Sends event remove element to server
     * @param str
     */
    Graph.prototype.removeNode = function (str) {
        if (this.socket != null) {
            this.send("remove", '{"name" : "' + str + '"}');
        }
        else {
            this.removeNodeG(str);
        }
    };
    /**
     * Gets random position x, y in the graph area
     */
    Graph.prototype.randomPosition = function () {
        var x = Math.floor(Math.random() * (this.cyElement.width() - 100));
        var y = Math.floor(Math.random() * (this.cyElement.height() - 100));
        return [x, y];
    };
    /**
     * Adds node to graph
     * @param id
     * @param str
     * @param editable
     */
    Graph.prototype.addElement = function (id, str, editable) {
        if (editable === void 0) { editable = false; }
        var p = this.randomPosition();
        if (!this.isNodeInGraph(str)) {
            var i = new node_1["default"]("n" + id, str, p[0], p[1], editable);
            this.nodes.push(i);
            this.cyElement.add({
                data: {
                    id: i.id,
                    name: i.name,
                    type: "type1"
                },
                renderedPosition: {
                    x: p[0],
                    y: p[1]
                }
            });
            this.currNode.addNext(i);
            this.prevNode = this.currNode;
            this.currNode = i;
            i.setPrevious(this.prevNode);
        }
        else {
            dialog_1.Dialog.callDialog("Graf obsahuje vrchol s rovnakým menom - zmeň názov alebo pridaj názov prázdnemu vrcholu");
        }
    };
    /**
     * Adds child node to given node
     * @param str1
     * @param str2
     * @param editable
     */
    Graph.prototype.addChild = function (str1, str2, editable) {
        if (editable === void 0) { editable = false; }
        var p = this.randomPosition();
        if (!this.isNodeInGraph(str2)) {
            var i = new node_1["default"]("n" + this.number++, str2, p[0], p[1], editable);
            var old = this.getNodeById(str1);
            this.nodes.push(i);
            this.cyElement.add({
                data: {
                    id: i.id,
                    name: i.name,
                    type: "type1"
                },
                renderedPosition: {
                    x: p[0],
                    y: p[1]
                }
            });
            this.connect(old.name, i.name);
        }
        else {
            dialog_1.Dialog.callDialog("Graf obsahuje vrchol s rovnakým menom - zmeň názov alebo pridaj názov prázdnemu vrcholu");
        }
    };
    /**
     * Adds nodes to graph
     * @param strings
     * @param editable
     */
    Graph.prototype.addElements = function (strings, editable) {
        if (editable === void 0) { editable = false; }
        var nodes = [];
        for (var _i = 0, strings_1 = strings; _i < strings_1.length; _i++) {
            var str = strings_1[_i];
            if (!this.isNodeInGraph(str)) {
                var i = new node_1["default"]("n" + this.number++, str, undefined, undefined, editable);
                this.nodes.push(i);
                nodes.push({
                    data: {
                        id: i.id,
                        name: i.name,
                        type: "type1"
                    }
                });
            }
        }
        this.cyElement.add(nodes);
    };
    /**
     * Adds element to clicked elements
     * @param Node
     */
    Graph.prototype.addClickedElement = function (Node) {
        this.clickedNodes.push(Node);
    };
    /**
     * Removes element from clicked elements
     * @param str
     */
    Graph.prototype.removeClickedElement = function (str) {
        this.clickedNodes = this.clickedNodes.filter(function (Node) { return Node.id != str; });
    };
    /**
     * Removes element from graph
     *
     * @param {string} str
     * @memberof Graph
     */
    Graph.prototype.removeNodeG = function (str) {
        var el = this.getNodeById(str);
        if (el.getNext().length == 0) {
            this.cyElement.remove(this.cyElement.$("#" + str));
            this.nodes = this.nodes.filter(function (Node) { return Node.id != str; });
            /*var cur = this.currNode.getPrevious();
                  this.currNode = cur;
                  this.prevNode = cur.getPrevious();*/
            el.getPrevious().removeNext(el);
        }
        else {
            dialog_1.Dialog.callDialog("Vrchol nie je možné vymazať");
        }
    };
    /**
     * Removes elements from graph
     * @param strings names of nodes
     */
    Graph.prototype.removeElements = function (strings) {
        for (var _i = 0, strings_2 = strings; _i < strings_2.length; _i++) {
            var str = strings_2[_i];
            var element = this.cyElement.$("#" + str);
            this.cyElement.remove(element);
        }
    };
    /**
     * Removes edge by id from graph
     * @param id id of edge
     */
    Graph.prototype.removeEdgeById = function (id) {
        this.cyElement.remove("edge[target='" + id + "']");
    };
    /**
     * Edits name (label) of node
     * @param id
     * @param name
     */
    Graph.prototype.editNode = function (id, name) {
        var n = this.cyElement.$id(id);
        var nodeInGraph = this.getNodeById(id);
        nodeInGraph.name = name;
        n.data("name", name);
    };
    /**
     *
     * Reruns the layout on graph
     * @memberof Graph
     */
    Graph.prototype.rerun = function () {
        var options;
        if (this.layout == "grid") {
            options = {
                name: "grid",
                fit: true,
                padding: 30,
                boundingBox: undefined,
                avoidOverlap: true,
                avoidOverlapPadding: 10,
                nodeDimensionsIncludeLabels: false,
                spacingFactor: undefined,
                condense: false,
                rows: Math.sqrt(this.nodes.length),
                cols: Math.sqrt(this.nodes.length),
                position: function (node) { },
                sort: undefined,
                animate: false,
                animationDuration: 500,
                animationEasing: undefined,
                animateFilter: function (node, i) {
                    return true;
                },
                ready: undefined,
                stop: undefined,
                transform: function (node, position) {
                    return position;
                }
            };
            this.cyElement.layout(options).run();
        }
        else if (this.layout == "preset") {
            var options_1 = {
                name: "preset",
                minZoom: 0.2,
                maxZoom: 2,
                zoom: 1,
                zoomingEnabled: true,
                userZoomingEnabled: true,
                panningEnabled: true,
                userPanningEnabled: true,
                fit: true,
                padding: 100,
                positions: undefined,
                pan: undefined,
                animate: false,
                animationDuration: 500,
                animationEasing: undefined,
                animateFilter: function (node, i) {
                    return true;
                },
                ready: undefined,
                stop: undefined,
                transform: function (node, position) {
                    return position;
                }
            };
            this.cyElement.layout(options_1).run();
        }
        else {
            this.cyElement.layout({ name: this.layout }).run();
        }
    };
    /**
     *
     * Locks element in graph
     * Locked element is not movable and editable
     * @memberof Graph
     */
    Graph.prototype.lockNode = function () {
        return __awaiter(this, void 0, void 0, function () {
            var promise, n;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        promise = checkIfExists();
                        return [4 /*yield*/, promise];
                    case 1:
                        _a.sent();
                        n = this.getNodeByName(this.currNode.name);
                        this.cyElement.$("#" + n.id).ungrabify();
                        n.editable = false;
                        n.locked = true;
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     *
     * Sets first Node in array of nodes (nodes in graph) uneditable
     * @memberof Graph
     */
    Graph.prototype.setFirstElementUneditable = function () {
        return __awaiter(this, void 0, void 0, function () {
            var promise, n;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        promise = checkIfExists();
                        return [4 /*yield*/, promise];
                    case 1:
                        _a.sent();
                        n = this.getNodeByName(this.nodes[0].name);
                        n.editable = false;
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Sets all nodes in graph uneditable
     *
     * @memberof Graph
     */
    Graph.prototype.setallNodesUneditable = function () {
        return __awaiter(this, void 0, void 0, function () {
            var promise;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        promise = checkIfExists();
                        return [4 /*yield*/, promise];
                    case 1:
                        _a.sent();
                        this.nodes.forEach(function (Node) {
                            _this.setElementUneditable(Node);
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Sets given Node uneditable
     * @param Node
     */
    Graph.prototype.setElementUneditable = function (Node) {
        return __awaiter(this, void 0, void 0, function () {
            var promise;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        promise = checkIfExists();
                        return [4 /*yield*/, promise];
                    case 1:
                        _a.sent();
                        Node.editable = false;
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     *
     * Locks all nodes in graph
     * nodes are not movable and editable
     * @memberof Graph
     */
    Graph.prototype.lockNodes = function () {
        return __awaiter(this, void 0, void 0, function () {
            var promise, _i, _a, Node, n;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        promise = checkIfExists();
                        return [4 /*yield*/, promise];
                    case 1:
                        _b.sent();
                        for (_i = 0, _a = this.nodes; _i < _a.length; _i++) {
                            Node = _a[_i];
                            n = this.getNodeByName(Node.name);
                            this.cyElement.$("#" + n.id).ungrabify();
                            n.editable = false;
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Gets element from graph as cytoscape.js node
     * @param str
     */
    Graph.prototype.getElement = function (str) {
        return this.cyElement.$("#" + str);
    };
    /**
     *
     * Gets id of Node give by name
     * @param {string} str
     * @returns
     * @memberof Graph
     */
    Graph.prototype.getIdFromName = function (str) {
        var ar = this.nodes.filter(function (i) { return i.name === str; });
        return ar.length > 0 ? ar[0].id : null;
    };
    /**
     * Gets Node by id from the nodes in the graph
     *
     * @param {string} str
     * @returns
     * @memberof Graph
     */
    Graph.prototype.getNodeById = function (str) {
        var ar = this.nodes.filter(function (i) { return i.id == str; });
        return ar.length > 0 ? ar[0] : null;
    };
    /**
     * Gets Node by name from the nodes in the graph
     *
     * @param {string} str
     * @returns
     * @memberof Graph
     */
    Graph.prototype.getNodeByName = function (str) {
        var ar = this.nodes.filter(function (i) { return i.name === str; });
        return ar[0];
    };
    /**
     * Gets all nodes with the same name
     *
     * @param {string} str
     * @returns
     * @memberof Graph
     */
    Graph.prototype.getnodesByName = function (str) {
        var ar = this.nodes.filter(function (i) { return i.name === str; });
        return ar;
    };
    /**
     * Checks id of given Node
     * Whether Node with such id is in graph
     * @param {string} str
     * @returns
     * @memberof Graph
     */
    Graph.prototype.checkId = function (str) {
        var ar = this.nodes.filter(function (i) { return i.id === str; });
        if (ar.length != 0) {
            return ar[0].id;
        }
        return null;
    };
    /**
     * addEdge two nodes
     *
     * @param {string} str1 name of node1
     * @param {string} str2 name of node2
     * @memberof Graph
     */
    Graph.prototype.addEdge = function (str1, str2) {
        var id1 = this.getIdFromName(str1);
        var id2 = this.getIdFromName(str2);
        if (id1 == null && id2 == null) {
            id1 = this.checkId(str1);
            id2 = this.checkId(str2);
        }
        var i1 = this.getNodeById(id1);
        var i2 = this.getNodeById(id2);
        if (id1 != null && id2 != null) {
            this.edges.push(new edge_1["default"](i1, i2));
            var e = [];
            if (this.edgeStyle[2] == "arrow") {
                console.log('hiir');
                e.push({
                    group: "edges",
                    data: {
                        source: id1,
                        target: id2,
                        type: "oriented"
                    }
                });
            }
            else {
                e.push({
                    group: "edges",
                    data: {
                        source: id1,
                        target: id2,
                        type: "default"
                    }
                });
            }
            i1.addNext(i2);
            i2.setPrevious(i1);
            this.cyElement.add(e);
        }
    };
    /**
     *
     * Multiplayer - Sends connect event to server
     * Singleplayer - addEdge nodes
     * @param {string} str1
     * @param {string} str2
     * @memberof Graph
     */
    Graph.prototype.connect = function (str1, str2) {
        if (this.socket != null) {
            this.socket.send("connectE", '{"name1" : "' + str1 + '", "name2" : "' + str2 + '"}');
        }
        else {
            this.addEdge(str1, str2);
        }
    };
    /**
     *
     * Multiplayer - Sends connect with first element event to server
     * Singleplayer - addEdge node with the first node in the graph
     * @memberof Graph
     */
    Graph.prototype.connectFirst = function () {
        if (this.socket != null) {
            this.socket.send("connectF", "");
        }
        else {
            this.addEdge(this.firstElement.name, this.currNode.name);
        }
    };
    /**
     *
     * Multiplayer - Sends connect with previous element event to server
     * Singleplayer - addEdge node with the previously added node in the graph
     * @memberof Graph
     */
    Graph.prototype.connectPrevious = function () {
        if (this.socket != null) {
            this.socket.send("connectPrev", "");
        }
        else {
            this.addEdge(this.prevNode.name, this.currNode.name);
        }
    };
    /**
     * DisaddEdge two nodes
     *
     * @param {string} str1 name of node1
     * @param {string} str2 name of node2
     * @memberof Graph
     */
    Graph.prototype.disaddEdge = function (str1, str2) {
        var id1 = this.checkId(str1);
        var id2 = this.checkId(str2);
        if (id1 != null && id2 != null) {
            this.cyElement.remove("edge[source='" + id1 + "']");
            this.cyElement.remove("edge[target='" + id2 + "']");
            this.edges = this.edges.filter(function (e) { return e.source.id != id1 && e.target.id != id2; });
        }
    };
    /**
     *
     *
     * @param {string} str1
     * @param {string} str2
     * @memberof Graph
     */
    Graph.prototype.removeEdge = function (str1, str2) {
        if (this.socket == null) {
            this.disaddEdge(str1, str2);
        }
        else {
            this.send("tapremoveEdge", '{"str1" : "' + str1 + '", "str2" : "' + str2 + '"}');
        }
    };
    /**
     *
     * Adds input box into node for editing node name
     * @param {cytoscape.node} node
     * @memberof Graph
     */
    Graph.prototype.addOnNodeDiv = function (node) {
        var n = this.getNodeById(node.id());
        if (n.editable) {
            var div = document.getElementById("input-container");
            if (div != null) {
                document.body.removeChild(div);
            }
            var makeDiv = function (text) {
                var div = document.createElement("div");
                div.id = "input-container";
                var textarea = document.createElement("input");
                textarea.setAttribute("type", "text");
                textarea.id = "text";
                var inputElement = textarea;
                inputElement.value = node.data("name");
                div.classList.add("popper-div");
                div.appendChild(textarea);
                document.body.appendChild(div);
                return div;
            };
            var popperNode = node.popper({
                content: function () {
                    return makeDiv(node.data("name"));
                },
                popper: {
                    placement: "center-start"
                }
            });
            var updateNode = function () {
                popperNode.scheduleUpdate();
            };
            node.on("position", updateNode);
            $("#text").on("keydown", function (e) {
                if (e.which == 13) {
                    e.preventDefault();
                    Graph.getInstance().check(node);
                }
            });
            //this.cyElement.on('pan zoom resize', updateNode);
        }
    };
    /**
     * Checks correction after editing node name
     *
     * @param {cytoscape.node} node
     * @memberof Graph
     */
    Graph.prototype.check = function (node) {
        var text = $("#text").val();
        if (!this.isNodeInGraph(text)) {
            game_1.GAME.check(text).then(function (result) {
                if (result == "OK") {
                    if (Graph.getInstance().socket == null) {
                        Graph.getInstance().editNode(node.id(), text);
                    }
                    else {
                        Graph.getInstance().send("edit", '{"id" : "' + node.id() + '", "name" : "' + text + '"}');
                    }
                }
                else {
                    dialog_1.Dialog.callDialog(result);
                }
            });
        }
        else {
            dialog_1.Dialog.callDialog("Graf obsahuje vrchol s rovnakým menom - zmeň názov alebo pridaj názov prázdnemu vrcholu");
        }
        var div = document.getElementById("input-container");
        document.body.removeChild(div);
    };
    /**
     *
     * Creates menu that appears after node press
     * Edit, delete, add neighbour node
     * @memberof Graph
     */
    Graph.prototype.createMenu = function () {
        this.cyElement.cxtmenu({
            selector: "node",
            commands: [
                {
                    content: '<span class="fas fa-pencil-alt"></span>',
                    select: function (ele) {
                        if (Graph.getInstance().getNodeById(ele.id()).editable) {
                            Graph.getInstance().addOnNodeDiv(ele);
                        }
                        else {
                            dialog_1.Dialog.callDialog("Nie je možné upravovať vrchol");
                        }
                    }
                },
                {
                    content: '<span class="fas fa-trash-alt"></span>',
                    select: function (ele) {
                        if (Graph.getInstance().getNodeById(ele.id()).editable) {
                            Graph.getInstance().removeNode(ele.id());
                        }
                        else {
                            dialog_1.Dialog.callDialog("Nie je možné vymazať vrchol");
                        }
                    }
                },
                {
                    content: '<span class="fas fa-plus"></span>',
                    select: function (ele) {
                        Graph.getInstance().addChild(ele.id(), "", true);
                    }
                },
            ]
        });
    };
    /**
     *
     * Saves graph as png
     * Calls dialog after succesful download
     * @memberof Graph
     */
    Graph.prototype.saveImage = function () {
        try {
            var b64key = "base64,";
            var b64 = this.cyElement
                .png()
                .substring(this.cyElement.png().indexOf(b64key) + b64key.length);
            var imgBlob = base64ToBlob(b64, "image/png");
            file_saver_1.saveAs(imgBlob, "graph.png");
            dialog_1.Dialog.callDialog("Graf bol úspešne uložený");
        }
        catch (err) {
            dialog_1.Dialog.callDialog("Graf sa nepodarilo uložiť");
        }
    };
    /**
     * Clears all attributes of graph
     * @memberof Graph
     */
    Graph.prototype.clearGraph = function () {
        Graph.getInstance().number = 0;
        Graph.getInstance().cyElement.elements().remove();
        Graph.getInstance().clickedNodes = [];
        Graph.getInstance().currClicked = undefined;
        Graph.getInstance().nodes = [];
    };
    /**
     * Sets cytoscape.js graph object
     * @param nodestyle
     * @param edgeStyle
     */
    Graph.prototype.setCyElement = function (nodestyle, edgeStyle) {
        Graph.getInstance().color = nodestyle[0];
        if (Graph.getInstance().cyElement != undefined) {
            return;
        }
        Graph.getInstance().cyElement = cytoscape({
            container: document.getElementById("graph"),
            style: [
                {
                    selector: 'node[type="type1"]',
                    style: {
                        shape: nodestyle[3],
                        width: nodestyle[4],
                        height: nodestyle[5],
                        "background-color": nodestyle[0],
                        "text-wrap": "wrap",
                        "text-halign": "center",
                        "text-valign": "center",
                        label: "data(name)",
                        "font-size": nodestyle[2],
                        color: nodestyle[1]
                    }
                },
                {
                    selector: 'edge[type="default"]',
                    style: {
                        width: edgeStyle[1],
                        "line-color": edgeStyle[0]
                    }
                },
                {
                    selector: 'edge[type="oriented"]',
                    style: {
                        width: edgeStyle[1],
                        "line-color": edgeStyle[0],
                        "target-arrow-color": edgeStyle[0],
                        "curve-style": "bezier",
                        'target-arrow-shape': 'triangle'
                    }
                },
            ]
        });
    };
    Graph.prototype.createGraphCy = function () {
        var newnodes = [];
        var x = undefined;
        var y = undefined;
        for (var _i = 0, _a = Graph.getInstance().nodes; _i < _a.length; _i++) {
            var s = _a[_i];
            if (s.x != undefined && s.y != undefined) {
                newnodes.push({
                    data: {
                        id: s.id,
                        name: s.name,
                        type: "type1"
                    },
                    renderedPosition: {
                        x: s.x,
                        y: s.y
                    }
                });
            }
            else {
                newnodes.push({
                    data: {
                        id: s.id,
                        name: s.name,
                        type: "type1"
                    }
                });
            }
        }
        Graph.getInstance().setCyElement(Graph.getInstance().nodesStyle, Graph.getInstance().edgeStyle);
        Graph.getInstance().layout = Graph.getInstance().layout;
        Graph.getInstance().currNode = Graph.getInstance().firstElement = Graph.getInstance().nodes[0];
        Graph.getInstance().cyElement.add(newnodes);
        //Graph.getInstance().setOnDrag();
        if (Graph.getInstance().editable) {
            Graph.getInstance().createMenu();
        }
        Graph.getInstance().rerun();
        Graph.getInstance().ready = true;
        return Graph.getInstance();
    };
    /**
     *
     * Singleton class
     * @private
     * @static
     * @type {Graph}
     * @memberof Graph
     */
    Graph.instance = new Graph();
    return Graph;
}());
/**
 *
 * Checks if the graph was created and is ready to use
 * @export
 * @returns
 */
function checkIfExists() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve) {
                    var checkExist = setInterval(function () {
                        if (Graph.getInstance().ready == true) {
                            clearInterval(checkExist);
                            resolve("done!");
                        }
                    }, 200);
                })];
        });
    });
}
exports.checkIfExists = checkIfExists;
function readFromFile(typefile, file) {
    if (typefile == typeOfFile.W) {
        readFromFileW(file);
    }
    else if (typefile == typeOfFile.A) {
        readFromFileA(file);
    }
    else if (typefile == typeOfFile.L) {
        readFromFileL(file);
    }
}
exports.readFromFile = readFromFile;
//-----------READ FROM FILE---------------------------
/**
 * Reads from file words and answers delimited by empty
 *
 * @export
 * @param {string} file
 */
function readFromFileA(file) {
    Graph.getInstance().ready = false;
    $.get(file, function (data) {
        var readData = data.split("\n");
        var arrays = [];
        var answers = [];
        var aBool = false;
        for (var _i = 0, readData_1 = readData; _i < readData_1.length; _i++) {
            var line = readData_1[_i];
            line = line.trim();
            if (aBool) {
                line = line.split(" ");
                for (var _a = 0, line_1 = line; _a < line_1.length; _a++) {
                    var Node = line_1[_a];
                    answers.push(new Node("n" + Graph.getInstance().number++, Node));
                }
            }
            else if (line.length == 0) {
                aBool = true;
            }
            else {
                line = line.split(" ");
                for (var _b = 0, line_2 = line; _b < line_2.length; _b++) {
                    var Node = line_2[_b];
                    arrays.push(new Node("n" + Graph.getInstance().number++, Node));
                }
            }
        }
        Graph.getInstance().nodes = arrays;
        Graph.getInstance().answers = answers;
        Graph.getInstance().ready = true;
        createGraph();
    });
}
exports.readFromFileA = readFromFileA;
function readFromFileW(file) {
    $.get(file, function (data) {
        var readData = data.split("\n");
        var array = [];
        for (var _i = 0, readData_2 = readData; _i < readData_2.length; _i++) {
            var line = readData_2[_i];
            line = line.trim();
            var i = new node_1["default"]("n" + Graph.getInstance().number++, line);
            array.push(i);
        }
        /*var array = [];
        console.log('json ' + JSON.parse(data));
        for (var ar of data.hra) {
          var items = ar.split("_");
          items.forEach(element => {
            var node = new Node("n" + Graph.getInstance().number++, element);
            array.push(node);
          });
        }*/
        var cur = array[0];
        Graph.getInstance().nodes = [cur];
        Graph.getInstance().allNodes.push(array);
        Graph.getInstance().ready = true;
        createGraph();
    });
}
exports.readFromFileW = readFromFileW;
function readFromFileL(file) {
    $.get(file, function (data) {
        var readData = data.split("\n");
        for (var _i = 0, readData_3 = readData; _i < readData_3.length; _i++) {
            var line = readData_3[_i];
            line = line.trim().split(" ");
            var array = new Array();
            for (var _a = 0, line_3 = line; _a < line_3.length; _a++) {
                var Node = line_3[_a];
                array.push(new Node("n" + Graph.getInstance().number++, Node));
            }
            Graph.getInstance().allNodes.push(array);
        }
        console.log('allNodes ' + Graph.getInstance().allNodes[0][0].name + ' ' + Graph.getInstance().allNodes[1][0].name);
        split();
        Graph.getInstance().ready = true;
        createGraph();
    });
}
exports.readFromFileL = readFromFileL;
function split(index) {
    if (index === void 0) { index = 0; }
    var ans = Graph.getInstance().allNodes[index];
    ans.forEach(function (i) { return console.log('split answ i ' + i.name); });
    Graph.getInstance().answers = ans;
    var ln = Graph.getInstance().answers.reduce(function (a, b) {
        return a.name.length > b.name.length ? a : b;
    });
    console.log('nodes ' + Graph.getInstance().nodes.length);
    console.log('ln ' + ln);
    var split = splitAndShuffle(ln.name);
    Graph.getInstance().nodes = [];
    for (var _i = 0, split_1 = split; _i < split_1.length; _i++) {
        var p = split_1[_i];
        Graph.getInstance().nodes.push(new node_1["default"]("n" + Graph.getInstance().number++, p.name));
    }
}
exports.split = split;
// --------------CREATE GRAPH---------------------------
function createGraphFromFile(type, file, nodestyle, edgeStyle, lay, editable) {
    if (editable === void 0) { editable = false; }
    Graph.getInstance().set(nodestyle, edgeStyle, lay, editable);
    readFromFile(type, file);
    return Graph.getInstance();
}
exports.createGraphFromFile = createGraphFromFile;
function createGraphReuseCy() {
    var newnodes = [];
    var x = undefined;
    var y = undefined;
    for (var _i = 0, _a = Graph.getInstance().nodes; _i < _a.length; _i++) {
        var s = _a[_i];
        if (s.x != undefined && s.y != undefined) {
            newnodes.push({
                data: {
                    id: s.id,
                    name: s.name,
                    type: "type1"
                },
                renderedPosition: {
                    x: s.x,
                    y: s.y
                }
            });
        }
        else {
            newnodes.push({
                data: {
                    id: s.id,
                    name: s.name,
                    type: "type1"
                }
            });
        }
        Graph.getInstance().setCyElement(Graph.getInstance().nodesStyle, Graph.getInstance().edgeStyle);
        Graph.getInstance().currNode = Graph.getInstance().firstElement = Graph.getInstance().nodes[0];
        Graph.getInstance().cyElement.elements().remove();
        Graph.getInstance().cyElement.add(newnodes);
        //Graph.getInstance().setOnDrag();
        if (Graph.getInstance().editable) {
            Graph.getInstance().createMenu();
        }
        Graph.getInstance().rerun();
        Graph.getInstance().ready = true;
        return Graph.getInstance();
    }
}
function setOnButtonClick(div, args) {
    var thiss = Graph.getInstance();
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
}
exports.setOnButtonClick = setOnButtonClick;
/**
 * Splits the array to characters and shuffles them
 * Used for games with letters
 * @param array
 */
function splitAndShuffle(array) {
    var newA = [];
    var split = array.split("");
    var currentIndex = split.length, temporaryValue, randomIndex;
    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = split[currentIndex];
        split[currentIndex] = split[randomIndex];
        split[randomIndex] = temporaryValue;
    }
    for (var _i = 0, split_2 = split; _i < split_2.length; _i++) {
        var s = split_2[_i];
        newA.push(new node_1["default"]("n" + Graph.getInstance().number++, s));
    }
    return newA;
}
/***
 * On drag event
 */
function dragged(id, x, y) {
    Graph.getInstance()
        .cyElement.$("#" + id)
        .renderedPosition({
        x: x,
        y: y
    });
}
exports.dragged = dragged;
function createGraph() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    Graph.getInstance().setSocket();
                    return [4 /*yield*/, checkIfExists()];
                case 1:
                    _a.sent();
                    Graph.getInstance().createGraphCy();
                    return [2 /*return*/];
            }
        });
    });
}
function recreateGraph() {
    Graph.getInstance().ready = false;
    var newnodes = [];
    for (var _i = 0, _a = Graph.getInstance().nodes; _i < _a.length; _i++) {
        var s = _a[_i];
        newnodes.push({
            data: {
                id: s.id,
                name: s.name,
                type: "type1"
            }
        });
    }
    Graph.getInstance().cyElement.add(newnodes);
    //Graph.getInstance().setOnDrag();
    if (Graph.getInstance().editable) {
        Graph.getInstance().createMenu();
    }
    Graph.getInstance().rerun();
    Graph.getInstance().ready = true;
    return Graph.getInstance();
}
exports.recreateGraph = recreateGraph;
function setAllWords(allWords) {
    Graph.getInstance().allNodes = allWords;
}
exports.setAllWords = setAllWords;
function setColorClickedNodes(color) {
    Graph.getInstance().setNodesColor(Graph.getInstance().clickedNodes, color);
}
exports.setColorClickedNodes = setColorClickedNodes;
function unselectify(value) {
    Graph.getInstance().getCyElement().autounselectify(value);
}
exports.unselectify = unselectify;
function ungrabify(value) {
    Graph.getInstance().getCyElement().autoungrabify(value);
}
exports.ungrabify = ungrabify;
function unsetClickedNodes() {
    Graph.getInstance().unsetClickedNodes();
}
exports.unsetClickedNodes = unsetClickedNodes;
function getClickedNodesName() {
    return Graph.getInstance().clickedNodes.map(function (e) { return e.name; });
}
exports.getClickedNodesName = getClickedNodesName;
function getClickedNodes() {
    return Graph.getInstance().clickedNodes;
}
exports.getClickedNodes = getClickedNodes;
function send(evt, JSON) {
    Graph.getInstance().send(evt, JSON);
}
exports.send = send;
function clearGraph() {
    Graph.getInstance().clearGraph();
}
exports.clearGraph = clearGraph;
function getNodes() {
    return Graph.getInstance().nodes;
}
exports.getNodes = getNodes;
function getAnswers() {
    return Graph.getInstance().answers;
}
exports.getAnswers = getAnswers;
function onNodeClick(color) {
    Graph.getInstance().onNodeClick(color);
}
exports.onNodeClick = onNodeClick;
function onNodeClick_Connect(color) {
    Graph.getInstance().onNodeClick_Connect(color);
}
exports.onNodeClick_Connect = onNodeClick_Connect;
function lockNodes() {
    Graph.getInstance().lockNodes();
}
exports.lockNodes = lockNodes;
function setUnclickableNodes(elements) {
    Graph.getInstance().setUnclickableNodes(elements);
}
exports.setUnclickableNodes = setUnclickableNodes;
function unsetCurrentClickedNodes() {
    Graph.getInstance().unsetCurrentClickedNodes();
}
exports.unsetCurrentClickedNodes = unsetCurrentClickedNodes;
function clearClickedNodes() {
    Graph.getInstance().clickedNodes = [];
}
exports.clearClickedNodes = clearClickedNodes;
function getGraph() {
    return Graph.getInstance().cyElement;
}
exports.getGraph = getGraph;
function setAllNodesUneditable() {
    Graph.getInstance().setallNodesUneditable();
}
exports.setAllNodesUneditable = setAllNodesUneditable;
function getAllNodes() {
    return Graph.getInstance().getAllNodes();
}
exports.getAllNodes = getAllNodes;
function setNodes(nodes) {
    Graph.getInstance().nodes = nodes;
}
exports.setNodes = setNodes;
function getGraphJSON() {
    return Graph.getInstance().getGraphJSON();
}
exports.getGraphJSON = getGraphJSON;
function recreateGraphJSON(graph) {
    Graph.getInstance().recreateJSON(graph);
}
exports.recreateGraphJSON = recreateGraphJSON;
function addEdge(Node1, Node2) {
    Graph.getInstance().addEdge(Node1, Node2);
}
exports.addEdge = addEdge;
function removeEdge(Node1, Node2) {
    Graph.getInstance().removeEdge(Node1, Node2);
}
exports.removeEdge = removeEdge;
function getFirstNodeName() {
    return Graph.getInstance().firstElement.name;
}
exports.getFirstNodeName = getFirstNodeName;
function getPreviousNodeName() {
    return Graph.getInstance().prevNode.name;
}
exports.getPreviousNodeName = getPreviousNodeName;
function getCurrNodeName() {
    return Graph.getInstance().currNode.name;
}
exports.getCurrNodeName = getCurrNodeName;
function addNode(id, str, editable) {
    if (editable === void 0) { editable = false; }
    Graph.getInstance().addNode(id, str, editable);
}
exports.addNode = addNode;
function removeNode(str) {
    Graph.getInstance().removeNode(str);
}
exports.removeNode = removeNode;
function editNode(id, name) {
    Graph.getInstance().editNode(id, name);
}
exports.editNode = editNode;
