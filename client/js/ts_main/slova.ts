import * as graph from "../objects/graph";
import { Game } from "../objects/game";
import Player from "../objects/player";
import * as $ from "jquery";
import Draggabilly = require("draggabilly");
import Node from "../objects/node";
import { SessionStorage } from "../objects/sessionStorage";
import Socket from "../objects/socket";
import FileData from "../objects/fileData";
import { SweetAlertIcon } from "sweetalert2";

/**
 * Game "Slova" - Subclass of abstract class Game
 */
export class Slova extends Game {
  localStorage: SessionStorage;
  words: Node[];
  answers: string[];
  fileData: FileData[];
  typeOfGame: string;
  player: Player;
  level: number = 1;
  correctAnswers: string[] = [];

  constructor(file: string) {
    super();
    this.createPlayer(file);
  }

  getLevel() {
    return this.level;
  }

  /**
   * DO NOT CHANGE
   * Creates new player
   * Gets name, type of game from local storage
   * Checks for number of sockets connected
   * Creates graph
   * @param {string} file
   * @memberof Game
   */
  async createPlayer(file: string) {
    var thiss = this;
    var name = SessionStorage.getInstance().get("NAME");
    var typeOfGame = SessionStorage.getInstance().get("GAME");
    var socket = null;
    if (typeOfGame == "multiplayer") {
      socket = new Socket();
      await socket.wait();
    }
    thiss.player = new Player(name, socket);
    if (this.getSocketsLn() < 2) {
      this.setNewGame(file);
    } else {
      this.recreateGame();
    }
  }

  getSocketsLn() {
    return super.getSocketsLn();
  }


  async setNewGame(file: string) {
    var nodeStyle = [
      "#bba686",
      "black",
      "20px",
      "round-rectangle",
      "50px",
      "50px",
    ];
    var edgeStyle = ["black", "3px", "basic"];
    graph.createGraphFromFile(file, nodeStyle, edgeStyle, "circle");
    await graph.checkIfExists();
    this.words = graph.getNodes();
    this.fileData = graph.readData();
    this.answers = graph.getAnswers(this.level);
    graph.lockNodes();
    graph.onNodeOver_addEdge("#66a5ad");
    graph.forbidGraphElesSend();

    this.text("letters");
  }

  async recreateGame() {
    this.player.getSocket().send("newConnection", "");

    await graph.checkIfExists();
    this.words = graph.getNodes();
    this.fileData = graph.readData();
    this.answers = graph.getAnswers(this.level);
    graph.lockNodes();
    graph.onNodeOver_addEdge("#66a5ad");
    graph.forbidGraphElesSend();

    this.text("letters");
  }

  setNameOfPlayer(div: string) {
    super.setNameOfPlayer(div);
  }

  getInstance() {
    return this;
  }

  getPlayer() {
    return this.player;
  }

  removeWord(word: string) {
    this.correctAnswers.push(word);
    super.removeWord(word);
  }

  callDialog(
    title: string,
    text: string,
    icon: SweetAlertIcon,
    confirmButtonText: string
  ) {
    super.callDialog(title, text, icon, confirmButtonText);
  }

  async checkNode(word: string) {
    var promise = new Promise(function (resolve, reject) {
      resolve("OK");
    });
    return promise;
  }

  checkOnNodeAddEdge(id: string) {return true;}

  checkWord(word: string) {
    return super.checkWord(word);
  }

  setCorrect(word: string) {
    console.log('setcor ' + word);
    this.setWord(word);
  }

  unsetClickedNodesInGraph() {
    graph.unsetClickedNodes();
  }

  unsetDraggedOverNodesInGraph() {
    console.log('unsetting');
    graph.unsetDraggedOverNodes();
  }

  setWord(word: string) {
    document.getElementById(word).innerHTML = word;
    console.log('setcor ' + word);
    console.log('el ' + document.getElementById(word));
    this.removeWord(word);
    super.checkDone();
  }

  setIncorrect() {
    this.callDialog("Ups", "Skús to znova", "error", "Tentoraz to dám!");
    this.unsetDraggedOverNodesInGraph();
  }

  check() {
    var letters = graph.getDraggedOverNodesNames();
    console.log('check let ' + letters);
    var word = letters.join("");

    if (this.getSocketsLn() == 0) {
      if (this.checkWord(word)) {
        this.unsetDraggedOverNodesInGraph();
        this.setCorrect(word);
      } else {
        this.setIncorrect();
      }
    } else {
      if (this.checkWord(word)) {
        this.unsetDraggedOverNodesInGraph();
        graph.send("correct", '{"name" : "' + word + '"}');
      } else {
        this.callDialog("Ups", "Skús to znova", "error", "Tentoraz to dám!");
        this.unsetDraggedOverNodesInGraph();
      }
    }
  }

  async text(div: string) {
    console.log('text');
    await graph.checkIfExists();
    document.getElementById(div).innerHTML = "";
    for (var string of this.answers) {
      var newDiv = document.createElement("div");
      newDiv.setAttribute("id", string);
      document.getElementById(div).appendChild(newDiv);
      var draggie = new Draggabilly("#" + string, {});
    }
    for (var word of this.correctAnswers) {
      document.getElementById(word).innerHTML = word;
      super.checkDone();
    }
  }

  setOnButtonClick(div: string, args: {}) {
    super.setOnButtonClick(div, args);
  }

  newGame() {
    super.newGame();
  }

  randomGame() {
    super.randomGame();
  }

  newThisGame() {
    if (this.level == graph.readData().length) {
      this.callDialog("Hurá", "Koniec hry", "success", "ok");
    } else {
      if (graph.getGraph() != undefined) {
        super.unDone();
      }
      this.level++;
       /** CHANGE THIS */
      //graph.split(this.level);

      this.words = graph.readDataByLevel(this.level).getInputFlat();
      graph.setNodes(this.words);
      this.answers = graph.getAnswers(this.level);
      graph.recreateGraph();
      graph.lockNodes();

      this.text("letters");
    }
  }

  randomThisGame() {
    if (this.level == this.fileData.length) {
      this.callDialog("Hurá", "Koniec hry", "success", "ok");
    } else {
      if (graph.getGraph() != undefined) {
        super.unDone();
      }
      var ix = this.level;
      while (this.level == ix || ix == 0) {
        ix = Math.floor(Math.random() * graph.readData().length + 1);
      }
      this.level = ix;
       /** CHANGE THIS */

      this.words = graph.readDataByLevel(this.level).getInputFlat();
      graph.setNodes(this.words);
      this.answers = graph.getAnswers(this.level);
      graph.recreateGraph();
      graph.lockNodes();

      this.text("letters");
    }
  }
}

//--------------------SLOVA -----------------------------------
var game = new Slova("client/files/fileSlova.json");
game.setNameOfPlayer("player");

game.setOnButtonClick("#checkCorrect", { "check": [] });

game.setOnButtonClick("button#newGameBtn", { "newGame": [] });

game.setOnButtonClick("button#rndGameBtn", { "randomGame": [] });

game.setOnButtonClick("a#newGameBtn", { "newGame": [] });

game.setOnButtonClick("a#rndGameBtn", { "randomGame": [] });

graph.setOnButtonClick("#save", { "saveImage": [] });

async function stopLoading() {
  let promise = graph.checkIfExists();
  await promise;
  $(".loader").fadeOut();
  $("#preloder").delay(200).fadeOut("slow");
}

stopLoading();
