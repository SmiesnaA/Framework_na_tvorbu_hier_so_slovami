"use strict";
exports.__esModule = true;
/**
 *
 * Vertex in the graph
 * @export
 * @class Node
 */
var Node = /** @class */ (function () {
    /**
     *Creates an instance of Node.
     * @param {string} ID id of Node
     * @param {string} NAME name of Node
     * @param {number} [x=undefined] position x of Node
     * @param {number} [y=undefined] position y of Node
     * @param {boolean} [edit=false] editable or noneditable
     * @memberof Node
     */
    function Node(ID, NAME, x, y, edit) {
        if (x === void 0) { x = undefined; }
        if (y === void 0) { y = undefined; }
        if (edit === void 0) { edit = false; }
        this.locked = false;
        this.clicked = false;
        this.clickable = true;
        this.nextNodes = [];
        this.id = ID;
        this.name = NAME;
        this.x = x;
        this.y = y;
        this.editable = edit;
    }
    /**
     *
     *
     * @returns whether Node is clickable, is not locked
     * @memberof Node
     */
    Node.prototype.isClickable = function () {
        return this.clickable;
    };
    /**
     *
     *
     * @returns  whether Node was clicked
     * @memberof Node
     */
    Node.prototype.isClicked = function () {
        return this.clicked;
    };
    /**
     *
     * whether Node is editable
     * @returns
     * @memberof Node
     */
    Node.prototype.isEditable = function () {
        return this.editable;
    };
    /**
     *
     * Sets positition x,y of Node in graph
     * @param {number} X
     * @param {number} Y
     * @memberof Node
     */
    Node.prototype.setPosition = function (X, Y) {
        this.x = X;
        this.y = Y;
    };
    /**
     *
     * Sets previous vertex of this vertex
     * @param {Node} prev
     * @memberof Node
     */
    Node.prototype.setPrevious = function (prev) {
        this.previousNode = prev;
    };
    /**
     *
     * Gets previous vertex of this vertex
     * @returns
     * @memberof Node
     */
    Node.prototype.getPrevious = function () {
        return this.previousNode;
    };
    /**
     *
     * Adds next vertext to this vertex
     * @param {Node} next
     * @memberof Node
     */
    Node.prototype.addNext = function (next) {
        this.nextNodes.push(next);
    };
    /**
     *
     * Removes specific next vertex of this vertex
     * @param {Node} next
     * @memberof Node
     */
    Node.prototype.removeNext = function (next) {
        this.nextNodes = this.nextNodes.filter(function (i) { return i.id != next.id; });
    };
    /**
     *
     * Gets next vertices of this vertex
     * @returns
     * @memberof Node
     */
    Node.prototype.getNext = function () {
        return this.nextNodes;
    };
    return Node;
}());
exports["default"] = Node;
