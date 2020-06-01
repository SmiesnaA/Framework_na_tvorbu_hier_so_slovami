import * as $ from "jquery";
import * as graph from "../objects/graph";
import Player from "../objects/player";
import Node from "./node";
import { Dialog } from "./dialog";
import { SessionStorage } from "./sessionStorage";
import Socket from "./socket";
import { SweetAlertIcon } from "sweetalert2";

/**
 * Current game
 */
export var GAME;

/**
 *
 * Abstract class for creating games
 * @export
 * @abstract
 * @class Game
 */
export abstract class Game {
  level: number = 1;
  words: Node[];
  player: Player;
  done: boolean = false;
  answers: string[];
  allWords: Node[][];
  correctAnswers: string[] = [];

  /**
   *Creates an instance of Game.
   * @memberof Game
   */
  constructor() {
    GAME = this;
  }

  /**
   *
   *
   * @returns instance of subclass
   * @memberof Game
   */
  getInstance() {
    return this;
  }

  /**
   *
   *
   * @returns current level
   * @memberof Game
   */
  getLevel() {
    return this.getLevel();
  }
  /**
   *
   * Gets number of connected sockets  - players
   * @returns number of sockets
   * @memberof Game
   */
  getSocketsLn() {
    var c = 0;
    if (this.player.getSocket() != null) {
      c = this.player.getSocket().count;
    }
    return c;
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

  /**
   * Sets new graph
   * @param file
   */
  async setNewGame(file: string) {}

  /**
   * Recreates graph
   */
  async recreateGame() {}

  /**
   *
   * Gets player
   * @returns current player of the game
   * @memberof Game
   */
  getPlayer() {
    return this.player;
  }

  /**
   *
   * Sets name of the player in div
   * @param {string} div
   * @memberof Game
   */
  setNameOfPlayer(div: string) {
    $(document).ready(function () {
      document.getElementById(div).innerHTML = SessionStorage.getInstance().get(
        "NAME"
      );
    });
  }

  /**
   *
   * Removes a word from answers
   * @param {string} word
   * @memberof Game
   */
  removeWord(word: string) {
    this.answers = this.answers.filter((w) => w != word);
  }

  /**
   *
   * Calls dialog
   * @param {string} title
   * @param {string} text
   * @param {string} icon - warning, error or success
   * @param {string} confirmButtonText - text on submit button
   * @memberof Game
   */
  callDialog(
    title: string,
    text: string,
    icon: SweetAlertIcon,
    confirmButtonText: string
  ) {
    Dialog.callDialogWithIcon(title, text, icon, confirmButtonText);
  }

  /**
   *
   * Checks whether the word is correct
   * Is in answers
   * @param {string} word
   * @returns
   * @memberof Game
   */
  checkWord(word: string) {
    return this.answers.some((w) => w == word);
  }

  /**
   *
   * Sets the word as correct
   * Sets correct nodes to green color
   * @param {string} word
   * @memberof Game
   */
  setCorrect(word: string, color: string) {
    graph.setColorNodes(graph.getClickedNodes(), color);
    this.setWord(word);
  }

  /**
   *
   * Checks if all words are correct
   * If there are no answers left, game is done
   * @memberof Game
   */
  checkDone() {
    if (this.answers.length == 0) {
      this.callDialog("Super", "Chceš pokračovať?", "success", "Jasné");
      $("#checkCorrect").click(false);
      graph.unselectify(true);
      graph.ungrabify(true);
      graph.send("gameDone", '');
      this.done = true;
    }
  }

  /**
   * Sets the word as incorrect
   * Calls the dialog
   * Unsets all clicked nodes
   * @memberof Game
   */
  setIncorrect() {
    graph.unsetClickedNodes();
  }

  /**
   * Sets word
   * @param word
   */
  setWord(word: string) {}

  /**
   * Checks correctness of the word
   * If there are sockets connected - send message to server
   * @param game
   */
  check(color: string) {
    var letters = graph.getClickedNodesName();
    var word = letters.join("");

    if (this.getSocketsLn() == 0) {
      if (this.checkWord(word)) {
        this.setCorrect(word, color);
      } else {
        this.callDialog("Ups", "Skús to znova", "error", "Tentoraz to dám!");
        this.setIncorrect();
      }
    } else {
      if (this.checkWord(word)) {
        graph.send("correct", '{"name" : "' + word + '"}');
      } /* else {
        graph.Graph.getInstance().send("uncorrect", "");
      }*/
    }
  }

  /**
   * Checks on clicked edge
   * If returns true - add edge 
   * If returns false - do not add edge
   * @param id 
   */
  checkOnNodeAddEdge(id: string) {
    return true;
  }

  /**
   *
   * Sets executioning of the functions on button click
   * @param {string} div
   * @param {string[]} args
   * @param {Game} game
   * @memberof Game
   */
  setOnButtonClick(div: string, args: {}) {
    var thiss = this;
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

  /**
   *
   * Sets letters as HTML objects - divs
   * @memberof Game
   */
  async setWordsDiv(div: string) {}

  /**
   * Random game
   * Sets game as done
   * Clears the elements in graph
   */
  unDone() {
    var x = document.getElementById("dropdown-content");
    if(x != null) {
      if (x.style.display === "block") {
        x.style.display = "none";
      }
    }
   
    GAME.done = false;
    graph.clearGraph();
  }

  /**
   * New game with specific attributes
   *
   * @memberof Game
   */
  newThisGame() {
    GAME.newThisGame();
  }

  /**
   * Random game with specific attributes
   *
   * @memberof Game
   */
  randomThisGame() {
    GAME.randomThisGame();
  }

  /**
   * New game
   * Sends to server if a socket is connected
   */
  newGame() {
    if (this.player.getSocket() == null) {
  
      GAME.newThisGame();
    } else {
      console.log("sending new game");
      graph.send("newGame", "");
    }
  }

  /**
   * Random game
   * Sends to server if a socket is connected
   */
  randomGame() {
    if (this.player.getSocket() == null) {
      GAME.randomThisGame();
    } else {
      graph.send("rndGame", "");
    }
  }
}
