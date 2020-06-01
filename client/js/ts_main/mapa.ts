import * as graph from "../objects/graph";
import Node from "../objects/node";
import { Game, GAME } from "../objects/game";
import Player from "../objects/player";
import * as $ from "jquery";
import { SessionStorage } from "../objects/sessionStorage";
import Socket from "../objects/socket";
import FileData from "../objects/fileData";
import { SweetAlertIcon } from "sweetalert2";

/**
 * Game "Mapa" - Subclass of abstract class Game
 */
export class Mapa extends Game {
  localStorage: SessionStorage;
  file: string;
  level: number = 1;
  word: Node;
  typeOfGame: string;
  player: Player;
  done: boolean = false;
  readData: FileData[];


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

  /**
   * CHANGE THIS
   * Sets new graph with specific attributes and style
   * Singleplayer and one connected socket case
   * @param file
   */
  async setNewGame(file: string) {
    var nodeStyle = ["#e1b80d", "black",  "20px", "rectangle", "100px", "80px"];
    var edgeStyle = ["black", "3px", "arrow"];
    graph.createGraphFromFile(file, nodeStyle, edgeStyle, "preset", true);

    await graph.checkIfExists();
    this.readData = graph.readData();
    this.word = graph.getNodes()[0];
    graph.setAllNodesUneditable();
  }

  /**
   * CHANGE THIS
   * Recreates graph with inherited style
   * Multiplayer case
   * @param file
   */
  async recreateGame() {
    this.player.getSocket().send("newConnection", "");

    await graph.checkIfExists();
    this.word = graph.getNodes()[0];
  }

  setCorrect(word: string) {}

  setNameOfPlayer(div: string) {
    super.setNameOfPlayer(div);
  }

  getInstance() {
    return this;
  }

  getPlayer() {
    return this.player;
  }

  removeWord(word: string) {}

  callDialog(
    title: string,
    text: string,
    icon: SweetAlertIcon,
    confirmButtonText: string
  ) {
    super.callDialog(title, text, icon, confirmButtonText);
  }

  /**
   * Checks logical correctness of the word
   * Empty promise with resolve "OK" = no need to check
   * @param word
   */
  async checkNode(word: string) {
    var promise = new Promise(function (resolve, reject) {
      resolve("OK");
    });
    return promise;
  }

  /**
   * Check correctness of the word
   *
   * @param {string} word
   * @returns
   * @memberof Mapa
   */
  checkWord(word: string) {
    return true;
  }

  setWord(word: string) {}

  setIncorrect() {}

  check() {
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

  /**
   * Calls dialog if all games are done
   * OR
   * Sets another word in list of words and sets new graph
   */
  newThisGame() {
    if (this.level == this.readData.length) {
      this.callDialog("Hurá", "Koniec hry", "success", "ok");
    } else {
      if (graph.getGraph() != undefined) {
        super.unDone();
      }
      /** CHANGE THIS */
      this.level++;
      var w = graph.readDataByLevel(this.level);
      this.word = w.getInput()[0][0];
      graph.setFirstNode(this.word);
      graph.setNodes([this.word]);
      graph.recreateGraph();
      graph.setAllNodesUneditable();
    }
  }

  /**
   * Calls dialog if all games are done
   * OR
   * Sets another random word in list of words and sets new graph
   */
  randomThisGame() {
    if (this.level == graph.readData().length) {
      this.callDialog("Hurá", "Koniec hry", "success", "ok");
    } else {
      if (graph.getGraph() != undefined) {
        super.unDone();
      }
      var ix = this.level;
      while (this.level == ix || ix == 0) {
        ix = Math.floor(Math.random() * (this.readData.length + 1));
      }
      this.level = ix;
      /** CHANGE THIS */
      var w = graph.readDataByLevel(this.level);
      this.word = w.getInput()[0][0];
      graph.setFirstNode(this.word);
      graph.setNodes([this.word]);
      graph.recreateGraph();
      graph.setAllNodesUneditable();
    }
  }
}

//------------MAPA----------------------//
var game = new Mapa("client/files/fileMapaPokracuj.json");
game.setNameOfPlayer("player");

graph.setOnButtonClick("#add", { "addNode": ["", true], "addEdgeToFirstNode": [] });

game.setOnButtonClick("button#newGameBtn", { "newGame": [] });

game.setOnButtonClick("button#rndGameBtn", { "randomGame": [] });

game.setOnButtonClick("a#newGameBtn", { newGame: [] });

game.setOnButtonClick("a#rndGameBtn", { randomGame: [] });

graph.setOnButtonClick("#save", { saveImage: [] });

async function stopLoading() {
  let promise = graph.checkIfExists();
  await promise;
  $(".loader").fadeOut();
  $("#preloder").delay(200).fadeOut("slow");
}

stopLoading();
