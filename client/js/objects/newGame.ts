import * as $ from "jquery";
import { Dialog } from "./dialog";

/**
 *
 * Shows dialogs and starts a new game with name of the link
 * @export
 * @param {string} link
 */
export function dialogGame(link: string) {
  Dialog.gameDialog(link);
}

/**
 *
 * Sets functions executed after button click
 * @export
 * @param {string} div
 * @param {string[]} args
 */
export function setOnButtonClick(div: string, args: {}) {
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
