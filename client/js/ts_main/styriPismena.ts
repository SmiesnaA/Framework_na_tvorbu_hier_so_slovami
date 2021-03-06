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
export class StyriPismena extends Game {
  localStorage: SessionStorage;
  words: Node[];
  answers: string[];
  readData: FileData[];
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
      "#CB2800",
      "white",
      "60px",
      "circle",
      "100px",
      "100px",
    ];
    var edgeStyle = ["#E88200", "3px", "basic"];
    graph.createGraphFromFile(file, nodeStyle, edgeStyle, "circle");
    await graph.checkIfExists();
    this.words = graph.getNodes();
    this.readData = graph.readData();
    this.answers = graph.getAnswers(this.level);
    graph.lockNodes();
    graph.onNodeClick_addEdge("#66a5ad");
    graph.forbidGraphElesSend();

    this.setWordsDiv("letters");
  }

  async recreateGame() {
    this.player.getSocket().send("newConnection", "");

    await graph.checkIfExists();
    this.words = graph.getNodes();
    this.readData = graph.readData();
    this.answers = graph.getAnswers(this.level);
    graph.lockNodes();
    graph.onNodeClick_addEdge("#66a5ad");
    graph.forbidGraphElesSend();
    this.setWordsDiv("letters");
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

  checkWord(word: string) {
    return super.checkWord(word);
  }

  setCorrect(word: string) {
    this.setWord(word);
  }

  unsetClickedNodesInGraph() {
    graph.unsetClickedNodes();
  }

  setWord(word: string) {
      var letters = document.getElementById("answer").children;
      for(var i = 0; i < letters.length; i++) {
          letters[i].innerHTML = word[i];
      }
    this.removeWord(word);
    this.callDialog("Hurá", "Mohol si ešte vytvoriť: " + this.answers.join(", "), "success", "OK");
    this.answers  =  [];
  }

  setIncorrect() {
    this.callDialog("Ups", "Skús to znova", "error", "Tentoraz to dám!");
    this.unsetClickedNodesInGraph();
  }

  check() {
    var letters = graph.getClickedNodesName();
    var word = letters.join("");

    if (this.getSocketsLn() == 0) {
      if (this.checkWord(word)) {
        this.unsetClickedNodesInGraph();
        this.setCorrect(word);
      } else {
        this.setIncorrect();
      }
    } else {
      if (this.checkWord(word)) {
        this.unsetClickedNodesInGraph();
        graph.send("correct", '{"name" : "' + word + '"}');
      } else {
        this.callDialog("Ups", "Skús to znova", "error", "Tentoraz to dám!");
        this.unsetClickedNodesInGraph();
      }
    }
  }

  async setWordsDiv(div: string) {
    await graph.checkIfExists();
    document.getElementById(div).innerHTML = "";
    var newDiv = document.createElement("div");
    newDiv.setAttribute("id", "answer");
    var answ = this.answers[0];
    for (var i = 0; i < answ.length; i++) {
        var divLetter = document.createElement("div"); 
        newDiv.appendChild(divLetter);
    }
    document.getElementById(div).appendChild(newDiv);
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
    if (this.level == this.readData.length) {
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

      this.setWordsDiv("letters");
    }
  }

}

//--------------------SLOVA -----------------------------------
var game = new StyriPismena("client/files/styriPismena.json");
game.setNameOfPlayer("player");

game.setOnButtonClick("#checkCorrect", { "checkConnected": [] });

game.setOnButtonClick("button#newGameBtn", { "newGame": [] });

game.setOnButtonClick("a#newGameBtn", { "newGame": [] });


graph.setOnButtonClick("#save", { "saveImage": [] });

async function stopLoading() {
  let promise = graph.checkIfExists();
  await promise;
  $(".loader").fadeOut();
  $("#preloder").delay(200).fadeOut("slow");
}

stopLoading();
