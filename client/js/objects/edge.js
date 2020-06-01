"use strict";
exports.__esModule = true;
/**
 *
 * Creates edge between vertices (Items)
 * @export
 * @class Edge
 */
var Edge = /** @class */ (function () {
    /**
     *Creates an instance of Edge.
     * @param {Item} s source item
     * @param {Item} t target element
     * @memberof Edge
     */
    function Edge(s, t) {
        this.s = s;
        this.t = t;
        this.source = s;
        this.target = t;
    }
    Edge.prototype.getSource = function () {
        return this.source;
    };
    Edge.prototype.getTarget = function () {
        return this.target;
    };
    return Edge;
}());
exports["default"] = Edge;
