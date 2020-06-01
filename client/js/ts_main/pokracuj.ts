import * as graph from "../objects/graph";
import { Game } from "../objects/game";
import Player from "../objects/player";
import * as $ from "jquery";
import Node from "../objects/node";
import {SessionStorage} from "../objects/sessionStorage";
import Socket from "../objects/socket";
import FileData from "../objects/fileData";
import { SweetAlertIcon } from "sweetalert2";

/**
 * Game "Pokracuj" - Subclass of abstract class Game
 */
export class Pokracuj extends Game {
  localStorage: SessionStorage;
  word: Node;
  fileData: FileData[];
  typeOfGame: string;
  player: Player;
  level: number = 1;

  constructor(file: string) {
    super();
    this.createPlayer(file);
  }

  getLevel() {
    return this.level;
  }

  getSocketsLn() {
    return super.getSocketsLn();
  }

    /**
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


  async setNewGame(file: string) {
    var nodeStyle = [
      "#613a43",
      "white",
      "20px",
      "round-rectangle",
      "90px",
      "60px"
    ];
    var edgeStyle = ["black", "4px", "basic"];
    graph.createGraphFromFile(file, nodeStyle, edgeStyle, "preset", false);
    await graph.checkIfExists();
    this.fileData = graph.readData();
    this.word = graph.getNodes()[0];
    graph.setAllNodesUneditable();
  }

  async recreateGame() {
    this.player.getSocket().send("newConnection", "");

    await graph.checkIfExists();
    this.fileData = graph.readData();
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
   * The first two letters of the word have to be equal to the two last letters of previous word in list of eles
   * @param word
   */
  async checkNode(word: string) {
    var promise = new Promise(function (resolve, reject) {
      var words = graph.getNodes();

      var last = words[words.length - 2].name;
      if (last.length < 2) {
        resolve("Slovo musí obsahovať aspoň 2 písmená.");
      } else {
        var lastSub = last.substring(last.length - 2);
        var lastW = word.substring(0, 2);
        if (lastSub == lastW) {
          resolve("OK");
        }
      }
      resolve("Slovo musí začínať na rovnaké písmená predchádzajúceho slova.");
    });
    return promise;
  }

  checkWord(word: string) {
    return true;
  }

  setWord(word: string) {}

  setIncorrect() {
    super.setIncorrect();
  }

  check() {}

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
      var w = graph.readDataByLevel(this.level);
      this.word = w.getInput()[0][0];
      graph.setNodes([this.word]);
      graph.setCurrNode(this.word);
      graph.recreateGraph();
      graph.setAllNodesUneditable();
    }
  }

  randomThisGame() {
    if (this.level == graph.readData().length) {
      this.callDialog("Hurá", "Koniec hry", "success", "ok");
    } else {
      if (graph.getGraph() != undefined) {
        super.unDone();
      }
      var ix = this.level;
      while (this.level == ix || ix == 0) {
        ix = Math.floor(Math.random() * (graph.readData().length + 1));
      }
      this.level = ix;
       /** CHANGE THIS */
       var w = graph.readDataByLevel(this.level);
      this.word = w.getInput()[0][0];
      graph.setNodes([this.word]);
      graph.setCurrNode(this.word);
      graph.recreateGraph();
      graph.setAllNodesUneditable();
    }
  }
}

//--------------------POKRACUJ -----------------------------------
var game = new Pokracuj("client/files/fileMapaPokracuj.json");
game.setNameOfPlayer("player");

graph.setOnButtonClick("#add", {"addNode" : ['', true], "addEdgeToPrevNode" : []});

game.setOnButtonClick("button#newGameBtn", {"newGame": []});

game.setOnButtonClick("button#rndGameBtn", {"randomGame": []});

game.setOnButtonClick("a#newGameBtn", { "newGame": [] });

game.setOnButtonClick("a#rndGameBtn", { "randomGame": [] });

graph.setOnButtonClick("#save", {"saveImage": []});

async function stopLoading() {
  let promise = graph.checkIfExists();
  await promise;
  $(".loader").fadeOut();
  $("#preloder").delay(200).fadeOut("slow");
}

stopLoading();
