import {getPositionOfNode, getGraph} from './graph';


/**
 *
 * Vertex in the graph
 * @export
 * @class Node
 */
export default class Node {

  id: string;
  editable: boolean;
  locked: boolean = false;
  name: string;
  x: number;
  y: number;
  clicked: boolean = false;
  clickable: boolean = true;
  previousNode: Node;
  nextNodes: Node[] = [];
  color: string = "none";

  /**
   *Creates an instance of Node.
   * @param {string} ID id of Node
   * @param {string} NAME name of Node
   * @param {number} [x=undefined] position x of Node
   * @param {number} [y=undefined] position y of Node
   * @param {boolean} [edit=false] editable or noneditable
   * @memberof Node
   */
  constructor(
    id: string,
    name: string,
    x: number = undefined,
    y: number = undefined,
    edit: boolean = false
  ) {
    this.id = id;
    this.name = name;
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
  isClickable() {
    return this.clickable;
  }

  /**
   *
   *
   * @returns  whether Node was clicked
   * @memberof Node
   */
  isClicked() {
    return this.clicked;
  }

  /**
   *
   * whether Node is editable
   * @returns
   * @memberof Node
   */
  isEditable() {
    return this.editable;
  }

  /**
   *
   * Sets positition x,y of Node in graph
   * @param {number} X
   * @param {number} Y
   * @memberof Node
   */
  setPosition(X: number, Y: number) {
    this.x = X;
    this.y = Y;
  }

  /**
   *
   * Sets previous vertex of this vertex
   * @param {Node} prev
   * @memberof Node
   */
  setPrevious(prev: Node) {
    this.previousNode = prev;
  }

  /**
   *
   * Gets previous vertex of this vertex
   * @returns
   * @memberof Node
   */
  getPrevious() {
    return this.previousNode;
  }

  /**
   *
   * Adds next vertext to this vertex
   * @param {Node} next
   * @memberof Node
   */
  addNext(next: Node) {
    this.nextNodes.push(next);
  }

  /**
   *
   * Removes specific next vertex of this vertex
   * @param {Node} next
   * @memberof Node
   */
  removeNext(next: Node) {
    this.nextNodes = this.nextNodes.filter((i) => i.id != next.id);
  }

  /**
   *
   * Gets next vertices of this vertex
   * @returns
   * @memberof Node
   */
  getNext() {
    return this.nextNodes;
  }

  getPosition() {
    if(getGraph() != undefined) {
      return [getPositionOfNode(this.id)[0], getPositionOfNode(this.id)[1]]
    }
    return [undefined, undefined]
  }

  getNextIds() {
    var ar = [];
    this.getNext().forEach(el => ar.push(el.id));
    return ar;
  }

  getPreviousNodeId() {
    return this.previousNode != undefined ? this.previousNode.id : undefined;  
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      x: this.getPosition()[0],
      y: this.getPosition()[1],
      color: this.color,
      nextNodes: this.getNextIds(),
      previousNode: this.getPreviousNodeId()
    };
  }

}

