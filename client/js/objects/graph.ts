import * as $ from 'jquery'
import * as cytoscape from "cytoscape";
import * as base64ToBlob from "base64toblob";
import { saveAs } from "file-saver";
import Edge from "../objects/edge";
import Node from "../objects//node";
import * as cxtmenu from "cytoscape-cxtmenu";
import * as popper from "cytoscape-popper";
import { GAME } from "./game";
import { Dialog } from "./dialog";
import Socket from "./socket";
import FileData from "./fileData";
import * as edgehandles from '../objects/edgehandles.js';
cytoscape.use( edgehandles );
cytoscape.use(cxtmenu);
cytoscape.use(popper);

/**
 *
 * Creates graphs
 * @export
 * @class Graph
 */
class Graph {
  /**
   *
   * Singleton class
   * @private
   * @static
   * @type {Graph}
   * @memberof Graph
   */
  private static instance: Graph = new Graph();
  public socket: Socket;
  public sendClick: boolean = true;
  public sendEles: boolean = true;

  /**
   *
   * Increasing number for ids
   * @type {number}
   * @memberof Graph
   */
  public number: number = 0;

  /**
   *
   * Object of the cytoscape.js library
   * @type {cytoscape}
   * @memberof Graph
   */
  public cyElement: cytoscape;

  /**
   *
   * Style used for nodes in graph
   * [node color, font color, shape, width, height, font size]
   * @type {string[]}
   * @memberof Graph
   */
  public nodesStyle: Array<string> = new Array(6);
  /**
   *
   * Style used for edges in graph
   * [color, width];
   * @type {string[]}
   * @memberof Graph
   */
  public edgeStyle: Array<string> = new Array(3);

  /**
   *
   * Layout of the graph
   * circle, preset, random, grid
   * @type {string}
   * @memberof Graph
   */
  public layout: string = "";

  /**
   *
   * Editability of the graph nodes
   * nodes can be edited and deleted
   * @type {boolean}
   * @memberof Graph
   */
  public editable: boolean = false;

  /**
   *
   * All nodes in the graph
   * @type {Node[]}
   * @memberof Graph
   */
  public nodes: Node[] = [];

  /**
   *
   * nodes read from the file
   * @type {Node[][]}
   * @memberof Graph
   */
  public allNodes: Node[][] = [];

  /**
   *
   * Edges that connect nodes
   * @private
   * @type {Edge[]}
   * @memberof Graph
   */
  public edges: Edge[] = [];

  /**
   *
   *
   * @type {Node}
   * @memberof Graph
   */
  public prevNode: Node = undefined;
  public currNode: Node = undefined;
  public firstNode: Node = undefined;
  public currClicked: Node = undefined;
  public clickedNodes: Node[] = [];
  public draggedOverNodes: Node[] = [];
  public clickedEdges: Edge[] = [];
  public color: string;
  public colorClicked: string;
  public colorHover: string;
  private forbidEdge: boolean = false;

  /**
   *
   * Answers to words read from the file
   * @type {Node[]}
   * @memberof Graph
   */
  public fileData: FileData[] = [];

  /**
   *
   * File was read and graph was made
   * Graph is ready to use or not
   * @type {boolean}
   * @memberof Graph
   */
  public ready: boolean = false;

  private constructor() {}

  getEdgeStyle() {
    return this.edgeStyle[2];
  }

  /**
   *
   * Gets instance of singleton class Graph
   * @static
   * @returns {Graph}
   * @memberof Graph
   */
  public static getInstance(): Graph {
    if (!Graph.instance) {
      Graph.instance = new Graph();
    }

    return Graph.instance;
  }

  /**
   *
   * Sets styles, layout and editability of graph
   * @param {string[]} nodestyle
   * @param {string[]} edgeStyle
   * @param {string} lay
   * @param {boolean} editable
   * @memberof Graph
   */
  set(
    nodestyle: string[],
    edgeStyle: string[],
    lay: string,
    editable: boolean
  ) {
    for (let i = 0; i < this.nodesStyle.length; i++) {
      this.nodesStyle[i] = nodestyle[i];
    }
    for (let i = 0; i < this.edgeStyle.length; i++) {
      this.edgeStyle[i] = edgeStyle[i];
    }
    this.layout = lay;
    this.editable = editable;
  }

  /**
   *
   * Gets graph in JSON string
   * @returns
   * @memberof Graph
   */
  getGraphJSON() {
    return JSON.stringify({
      nodes: JSON.stringify(this.nodes),
      edges: JSON.stringify(this.edges),
      fileData: this.getFileDataStringify(),
      nodestyle: this.nodesStyle,
      edgeStyle: this.edgeStyle,
      layout: this.layout,
      editable: this.editable,
      uneditableNodes: this.getUneditableNodes(),
      currNode: this.getCurrNodeString(),
      firstNode: this.getFirstNodeString(),
      prevNode: this.getPrevNodeString(),
      correctAnswers: GAME.correctAnswers,
      level: GAME.getLevel(),
      sendClick: this.sendClick,
      sendEles: this.sendEles,
      colorClicked: this.colorClicked,
      number: this.number
    });
  }

  /**
   *
   * Recreates graph from JSON string
   * @param {string} graph
   * @memberof Graph
   */
  async recreateJSON(graph: string) {
    var g = JSON.parse(graph);
    var nodes = JSON.parse(g.nodes);
    var nodePositions = g.nodePositions;
    var edges = JSON.parse(g.edges);
    this.colorClicked = g.colorClicked;
    this.sendClick = g.sendClick;
    this.sendEles = g.sendEles;
    this.fileData = this.getFileDataFromJSON(g.fileData);
    this.layout = g.layout;
    this.editable = g.editable;
    this.nodesStyle = g.nodestyle;
    this.edgeStyle = g.edgeStyle;
    this.nodes = [];
    this.number = g.number;
    var uneditable = g.uneditableNodes;
    this.firstNode =
      g.firstNode == undefined
        ? undefined
        : new Node(g.firstNode[0], g.firstNode[1]);
    this.prevNode =
      g.prevNode == undefined
        ? undefined
        : new Node(g.prevNode[0], g.prevNode[1]);
    this.currNode =
      g.currNode == undefined
        ? undefined
        : new Node(g.currNode[0], g.currNode[1]);
 
    GAME.correctAnswers = g.correctAnswers;
    GAME.level = g.level;
  

    for (var nod of nodes) {
      var n = nod;
      var node = new Node(n.id, n.name, n.x, n.y);
      node.setPrevious(n.previousNode);
      node.color = n.color;
      var contains = uneditable.some((i) => i == node.id);
      node.editable = !contains;
      this.nodes.push(node);
    }
    for(var nod of nodes) {
      for(var nodeId of nod.nextNodes) {
        var next = this.nodes.filter(el => el.id == nodeId);
        if(next.length != 0) {
         this.getNodeById(nod.id).addNext(next[0]);
        }
      }
    }
    
  
    if (this.sendEles) {
      for (var e of edges) {
  
        this.edges.push(
          new Edge(this.getNodeById(e.source), this.getNodeById(e.target))
        );
     
      }
    }
    createGraphReuseCy();
    this.setSocket();
  }

  getFileDataFromJSON(json: string) {
    var ix = 0;
    var allFd = [];
    var fileData = JSON.parse(json);
    for (var f of fileData) {
      var vonkAr = new Array();
      for (var ar of f[0].input) {
        var vnutAr = new Array();
        for (var node of ar) {
          var n = new Node(node.id, node.name);
          vnutAr.push(n);
        }
        vonkAr.push(vnutAr);
      }
      allFd.push(new FileData(ix++, vonkAr, f[0].answers));
    }
    return allFd;
  }

  /**
   *
   * Gets all nodes in graph
   * @returns
   * @memberof Graph
   */
  getnodes() {
    return this.nodes;
  }

  /**
   *
   * Gets all nodes read from the file
   * Ready to use for new or random game
   * @returns
   * @memberof Graph
   */
  getAllNodes() {
    return this.allNodes;
  }

  /**
   *
   * Gets first element added to graph
   * @returns
   * @memberof Graph
   */
  getFirstNodeString() {
    if (this.firstNode != undefined) {
      return [this.firstNode.id, this.firstNode.name];
    }
    return undefined;
  }

  /**
   *
   * Gets current element 
   * @returns
   * @memberof Graph
   */
  getCurrNodeString() {
    if (this.currNode != undefined) {
      return [this.currNode.id, this.currNode.name];
    }
    return undefined;
  }

  /**
   *
   * Gets element that was previously added to graph
   * @returns
   * @memberof Graph
   */
  getPrevNodeString() {
    if (this.prevNode != undefined) {
      return [this.prevNode.id, this.prevNode.name];
    }
    return undefined;
  }

  /**
   *
   * Gets nodes that can not be deleted and edited
   * @returns
   * @memberof Graph
   */
  getUneditableNodes() {
    var ar = [];
    this.nodes.forEach((i) => {
      if (!i.editable) {
        ar.push(i.id);
      }
    });
    return ar;
  }

  getFileDataStringify() {
    var json = [];
    this.fileData.forEach((fileData) => json.push(fileData.toJSON()));
 
    return JSON.stringify(json);
  }

  /**
   * Sets current connected socket
   *
   * @memberof Graph
   */
  setSocket() {
    this.socket = GAME.getPlayer().getSocket();
  }

  /**
   *
   * Gets graph object of cytoscape.js library
   * @returns
   * @memberof Graph
   */
  getCyElement() {
    return this.cyElement;
  }

  /**
   *
   * Gets answers read from the graph deliminated by empty line
   * @returns
   * @memberof Graph
   */
  getAnswers(ix: number) {
    return this.fileData[ix - 1].getAnswers();
  }

  getFileData() {
    return this.fileData;
  }

  /**
   * Changes color of the node
   *
   * @param {string} id
   * @param {string} color
   * @memberof Graph
   */
  changeNodeColor(id: string, color: string) {
    this.getNodeById(id).color = color;
    this.getElement(id).style({ "background-color": color });
  }

  /**
   * Not used function
   * Sends the positions to clients through the server
   */
  setOnDrag() {
    this.cyElement.on("drag", "node", function (evt) {
      Graph.getInstance().send(
        "position",
        '{"id" : "' +
          this.data("id") +
          '", "x" : "' +
          this.renderedPosition().x +
          '", "y" : "' +
          this.renderedPosition().y +
          '", "name" : "' +
          this.data("name") +
          '"}'
      );
    });
  }

  /**
   *
   * Set on node click event
   * Node changes color
   * @param {string} color
   * @memberof Graph
   */
  async onNodeClick(color: string) {
    let promise = checkIfExists();
    await promise;
    this.colorClicked = color;
    this.cyElement.on("tap", "node", function (evt) {
      if (!GAME.done) {
        if (this.socket == null) {
          this.clicked([this.data("id"), this.data("name")]);
        } else if (this.sendClick) {
          this.send(
            "clickedNode",
            '{"id" : "' +
              this.data("id") +
              '", "x" : "' +
              this.position("x") +
              '", "y" : "' +
              this.position("x") +
              '", "name" : "' +
              this.data("name") +
              '"}'
          );
        }
      }
    });
  }

  /**
   *
   * Set on node click event
   * Node changes color
   * @param {string} color
   * @memberof Graph
   */
  async onNodeOv(color: string) {
    let promise = checkIfExists();
    await promise;
    this.colorClicked = color;
    this.cyElement.on("tap", "node", function (evt) {
      if (!GAME.done) {
        if (this.socket == null) {
          this.clicked([this.data("id"), this.data("name")]);
        } else if (this.sendClick) {
          this.send(
            "clickedNode",
            '{"id" : "' +
              this.data("id") +
              '", "x" : "' +
              this.position("x") +
              '", "y" : "' +
              this.position("x") +
              '", "name" : "' +
              this.data("name") +
              '"}'
          );
        }
      }
    });
  }

  clicked(data: string[]) {
    var id = data[0];
    var name = data[1];
    if (this.getnodesByName(name).length == 1) {
      id = this.getNodeByName(name).id;
    }
    var element = this.getNodeById(id);
    if (element.clickable) {
      this.currClicked = new Node(id, name);
      if (!this.wasClicked(id)) {
        this.addClickedElement(this.currClicked);
        this.changeNodeColor(id, this.colorClicked);
      } else {
        this.changeNodeColor(id, this.color);
        this.clickedNodes = this.clickedNodes.filter((i) => i.id != id);
        this.currClicked = this.clickedNodes[this.clickedNodes.length - 1];
      }
    }
  }

  clickedAddEdge(data: string[]) {
    var id = data[0];
    var name = data[1];
    if (this.getnodesByName(name).length == 1) {
      id = this.getNodeByName(name).id;
    }
    var element = this.getNodeById(id);
    if (element.clickable) {
      var prevClicked = this.currClicked;
      this.currClicked = new Node(id, name);
      if (!this.wasClicked(id)) {
        this.addClickedElement(this.currClicked);
        if (prevClicked != undefined && id != prevClicked.id) {
          this.addEdgeG(id, prevClicked.id);
        }
        this.changeNodeColor(id, this.colorClicked);
      } else {
        this.changeNodeColor(id, this.color);
        this.clickedNodes = this.clickedNodes.filter((i) => i.id != id);
        this.removeEdgeG(prevClicked.id, id);
        this.currClicked = this.clickedNodes[this.clickedNodes.length - 1];
      }
    }
  }

  async draggedAddEdge() {
    await checkIfExists();
    var edgeStyle = Graph.getInstance().getEdgeStyle();
    Graph.getInstance().colorHover = this.colorClicked;
    Graph.getInstance().cyElement.edgehandles({
      toggleOffOnLeave: true,
      handleNodes: "node",
      handleSize: 10,
      edgeStyle: edgeStyle,
      nodeHoverColor: this.colorClicked
    });
 
    Graph.getInstance().cyElement.edgehandles('drawon');
    Graph.getInstance().cyElement.on( 'cyedgehandles.complete', function ( evt, nodes ) {
      var parsedNodes = JSON.parse(nodes);
      parsedNodes.forEach(id => { 
        var n = Graph.getInstance().getNodeById(id);
        Graph.getInstance().draggedOverNodes.push(n);
        Graph.getInstance().changeNodeColor(n.id, this.colorClicked);
      });
        
      var source;
      var target;
      for(var i = 0; i < Graph.getInstance().draggedOverNodes.length; i++) {
        target = Graph.getInstance().draggedOverNodes[i];
        if(source != undefined && target != undefined) {
          Graph.getInstance().edges.push(new Edge(source, target));
        }
        source = target;
      } 
    });
  }

  /**
   * Sets on node click event
   * Node changes color and addEdge with previous Node after click
   * @param color
   */
  async onNodeClick_addEdge(color: string) {
    let promise = checkIfExists();
    await promise;
    this.colorClicked = color;
    this.cyElement.on("tap", "node", function (evt) {
      if (!GAME.done && GAME.checkOnNodeAddEdge(this.data('id'))) {
        if (
          Graph.getInstance().socket == null ||
          !Graph.getInstance().sendClick
        ) {
          Graph.getInstance().clickedAddEdge([
            this.data("id"),
            this.data("name"),
          ]);
        } else {
  
          Graph.getInstance().send(
            "clickedNodeAddEdge",
            '{"id" : "' +
              this.data("id") +
              '", "x" : "' +
              this.position("x") +
              '", "y" : "' +
              this.position("x") +
              '", "name" : "' +
              this.data("name") +
              '"}'
          );
        }
      }
    });
  }

  async onNodeOver_addEdge(color: string) {
    this.colorClicked = color;
    
      if (!GAME.done) {
          Graph.getInstance().draggedAddEdge();
      }
  }

  /**
   * Sends event to serverno
   * @param evt
   * @param JSON
   */
  send(evt: string, JSON: string) {
    if (this.socket != null) {
      this.socket.send(evt, JSON);
    }
  }
  /**
   *
   * Unsets nodes that user clicked
   * Remove edge to all connected nodes
   * @memberof Graph
   */
  unsetClickedNodes() {
  
    for (var el of this.clickedNodes) {
      this.changeNodeColor(el.id, this.color);
      for (var edge of this.edges) {
        if (edge != undefined) {
          if (edge.source.id == el.id) {
            this.removeEdgeG(edge.source.id, edge.target.id);
          } else if (edge.target.id == el.id) {
            this.removeEdgeG(edge.target.id, edge.source.id);
          }
        }
      }
    }
    this.unsetCurrentClickedNodes();
    this.clickedNodes = [];
  }

  /**
   *
   * Unsets dragged over nodes 
   * Remove edge to all connected nodes
   * @memberof Graph
   */
  unsetDraggedOverNodes() {
    
    for (var el of this.draggedOverNodes) {
      this.getElement(el.id).style({ "background-color": this.color });
      for (var edge of this.edges) {
        if (edge != undefined) {
          if (edge.source.id == el.id) {
            this.removeEdgeG(edge.source.id, edge.target.id);
          } else if (edge.target.id == el.id) {
            this.removeEdgeG(edge.target.id, edge.source.id);
          }
        }
      }
    }
    this.unsetCurrentClickedNodes();
    this.draggedOverNodes = [];
  }


  /**
   *
   * Sets color of nodes
   * @param {Node[]} nodes
   * @param {string} color
   * @memberof Graph
   */
  setNodesColor(nodes: Node[], color: string) {
    for (var node of nodes) {
    
      this.changeNodeColor(node.id, color);
    }
  }
  /**
   * Forbids the user to click on nodes
   * @param nodes
   */
  setUnclickableNodes(nodes: Node[]) {
    for (var node of nodes) {
      var n = this.getNodeById(node.id);
      n.clickable = false;
    }
  }
  /**
   * Removes all clicked nodes from array
   *
   * @memberof Graph
   */
  unsetCurrentClickedNodes() {
    this.currClicked = undefined;
  }
  /**
   * Removes all nodes from array
   *
   * @memberof Graph
   */
  deleteClickednodes() {
    this.nodes = [];
  }
  /**
   * Checks if the Node was clicked
   * Is/Is not in array of clicked elements
   * @param id
   */
  wasClicked(id: string) {
    var ar = this.clickedNodes.filter((i) => i.id == id);
    return ar.length == 1 ? true : false;
  }
  /**
   * Checks if the Node is in graph
   * @param name
   */
  isNodeInGraph(name: string) {
    return this.nodes.some((Node) => Node.name === name);
  }
  /**
   * Sends event add element to server
   * @param str name of the node
   * @param editable can or can not be edited and deleted
   */
  addNode(str: string, editable: boolean = false) {
    if (this.socket != null) {
      this.send(
        "addNode",
        '{"name" : "' +
          str +
          '", "editable" : "' +
          editable +
          '"}'
      );
    } else {
      this.addNodeG(str, editable);
    }
  }
  /**
   * Sends event remove element to server
   * @param str
   */
  removeNode(id: string) {
    if (this.socket != null) {
      this.send("removeNode", '{"id" : "' + id + '"}');
    } else {
      this.removeNodeG(id);
    }
  }
  /**
   * Gets random position x, y in the graph area
   */
  randomPosition() {
    var wh = this.getWHNode(); 
    var x = Math.floor(Math.random() * this.cyElement.width());
    var y = Math.floor(Math.random() * this.cyElement.height());
    if(x < 0) {
      x += wh[0];
    }
    if(x + wh[0] > this.cyElement.width()) {
      x -= wh[0];
    }
    if(y < 0) {
      y += wh[1];
    }
    if(y + wh[1] > this.cyElement.height()) {
      y -= wh[1];
    }
    return [x, y];
  }
  /**
   * Adds node to graph
   * @param id
   * @param str
   * @param editable
   */
  addNodeG(str: string, editable: boolean = false) {
    var id = this.number++;
    var p = this.randomPosition();
    if (!this.isNodeInGraph(str)) {
      this.forbidEdge = false;
      var i = new Node("n" + id, str, p[0], p[1], editable);
      this.nodes.push(i);
      this.cyElement.add({
        data: {
          id: i.id,
          name: i.name,
          type: "type1",
        },
        renderedPosition: {
          x: p[0],
          y: p[1],
        },
      });
     
      this.prevNode = this.currNode;
      this.currNode = i;
   
      if (i.name == "") {
        this.addOnNodeDiv(this.getElement(i.id));
      }
    } else {
      this.number--;
      this.forbidEdge = true;
      Dialog.callDialog(
        "Graf obsahuje vrchol s rovnakým menom - zmeň názov alebo pridaj názov prázdnemu vrcholu"
      );
    }
  }
  /**
   * Adds child node to given node
   * @param str1
   * @param str2
   * @param editable
   */
  addChildNodeG(str1: string, str2: string, editable: boolean = false) {
    var p = this.randomPosition();

    if (!this.isNodeInGraph(str2)) {
      this.forbidEdge = false;
      var i = new Node("n" + this.number++, str2, p[0], p[1], editable);
      var old = this.getNodeById(str1);
      this.nodes.push(i);
      this.cyElement.add({
        data: {
          id: i.id,
          name: i.name,
          type: "type1",
        },
        renderedPosition: {
          x: p[0],
          y: p[1],
        },
      });
      
      this.addEdge(old.id, i.id);
      if (i.name == "") {
        this.addOnNodeDiv(this.getElement(i.id));
      }
    } else {
      this.forbidEdge = true;
      Dialog.callDialog(
        "Graf obsahuje vrchol s rovnakým menom - zmeň názov alebo pridaj názov prázdnemu vrcholu"
      );
    }
  }

  addChildNode(str1: string, str2: string, editable: boolean = false) {
    if (this.socket != null) {
      this.send(
        "addChildNode",
        '{"name1": "' +
          str1 +
          '", "name2" : "' +
          str2 +
          '", "editable" : "' +
          editable +
          '"}'
      );
    } else {
      this.addChildNodeG(str1, str2, editable);
    }
  }
  /**
   * Adds nodes to graph
   * @param strings
   * @param editable
   */
  addNodesG(strings: string[], editable: boolean = false) {
    var nodes = [];
    for (var str of strings) {
      if (!this.isNodeInGraph(str)) {
        var i = new Node(
          "n" + this.number++,
          str,
          undefined,
          undefined,
          editable
        );
        this.nodes.push(i);
        nodes.push({
          data: {
            id: i.id,
            name: i.name,
            type: "type1",
          },
        });
      }
    }
    this.cyElement.add(nodes);
  }
  /**
   * Adds element to clicked elements
   * @param Node
   */
  addClickedElement(Node: Node) {
    this.clickedNodes.push(Node);
  }
  /**
   * Removes element from clicked elements
   * @param str
   */
  removeClickedElement(str: string) {
    this.clickedNodes = this.clickedNodes.filter((Node) => Node.id != str);
  }
  /**
   * Removes element from graph
   *
   * @param {string} str
   * @memberof Graph
   */
  removeNodeG(id: string) {
    var el = this.getNodeById(id);
    if (el.getNext().length == 0) {
      this.cyElement.remove(this.cyElement.$("#" + id));
      this.nodes = this.nodes.filter((Node) => Node.id != id);
      this.cyElement.remove("edge[target='" + el.id + "']");
      this.edges = this.edges.filter(
        (e) => e.target.id != el.id
      );
      if(el.getPrevious() != undefined) {
        el.getPrevious().removeNext(el);
      }
      
    } else {
  
      Dialog.callDialog("Vrchol nie je možné vymazať");
    }
    var div = document.getElementById("input-container");
    if (div != null) {
      document.body.removeChild(div);
    }
  }
  /**
   * Removes elements from graph
   * @param strings names of nodes
   */
  removeElements(strings: string[]) {
    for (var str of strings) {
      var element = this.cyElement.$("#" + str);
      this.cyElement.remove(element);
    }
  }
  /**
   * Removes edge by id from graph
   * @param id id of edge
   */
  removeEdgeById(id: string) {
    this.cyElement.remove("edge[target='" + id + "']");
  }
  /**
   * Edits name (label) of node
   * @param id
   * @param name
   */
  editNode(id: string, name: string) {
  
    var n = this.cyElement.$id(id);
    var nodeInGraph = this.getNodeById(id);
  
    nodeInGraph.name = name;
    n.data("name", name);
    var div = document.getElementById("input-container");
    if (div != null) {
      document.body.removeChild(div);
    }
  }
  /**
   *
   * Reruns the layout on graph
   * @memberof Graph
   */
  rerun() {
    let options;
    if (this.layout == "grid") {
      options = {
        name: "grid",

        fit: true, // whether to fit the viewport to the this
        padding: 30, // padding used on fit
        boundingBox: undefined, // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
        avoidOverlap: true, // prevents node overlap, may overflow boundingBox if not enough space
        avoidOverlapPadding: 10, // extra spacing around nodes when avoidOverlap: true
        nodeDimensionsIncludeLabels: false, // Excludes the label when calculating node bounding boxes for the layout algorithm
        spacingFactor: undefined, // Applies a multiplicative factor (>0) to expand or compress the overall area that the nodes take up
        condense: false, // uses all available space on false, uses minimal space on true
        rows: Math.sqrt(this.nodes.length), // force num of rows in the grid
        cols: Math.sqrt(this.nodes.length), // force num of columns in the grid
        position: function (node) {}, // returns { row, col } for element
        sort: undefined, // a sorting function to order the nodes; e.g. function(a, b){ return a.data('weight') - b.data('weight') }
        animate: false, // whether to transition the node positions
        animationDuration: 500, // duration of animation in ms if enabled
        animationEasing: undefined, // easing of animation if enabled
        animateFilter: function (node, i) {
          return true;
        }, // a function that determines whether the node should be animated.  All nodes animated by default on animate enabled.  Non-animated nodes are positioned immediately when the layout starts
        ready: undefined, // callback on layoutready
        stop: undefined, // callback on layoutstop
        transform: function (node, position) {
          return position;
        }, // transform a given node position. Useful for changing flow direction in discrete layouts
      };
      this.cyElement.layout(options).run();
    } else if (this.layout == "preset") {
      let options = {
        name: "preset",
        minZoom: 0.2,
        maxZoom: 2,
        zoom: 1,

        zoomingEnabled: true,
        userZoomingEnabled: true,
        panningEnabled: true,
        userPanningEnabled: false,
        fit: true,
        padding: 100,
        positions: undefined, // map of (node id) => (position obj); or function(node){ return somPos; }
        pan: undefined, // the pan level to set (prob want fit = false if set)
        animate: false, // whether to transition the node positions
        animationDuration: 500, // duration of animation in ms if enabled
        animationEasing: undefined, // easing of animation if enabled
        animateFilter: function (node, i) {
          return true;
        }, // a function that determines whether the node should be animated.  All nodes animated by default on animate enabled.  Non-animated nodes are positioned immediately when the layout starts
        ready: undefined, // callback on layoutready
        stop: undefined, // callback on layoutstop
        transform: function (node, position) {
          return position;
        }, // transform a given node position. Useful for changing flow direction in discrete layouts
      };
      this.cyElement.layout(options).run();
    } else {
      this.cyElement.layout({ name: this.layout }).run();
    }
  }
  /**
   *
   * Locks element in graph
   * Locked element is not movable and editable
   * @memberof Graph
   */
  async lockNode() {
    let promise = checkIfExists();
    await promise;

    var n = this.getNodeById(this.currNode.id);
    this.cyElement.$("#" + n.id).ungrabify();
    n.editable = false;
    n.locked = true;
  }
  /**
   *
   * Sets first Node in array of nodes (nodes in graph) uneditable
   * @memberof Graph
   */
  async setfirstNodeUneditable() {
    let promise = checkIfExists();
    await promise;
    var n = this.getNodeByName(this.nodes[0].name);
    n.editable = false;
  }
  /**
   * Sets all nodes in graph uneditable
   *
   * @memberof Graph
   */
  async setAllNodesUneditable() {
    let promise = checkIfExists();
    await promise;
    this.nodes.forEach((Node) => {
      this.setElementUneditable(Node);
    });
  }
  /**
   * Sets given Node uneditable
   * @param Node
   */
  async setElementUneditable(Node: Node) {
    let promise = checkIfExists();
    await promise;
    Node.editable = false;
  }
  /**
   *
   * Locks all nodes in graph
   * nodes are not movable and editable
   * @memberof Graph
   */
  async lockNodes() {
    let promise = checkIfExists();
    await promise;
    for (var node of this.nodes) {
      this.cyElement.$("#" + node.id).ungrabify();
      node.editable = false;
    }
  }
  /**
   * Gets element from graph as cytoscape.js node
   * @param str
   */
  getElement(str: string) {
    return this.cyElement.$("#" + str);
  }
  /**
   *
   * Gets id of Node give by name
   * @param {string} str
   * @returns
   * @memberof Graph
   */
  getIdFromName(str: string) {
    var ar = this.nodes.filter((i) => i.name === str);
    return ar.length > 0 ? ar[0].id : null;
  }

  /**
   * Gets Node by id from the nodes in the graph
   *
   * @param {string} str
   * @returns
   * @memberof Graph
   */
  getNodeById(str: string) {
    var ar = this.nodes.filter((i) => i.id == str);
    return ar.length > 0 ? ar[0] : null;
  }

  /**
   * Gets Node by name from the nodes in the graph
   *
   * @param {string} str
   * @returns
   * @memberof Graph
   */
  getNodeByName(str: string) {
    var ar = this.nodes.filter((i) => i.name === str);
    return ar[0];
  }

  /**
   * Gets all nodes with the same name
   *
   * @param {string} str
   * @returns
   * @memberof Graph
   */
  getnodesByName(str: string) {
    var ar = this.nodes.filter((i) => i.name === str);
    return ar;
  }

  /**
   * Checks id of given Node
   * Whether Node with such id is in graph
   * @param {string} str
   * @returns
   * @memberof Graph
   */
  checkId(str: string) {
    var ar = this.nodes.filter((i) => i.id === str);
    if (ar.length != 0) {
      return ar[0].id;
    }
    return null;
  }

  /**
   * addEdge two nodes
   *
   * @param {string} str1 name of node1
   * @param {string} str2 name of node2
   * @memberof Graph
   */
  addEdgeG(str1: string, str2: string) {
    if (this.forbidEdge == false) {
      var id1 = this.getIdFromName(str1);
      var id2 = this.getIdFromName(str2);
      if (id1 == null && id2 == null) {
        id1 = this.checkId(str1);
        id2 = this.checkId(str2);
      }
    
      var i1 = this.getNodeById(id1);
      var i2 = this.getNodeById(id2);
      if (id1 != null && id2 != null) {
     
        this.edges.push(new Edge(i1, i2));
        var e = [];
        if (this.edgeStyle[2] == "arrow") {
      
          e.push({
            group: "edges",
            data: {
              source: id1,
              target: id2,
              type: "oriented",
            },
          });
        } else {
          e.push({
            group: "edges",
            data: {
              source: id1,
              target: id2,
              type: "default",
            },
          });
        }
        i1.addNext(i2);
        i2.setPrevious(i1);
        this.cyElement.add(e);
      }
    }
  }

  /**
   *
   * Multiplayer - Sends connect event to server
   * Singleplayer - addEdge nodes
   * @param {string} str1
   * @param {string} str2
   * @memberof Graph
   */
  addEdge(str1: string, str2: string) {
    if (this.socket != null && this.sendClick) {
      this.socket.send(
        "addEdge",
        '{"name1" : "' + str1 + '", "name2" : "' + str2 + '"}'
      );
    } else {
      this.addEdgeG(str1, str2);
    }
  }
  /**
   *
   * Multiplayer - Sends connect with first element event to server
   * Singleplayer - addEdge node with the first node in the graph
   * @memberof Graph
   */
  addEdgeToFirstNode() {
    if (this.socket != null) {
      this.socket.send("addEdgeToFirstNode", "");
    } else {
      this.addEdgeG(this.firstNode.id, this.currNode.id);
    }
  }

  /**
   *
   * Multiplayer - Sends connect with previous element event to server
   * Singleplayer - addEdge node with the previously added node in the graph
   * @memberof Graph
   */
  addEdgeToPrevNode() {
    if (this.socket != null) {
      this.socket.send("addEdgeToPrevNode", "");
    } else {
    
      this.addEdgeG(this.prevNode.id, this.currNode.id);
    }
  }

  /**
   * Remove edge between two nodes
   *
   * @param {string} str1 name of node1
   * @param {string} str2 name of node2
   * @memberof Graph
   */
  removeEdgeG(str1: string, str2: string) {
    var id1 = this.checkId(str1);
    var id2 = this.checkId(str2);
    if (id1 != null && id2 != null) {
      this.cyElement.remove("edge[source='" + id1 + "']");
      this.cyElement.remove("edge[target='" + id2 + "']");
      this.edges = this.edges.filter(
        (e) => e.source.id != id1 && e.target.id != id2
      );
    }
  }

  /**
   *
   *
   * @param {string} str1
   * @param {string} str2
   * @memberof Graph
   */
  removeEdge(str1: string, str2: string) {
    if (this.socket == null && this.sendClick) {
      this.removeEdgeG(str1, str2);
    } else {
      this.send(
        "removeEdge",
        '{"str1" : "' + str1 + '", "str2" : "' + str2 + '"}'
      );
    }
  }

  getWHNode() {
    var widthPx = Graph.getInstance().nodesStyle[4];
    var heightPx = Graph.getInstance().nodesStyle[5];
    var w = parseInt(widthPx.match(/\d/g).join(""));
    var h = parseInt(heightPx.match(/\d/g).join(""));
    return [w, h];
  }

  /**
   *
   * Adds input box into node for editing node name
   * @param {cytoscape.node} node
   * @memberof Graph
   */
  addOnNodeDiv(node: cytoscape.node) {
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
        var inputElement = <HTMLInputElement>textarea;
        inputElement.value = node.data("name");
        div.classList.add("popper-div");
        div.appendChild(textarea);
        textarea.setAttribute("style", "font-size: " + Graph.getInstance().nodesStyle[2]);
        var wh = Graph.getInstance().getWHNode();
        div.setAttribute("style",  "width: " + (wh[0] * 0.7) + "px; height: " + (wh[1]  * 0.7) + "px");
        document.body.appendChild(div);
        $(document).ready(function () {
          inputElement.focus();
        });
        return div;
      };

      var popperNode = node.popper({
        content: function () {
          return makeDiv(node.data("name"));
        },
        popper: {
          placement: "center-start",
        },
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
  }

  /**
   * Checks correction after editing node name
   *
   * @param {cytoscape.node} node
   * @memberof Graph
   */
  check(node: cytoscape.node) {
    var text = $("#text").val().toString();
    if(!text || 0 === text.length) {
      Dialog.callDialog(
        "Názov vrchola musí obsahovať aspoň jeden znak"
      );
      return;
    }
    if(node.data("name") == text) {
      var div = document.getElementById("input-container");
      if (div != null) {
        document.body.removeChild(div);
      }
      return;
    }
  
    if (!this.isNodeInGraph(text) ) {
      this.forbidEdge = false;
      GAME.checkNode(text).then(function (result) {
        if (result == "OK") {
          if (Graph.getInstance().socket == null) {
            Graph.getInstance().editNode(node.id(), text);
          } else {
            Graph.getInstance().send(
              "editNode",
              '{"id" : "' + node.id() + '", "name" : "' + text + '"}'
            );
          }
        } else {
          Dialog.callDialog(result);
        }
      });
    } else {
      this.forbidEdge = true;
      Dialog.callDialog(
        "Graf obsahuje vrchol s rovnakým menom - zmeň názov alebo pridaj názov prázdnemu vrcholu"
      );
    }
  }

  /**
   *
   * Creates menu that appears after node press
   * Edit, delete, add neighbour node
   * @memberof Graph
   */
  createMenu() {
    this.cyElement.cxtmenu({
      selector: "node",
      commands: [
        {
          content: '<span class="fas fa-pencil-alt"></span>',
          select: function (ele) {
            if (Graph.getInstance().getNodeById(ele.id()).editable) {
              Graph.getInstance().addOnNodeDiv(ele);
            } else {
              Dialog.callDialog("Nie je možné upravovať vrchol");
            }
          },
        },
        {
          content: '<span class="fas fa-trash-alt"></span>',
          select: function (ele) {
            if (Graph.getInstance().getNodeById(ele.id()).editable) {
              Graph.getInstance().removeNode(ele.id());
            } else {
              Dialog.callDialog("Nie je možné vymazať vrchol");
            }
          },
        },
        {
          content: '<span class="fas fa-plus"></span>',
          select: function (ele) {
            Graph.getInstance().addChildNode(ele.id(), "", true);
          },
        },
      ],
    });
  }

  /**
   *
   * Saves graph as png
   * Calls dialog after succesful download
   * @memberof Graph
   */
  saveImage() {
    try {
      var b64key = "base64,";
      var b64 = this.cyElement
        .png()
        .substring(this.cyElement.png().indexOf(b64key) + b64key.length);
      var imgBlob = base64ToBlob(b64, "image/png");
      saveAs(imgBlob, "graph.png");
      Dialog.callDialog("Graf bol úspešne uložený");
    } catch (err) {
      Dialog.callDialog("Graf sa nepodarilo uložiť");
    }
  }
  /**
   * Clears all attributes of graph
   * @memberof Graph
   */
  clearGraph() {
    var div = document.getElementById("input-container");
    if (div != null) {
      document.body.removeChild(div);
    }
    Graph.getInstance().cyElement.elements().remove();
    Graph.getInstance().clickedNodes = [];
    Graph.getInstance().currClicked = undefined;
    Graph.getInstance().nodes = [];
  }
  /**
   * Sets cytoscape.js graph object
   * @param nodestyle
   * @param edgeStyle
   */
  setCyElement(nodestyle: Array<string>, edgeStyle: Array<string>) {
    Graph.getInstance().color = nodestyle[0];
    if (Graph.getInstance().cyElement != undefined) {
      return;
    }
    
    this.cyElement = cytoscape({
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
            color: nodestyle[1],
          },
        },
        {
          selector: 'edge[type="default"]',
          style: {
            width: edgeStyle[1],
            "line-color": edgeStyle[0],
          },
        },
        {
          selector: 'edge[type="oriented"]',
          style: {
            width: edgeStyle[1],
            "line-color": edgeStyle[0],
            "target-arrow-color": edgeStyle[0],
            "curve-style": "bezier",
            "target-arrow-shape": "triangle",
          },
        },
        // some style for the ext
      // some style for the ext
      {
          selector: '.edgehandles-hover',
          css: {
              'background-color': this.colorHover
          }
      },
      {
        selector: '.edgehandles-preview, .edgehandles-ghost-edge',
        css: {
            'line-color': edgeStyle[0],
            width: edgeStyle[1],
            'target-arrow-color':  edgeStyle[0],
            'source-arrow-color':  edgeStyle[0],
        }
      },
      {
          selector: '.edgehandles-source',
          css: {
              'border-width': 2,
              'border-color': 'black'
          }
      },
      {
          selector: '.edgehandles-target',
          css: {
              'border-width': 2,
              'border-color': 'black'
          }
      },
      ],
    });
   
  }

  createGraphCy() {
    var newnodes = [];
    var x = undefined;
    var y = undefined;
    for (var s of Graph.getInstance().nodes) {
      if (s.x != undefined && s.y != undefined) {
        newnodes.push({
          data: {
            id: s.id,
            name: s.name,
            type: "type1",
          },
          renderedPosition: {
            x: s.x,
            y: s.y,
          },
        });
      } else {
        newnodes.push({
          data: {
            id: s.id,
            name: s.name,
            type: "type1",
          },
        });
      }
    }

    Graph.getInstance().setCyElement(
      Graph.getInstance().nodesStyle,
      Graph.getInstance().edgeStyle
    );
    Graph.getInstance().layout = Graph.getInstance().layout;
    Graph.getInstance().currNode = Graph.getInstance().firstNode = Graph.getInstance().nodes[0];
    Graph.getInstance().cyElement.add(newnodes);
    //Graph.getInstance().setOnDrag();
    if (Graph.getInstance().editable) {
      Graph.getInstance().createMenu();
    }
    Graph.getInstance().rerun();
    Graph.getInstance().ready = true;
    Graph.getInstance().cyElement.userPanningEnabled(false);
    return Graph.getInstance();
  }
}

/**
 *
 * Checks if the graph was created and is ready to use
 * @export
 * @returns
 */
export async function checkIfExists() {
  return new Promise((resolve) => {
    var checkExist = setInterval(function () {
      if (Graph.getInstance().ready == true) {
        clearInterval(checkExist);
        resolve("done!");
      }
    }, 200);
  });
}

//-----------READ FROM FILE---------------------------
/**
 * Reads from file words and answers delimited by empty
 *
 * @export
 * @param {string} file
 */

export function readFromFile(file: string) {
  var ix = 0;
  $.get(file, function (data) {
    for (var level of data.hra) {
      var itemsGrid = level.vstup.split("#");
      var array = new Array();
      itemsGrid.forEach((element) => {
        var rows = new Array();
        var elements = element.split("_");
        elements.forEach((el) => {
          var node = new Node("n" + Graph.getInstance().number++, el);
          rows.push(node);
        });
        array.push(rows);
      });
      Graph.getInstance().fileData.push(
        new FileData(ix++, array, level.odpovede)
      );
    } 
    var cur = Graph.getInstance().fileData[0].getInputFlat();
    
    Graph.getInstance().nodes = cur;
    Graph.getInstance().ready = true;
    createGraph();
  });
}

// --------------CREATE GRAPH---------------------------

export function createGraphFromFile(
  file: string,
  nodestyle: string[],
  edgeStyle: string[],
  lay: string,
  editable: boolean = false
) {
  Graph.getInstance().set(nodestyle, edgeStyle, lay, editable);
  readFromFile(file);
  return Graph.getInstance();
}

async function createGraphReuseCy() {
  return new Promise((resolve) => {
    var newEles = [];
    for (var s of Graph.getInstance().nodes) {
      if (s.x != undefined && s.y != undefined) {
     
        newEles.push({
          group: "nodes",
          data: {
            id: s.id,
            name: s.name,
            type: "type1",
          },
          renderedPosition: {
            x: s.x,
            y: s.y,
          },
        });
      } else {
        newEles.push({
          group: "nodes",
          data: {
            id: s.id,
            name: s.name,
            type: "type1",
          },
        });
      }
    }
    for (var edge of Graph.getInstance().edges) {
      if (Graph.getInstance().edgeStyle[2] == "arrow") {
     
        newEles.push({
          group: "edges",
          data: {
            source: edge.source.id,
            target: edge.target.id,
            type: "oriented",
          },
        });
      } else {
        newEles.push({
          group: "edges",
          data: {
            source: edge.source.id,
            target: edge.target.id,
            type: "default",
          },
        });
      }
    }
    Graph.getInstance().setCyElement(
      Graph.getInstance().nodesStyle,
      Graph.getInstance().edgeStyle
    );
    Graph.getInstance().firstNode = Graph.getInstance().nodes[0];
    Graph.getInstance().cyElement.add(newEles);

    //Graph.getInstance().setOnDrag();
    if (Graph.getInstance().editable) {
      Graph.getInstance().createMenu();
    }
    for (var s of Graph.getInstance().nodes) {
      if (s.color != "none" || s.color != Graph.getInstance().colorClicked) {
        Graph.getInstance().changeNodeColor(s.id, s.color);
      }
    }
    if (Graph.getInstance().layout != "preset") {
      
      Graph.getInstance().rerun();
    }
    
    Graph.getInstance().cyElement.userPanningEnabled(false);
    Graph.getInstance().ready = true;
 
    Graph.getInstance().cyElement.ready(function (event) {
      resolve("done");
    });
  });
}
/**
 *
 * Sets methods executed after button click
 * @export
 * @param {string} div HTML element, button
 * @param {{}} args methods
 */
export function setOnButtonClick(div: string, args: {}) {
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

/***
 * On drag event
 */

export function dragged(id: string, x: number, y: number) {
  Graph.getInstance()
    .cyElement.$("#" + id)
    .renderedPosition({
      x: x,
      y: y,
    });
}
/**
 *
 * Creates graph in canvas
 */
async function createGraph() {
  Graph.getInstance().setSocket();
  await checkIfExists();
  Graph.getInstance().createGraphCy();
}
/**
 *
 * Recreates graph after new player connected
 * @export
 * @returns
 */
export function recreateGraph() {
  Graph.getInstance().ready = false;
  var newnodes = [];
  for (var s of Graph.getInstance().nodes) {
    newnodes.push({
      data: {
        id: s.id,
        name: s.name,
        type: "type1",
      },
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
/**
 *
 * Sets color of given nodes
 * @export
 * @param {Node[]} nodes
 * @param {string} color
 */
export function setColorNodes(nodes: Node[], color: string) {
  Graph.getInstance().setNodesColor(nodes, color);
}
/**
 * Node can not be selected
 * @param value 
 */
export function unselectify(value: boolean) {
  Graph.getInstance().getCyElement().autounselectify(value);
}
/**
 *
 * Node can not be grabified/moved
 * @export
 * @param {boolean} value
 */
export function ungrabify(value: boolean) {
  Graph.getInstance().getCyElement().autoungrabify(value);
}
/**
 *
 * Removes edges between clicked nodes
 * @export
 */
export function unsetClickedNodes() {
  Graph.getInstance().unsetClickedNodes();
}
/**
 *
 * Removes edges between dragged over nodes
 * @export
 */
export function unsetDraggedOverNodes() {
  Graph.getInstance().unsetDraggedOverNodes();
}
/**
 *
 *
 * @export
 * @returns names of clicked nodes
 */
export function getClickedNodesName() {
  return Graph.getInstance().clickedNodes.map((e) => e.name);
}

export function clickedAddEdge(data: string[]) {
  Graph.getInstance().clickedAddEdge(data);
}
/**
 *
 *
 * @export
 * @returns clicked nodes
 */
export function getClickedNodes() {
  return Graph.getInstance().clickedNodes;
}
/**
 *
 *
 * @export
 * @returns names of nodes which player dragged over
 */
export function getDraggedOverNodes() {
  return Graph.getInstance().draggedOverNodes;
}
/**
 *
 *
 * @export
 * @returns nodes which player dragged over
 */
export function getDraggedOverNodesNames() {
  return Graph.getInstance().draggedOverNodes.map((e) => e.name);
}
/**
 * Sends event with data to server
 * @param evt 
 * @param JSON 
 */
export function send(evt: string, JSON: string) {
  Graph.getInstance().send(evt, JSON);
}
/**
 *
 * Set new graph without elements
 * @export
 */
export function clearGraph() {
  Graph.getInstance().clearGraph();
}
/**
 *
 *
 * @export
 * @returns nodes in the graph
 */
export function getNodes() {
  return Graph.getInstance().nodes;
}
/**
 *
 * Gets answers read from .json file by index
 * @export
 * @param {number} ix
 * @returns
 */
export function getAnswers(ix: number) {
  return Graph.getInstance().getAnswers(ix);
}
/**
 *
 * Sets color to current clicked node
 * @export
 * @param {string} color
 */
export function onNodeClick(color: string) {
  Graph.getInstance().onNodeClick(color);
}
/**
 *
 * Adds adge to previously hovered over node to current hovered over node
 * @export
 * @param {string} color
 */
export function onNodeOver_addEdge(color: string) {
  Graph.getInstance().onNodeOver_addEdge(color);
}
/**
 *
 * Adds edge from previously clicked node to current clicked node
 * @export
 * @param {string} color
 */
export function onNodeClick_addEdge(color: string) {
  Graph.getInstance().onNodeClick_addEdge(color);
}

/**
 *
 * Lock all nodes - player can not move them
 * @export
 */
export function lockNodes() {
  Graph.getInstance().lockNodes();
}
/**
 *
 * Player can not click on given elements - no action after click
 * @export
 * @param {Node[]} elements
 */
export function setUnclickableNodes(elements: Node[]) {
  Graph.getInstance().setUnclickableNodes(elements);
}
/**
 *
 * Unsets clicked nodes and emoves edges between them
 * @export
 */
export function unsetCurrentClickedNodes() {
  Graph.getInstance().unsetCurrentClickedNodes();
}
/**
 *
 * Removes all nodes from array of clicked nodes
 * @export
 */
export function clearClickedNodes() {
  Graph.getInstance().clickedNodes = [];
}
/**
 *
 *
 * @export
 * @returns cytoscape element
 */
export function getGraph() {
  return Graph.getInstance().cyElement;
}
/**
 *
 * Sets all nodes as uneditable
 * Player can not edit or delete the node
 * @export
 */
export function setAllNodesUneditable() {
  Graph.getInstance().setAllNodesUneditable();
}

/**
 *
 * Sets nodes in the graph
 * @export
 * @param {Node[]} nodes
 */
export function setNodes(nodes: Node[]) {
  Graph.getInstance().nodes = nodes;
}
/**
 *
 * 
 * @export
 * @returns graph as specific JSON object
 */
export function getGraphJSON() {
  return Graph.getInstance().getGraphJSON();
}
/**
 *
 * Recreates graph from specific JSON object
 * @export
 * @param {string} graph
 */
export function recreateGraphJSON(graph: string) {
  Graph.getInstance().recreateJSON(graph);
}
/**
 *
 * Sends event add edge to graph
 * @export
 * @param {string} node1
 * @param {string} node2
 */
export function addEdge(node1: string, node2: string) {
  Graph.getInstance().addEdge(node1, node2);
}
/**
 *
 * Adds edge to graph
 * @export
 * @param {string} Node1
 * @param {string} Node2
 */
export function addEdgeG(Node1: string, Node2: string) {
  Graph.getInstance().addEdgeG(Node1, Node2);
}
/**
 * 
 * Sends event remove edge to server
 * @export
 * @param {string} Node1
 * @param {string} Node2
 */
export function removeEdge(Node1: string, Node2: string) {
  Graph.getInstance().removeEdge(Node1, Node2);
}
/**
 *
 * Removes edge from the graph
 * @export
 * @param {string} Node1
 * @param {string} Node2
 */
export function removeEdgeG(Node1: string, Node2: string) {
  Graph.getInstance().removeEdgeG(Node1, Node2);
}
/**
 *
 *
 * @export
 * @returns first node in the graph
 */
export function getFirstNodeName() {
  return Graph.getInstance().nodes[0].name;
}
/**
 *
 * Sets first node in the graph
 * @export
 * @param {Node} firstNode
 */
export function setFirstNode(firstNode: Node) {
  Graph.getInstance().firstNode = firstNode;
}
/**
 *
 * 
 * @export
 * @returns previous node - node added before current node
 */
export function getPreviousNodeName() {
  return Graph.getInstance().prevNode.name;
}
/**
 *
 * Sets previous node in the graph
 * @export
 * @param {Node} prevNode
 */
export function setPreviousNode(prevNode: Node) {
  Graph.getInstance().prevNode = prevNode;
}
/**
 *
 * Sets current node in the graph
 * @export
 * @param {Node} current node
 */
export function setCurrNode(currNode: Node) {
  Graph.getInstance().currNode = currNode;
}
/**
 *
 * 
 * @export
 * @returns current node - last added node
 */
export function getCurrNodeName() {
  return Graph.getInstance().currNode.name;
}
/**
 *
 * Adds node to graph
 * @export
 * @param {number} id
 * @param {string} str
 * @param {boolean} [editable=false]
 */
export function addNodeG(str: string, editable: boolean = false) {
  Graph.getInstance().addNodeG(str, editable);
}
/**
 *
 * Adds child node to given node
 * @export
 * @param {string} str1
 * @param {string} str2
 * @param {boolean} [editable=false]
 */
export function addChildNodeG(
  str1: string,
  str2: string,
  editable: boolean = false
) {
  Graph.getInstance().addChildNodeG(str1, str2, editable);
}
/**
 *
 * Sends event add node to server
 * @export
 * @param {string} str
 * @param {boolean} [editable=false]
 */
export function addNode(str: string, editable: boolean = false) {
  Graph.getInstance().addNode(str, editable);
}
/**
 *
 * Sends event remove node to server
 * @export
 * @param {string} id
 */
export function removeNode(id: string) {
  Graph.getInstance().removeNode(id);
}
/**
 *
 * Removes node from the graph
 * @export
 * @param {string} id
 */
export function removeNodeG(id: string) {
  Graph.getInstance().removeNodeG(id);
}
/**
 *
 * Edits name of the node in graph
 * @export
 * @param {string} id 
 * @param {string} name
 */
export function editNode(id: string, name: string) {
  Graph.getInstance().editNode(id, name);
}
/**
 *
 * 
 * @export
 * @param {number} ix
 * @returns read data by level (index of array - 1)
 */
export function readDataByLevel(ix: number) {
  return Graph.getInstance().getFileData()[ix - 1];
}
/**
 *
 *
 * @export
 * @returns data read from .json file
 */
export function readData() {
  return Graph.getInstance().getFileData();
}

/**
 *
 * Does not send on clicked nodes to server
 * @export
 */
export function forbidClickSend() {
  Graph.getInstance().sendClick = false;
}
/**
 *
 * Does not send elements of graph to server on recreate
 * @export
 */
export function forbidGraphElesSend() {
  Graph.getInstance().sendEles = false;
}
/**
 *
 * Gets x, y position in canvas of node with given id 
 * @export
 * @param {string} id
 * @returns
 */
export function getPositionOfNode(id: string) {
  var x = Graph.getInstance()
    .cyElement.$("#" + id)
    .renderedPosition("x");
  var y = Graph.getInstance()
    .cyElement.$("#" + id)
    .renderedPosition("y");
  return [x, y];
}

/**
 *
 * Gets node in graph by id
 * @export
 * @param {string} id
 * @returns
 */
export function getNodeById(id: string) {
  return Graph.getInstance().getNodeById(id);
}