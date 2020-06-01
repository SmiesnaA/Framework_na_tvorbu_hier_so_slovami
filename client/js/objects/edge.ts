import Node from "./node";

/**
 *
 * Creates edge between vertices (Items)
 * @export
 * @class Edge
 */
export default class Edge {
  source: Node;
  target: Node;

  /**
   *Creates an instance of Edge.
   * @param {Item} s source item
   * @param {Item} t target element
   * @memberof Edge
   */
  constructor(public s: Node, public t: Node) {
    this.source = s;
    this.target = t;
  }

  getSource() {
    return this.source;
  }

  getTarget() {
    return this.target;
  }

  toJSON() {
    return {
      source: this.source.id,
      target: this.target.id,
    };
  }
}
