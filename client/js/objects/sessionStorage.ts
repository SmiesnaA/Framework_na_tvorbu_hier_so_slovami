/**
 *
 * Saves and gets values by key in local storage
 * @export
 * @class LocalStorage
 */
export class SessionStorage {
  private static sessionStorage = new SessionStorage();


  public static getInstance() {
    if (!SessionStorage.sessionStorage) {
      SessionStorage.sessionStorage = new SessionStorage();
    }

    return SessionStorage.sessionStorage;
  }

  /**
   * Saves type of game and name of the current player 
   *
   * @param {string} object
   * @param {string} typeOfGame
   * @param {string} name
   * @memberof LocalStorage
   */
  save(typeOfGame: string, name: string) {
    this.set("NAME", name);
    this.set("GAME", typeOfGame);
  }


  /**
   * Sets value and key to storage
   *
   * @param {*} key
   * @param {*} value
   * @returns
   * @memberof LocalStorage
   */
  set(key, value) {
    if (!key || !value) {
      return;
    }
    var newValue = value;
    if (typeof value === "object") {
      newValue = JSON.stringify(value);
    }
    sessionStorage.setItem(key, newValue);
  }

  /**
   * Gets key by value
   *
   * @param {*} key
   * @returns
   * @memberof LocalStorage
   */
  get(key) {
    var value = sessionStorage.getItem(key);
    if (!value) {
      return;
    }
    if (value == null) {
      return "";
    }

    if (value[0] === "{") {
      value = JSON.parse(value);
    }
    return value;
  }
}

/**
 * Promise of saving to the the local storage
 *
 * @param {string} object
 * @param {string} typeOfGame
 * @param {string} name
 * @returns
 */
export function saveToSession(object: string, typeOfGame: string, name: string) {
  return new Promise((resolve) => {
    SessionStorage.getInstance().save(typeOfGame, name);
    resolve("ok");
  });
}