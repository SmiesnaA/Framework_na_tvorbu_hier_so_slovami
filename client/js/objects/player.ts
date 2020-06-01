import Socket from "./socket";

/**
 * Current player/user in the game
 *
 * @export
 * @class Player
 */
export default class Player {
  private name: string;
  private socket: Socket;

  /**
   *Creates an instance of Player.
   * @param {string} name
   * @param {Socket} socket
   * @memberof Player
   */
  constructor(name: string, socket: Socket) {
    this.name = name;
    this.socket = socket;
  }

  /**
   *
   * Gets name of the player
   * @returns
   * @memberof Player
   */
  getName() {
    return this.name;
  }

  /**
   *
   * Gets socket on which is player connected
   * @returns
   * @memberof Player
   */
  getSocket() {
    return this.socket;
  }
}