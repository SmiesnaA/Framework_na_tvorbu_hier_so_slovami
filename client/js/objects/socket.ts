import * as io from "socket.io-client";
import * as graph from "./graph";
import { GAME } from "./game";

/**
 *
 * Connected socket - user
 * @export
 * @class Socket
 */
export default class Socket {
  socket: io;
  count: number = undefined;

  /**
   *Creates an instance of Socket.
   * @memberof Socket
   */
  constructor() {
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
  async wait() {
    var thiss = this;
    return new Promise((resolve) => {
      var checkExist = setInterval(function () {
        if (thiss.count != undefined) {
          clearInterval(checkExist);
          resolve("done!");
        }
      }, 200);
    });
  }

  /**
   *
   * Sends message to the server
   * @param {string} event
   * @param {string} data
   * @memberof Socket
   */
  send(event: string, data: string) {
    this.socket.emit(event, data);
  }

  /**
   *
   *
   * @returns number of connected sockets
   * @memberof Socket
   */
  getCount() {
    return this.count;
  }

  /**
   *
   * Initial settings
   * Catching messages from the server
   * @memberof Socket
   */
  set() {
    var thiss = this;
    this.socket.on("broadcast", function (data) {
      thiss.count = data;
    });

    this.socket.on("getGraph", function () { 
      thiss.send("graph", graph.getGraphJSON());
    });

    this.socket.on("newGraph", function (data) {
     
      graph.recreateGraphJSON(data);
    });

    this.socket.on("disconnected", function (data) {
      thiss.count = data;
      
    });

    this.socket.on("gameDone", function (data) {
      GAME.done = true;
      
    });


    this.socket.on("clickedNodeAddEdge", function (data) {
      graph.clickedAddEdge(data);
    });


    this.socket.on("correctClickedNodes", function (data) {
      GAME.correctClickedNodes(data);
    });

    this.socket.on("clickedNode", function (data) {
      graph.onNodeClick(data);
    });

    this.socket.on("tappedDisconnect", function (data) {
      graph.removeEdge(data[0], data[1]);
    });

    this.socket.on("position", function (data) {
      graph.dragged(data[0], data[1], data[2]);
    });

    this.socket.on("correct", function (data) {
      GAME.setCorrect(data);
    });

    this.socket.on("incorrect", function () {
      GAME.setIncorrect();
    });

    this.socket.on("addNode", function (data) {
    
      graph.addNodeG(data[0], data[1], data[2]);
    });

    this.socket.on("addChildNode", function (data) {
      graph.addChildNodeG(data[0], data[1], data[2]);
    });

    this.socket.on("editNode", function (data) {
  
      graph.editNode(data[0], data[1]);
    });

    this.socket.on("removeNode", function (data) {
      graph.removeNodeG(data);
    });

    this.socket.on("addEdge", function (data) {
      graph.addEdgeG(data[0], data[1]);
    });

    this.socket.on("addEdgeToPrevNode", function () {
      graph.addEdgeG(
        graph.getPreviousNodeName(),
        graph.getCurrNodeName()
      );
    });

    this.socket.on("addEdgeToFirstNode", function () {
      graph.addEdgeG(
        graph.getFirstNodeName(),
        graph.getCurrNodeName()
      );
    });

    this.socket.on("newGame", function () {
 
      GAME.newThisGame();
    });

    this.socket.on("rndGame", function () {
      GAME.randomThisGame();
    });
  }
}
