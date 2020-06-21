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
 * Game "HladajSlova" - Subclass of abstract class Game
 */
export class HladajSlova extends Game {
  localStorage: SessionStorage;
  level: number = 1;
  words: Node[];
  answers: string[];
  typeOfGame: string;
  readData: FileData[];
  player: Player;
  correctAnswers: string[] = [];

  constructor(file: string) {
    super();
    this.createPlayer(file);
  }

  getLevel() {
    return this.level;
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


  getSocketsLn() {
    return super.getSocketsLn();
  }

  async setNewGame(file: string) {
    var nodeStyle = ["#fcfdfe", "black", "20px", "ellipse", "50px", "50px"];
    var edgeStyle = ["red", "3px", "arrow"];
   
    graph.createGraphFromFile(file, nodeStyle, edgeStyle, "grid");
    await graph.checkIfExists();
 
    this.readData = graph.readData();
    this.words = graph.getNodes();
    this.answers = graph.getAnswers(this.level);
    graph.onNodeOver_addEdge("#d0d3d4");
    graph.forbidClickSend();
    graph.lockNodes();

    this.text("words");
  }

  async recreateGame() {
    this.player.getSocket().send("newConnection", "");

    await graph.checkIfExists();
 
    this.words = graph.getNodes();
    this.readData = graph.readData();
    this.answers = graph.getAnswers(this.level);
  
    graph.onNodeOver_addEdge("#d0d3d4");
    
    graph.forbidClickSend();
    graph.lockNodes();

    this.text("words");
 
  }

  setCorrect(word: string) {
    this.setWord(word);
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

  checkWord(word: string) {
    return super.checkWord(word);
  }

  setWord(word: string) {
    document.getElementById(word).innerHTML = word;
    console.log('word html ' + document.getElementById(word));
    this.removeWord(word);
    super.checkDone();
  }

  setIncorrect() {
    super.setIncorrect();
  }

  async checkNode(word: string) {
    var promise = new Promise(function (resolve, reject) {
      resolve("OK");
    });
    return promise;
  }

  checkOnNodeAddEdge(id: string) {
    return true;
  }

  unsetClickedNodesInGraph() {
    graph.unsetClickedNodes();
  }

  unsetDraggedOverNodesInGraph() {
    graph.unsetDraggedOverNodes();
  }

  check() {
    var letters = graph.getDraggedOverNodesNames();
    var word = letters.join("");
    if(word.length < 3) {
        this.callDialog("Ups", "Slovo musí mať aspoň 3 písmená", "error", "Skúsim to ešte raz");
        this.unsetDraggedOverNodesInGraph();
        return;
    }
    if (this.getSocketsLn() == 0) {
      if (this.checkWord(word)) {
        this.callDialog("Super", "Našiel si slovo " + word, "success", "Hľadať ďalej");
        this.unsetDraggedOverNodesInGraph();
        this.setCorrect(word);
      } else {
        this.callDialog("Ups", "Skús to znova", "error", "Tentoraz to dám!");
        this.setIncorrect();
        this.unsetDraggedOverNodesInGraph();
      }
    } else {
      if (this.checkWord(word)) {
        this.callDialog("Super", "Našiel si slovo " + word, "success", "Hľadať ďalej");
        this.unsetDraggedOverNodesInGraph();
        graph.send("correct", '{"name" : "' + word + '"}');
      } else {
        this.callDialog("Ups", "Skús to znova", "error", "Tentoraz to dám!");
        this.unsetDraggedOverNodesInGraph();
      }
    }
  }

  correctClickedNodes(json: string) {
    var nodes = JSON.parse(json);
    graph.setColorNodes(nodes.nodes, "#116466");

  }

  async text(div: string) {
    await graph.checkIfExists();
    document.getElementById(div).innerHTML = "";
    for (var string of this.answers) {
      var newDiv = document.createElement("div");
      newDiv.setAttribute("id", string);
      document.getElementById(div).appendChild(newDiv);
    }
    for (var word of this.correctAnswers) {
      document.getElementById(word).innerHTML = word;
      super.checkDone();
    }
  }

  setOnButtonClick(div: string, args: {}) {
    super.setOnButtonClick(div, args);
  }

  async newGame() {
    super.newGame();
  }

  async randomGame() {
    super.randomGame();
  }

  async newThisGame() {
    if (this.level == this.readData.length) {
      this.callDialog("Hurá", "Koniec hry", "success", "ok");
    } else {
      if (graph.getGraph() != undefined) {
        super.unDone();
      }
      this.level++;
      /** CHANGE THIS */
      var words = graph.readDataByLevel(this.level);
      this.words = words.getInputFlat();
      graph.setNodes(this.words);
      graph.recreateGraph();
      this.answers = graph.getAnswers(this.level);
      graph.lockNodes();
      this.text("words");
    }
  }

  async randomThisGame() {
    if (this.level == this.readData.length) {
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
       var words = graph.readDataByLevel(this.level);
      this.words = words.getInputFlat();
      graph.setNodes(this.words);
      graph.recreateGraph();
      this.answers = graph.getAnswers(this.level);
      graph.lockNodes();
      this.text("words");
    }
  }
}

//--------------------OSEMSMEROVKA -----------------------------------
var game = new HladajSlova(
  "client/files/hladajSlova.json");
game.setNameOfPlayer("player");

game.setOnButtonClick("div#checkCorrect",{"check" : []});

game.setOnButtonClick("button#newGameBtn", {"newGame" : []});

game.setOnButtonClick("button#rndGameBtn", {"randomGame" : []});

game.setOnButtonClick("a#newGameBtn", {"newGame" : []});

game.setOnButtonClick("a#rndGameBtn", {"randomGame" : []});

graph.setOnButtonClick("#save", {"saveImage" : []});

async function stopLoading() {
  let promise = graph.checkIfExists();
  await promise;
  $(".loader").fadeOut();
  $("#preloder").delay(200).fadeOut("slow");
}

stopLoading();
