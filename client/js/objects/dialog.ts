import * as $ from "jquery";
import * as localStorage from "./sessionStorage";
import Swal, { SweetAlertIcon } from 'sweetalert2';

export class Dialog {
  public static instance: Dialog = new Dialog();
  /**
   *
   * Shows dialog with given title
   * Without icon
   * OK confirm button
   * @static
   * @param {string} title 
   * @memberof Dialog
   */
  public static callDialog(title: string) {
    Swal.fire({ title });
  }
  /**
   *
   * Shows dialog with icon, given title and text
   * @static
   * @param {string} title
   * @param {string} text
   * @param {SweetAlertIcon} icon
   * @param {string} confirmButtonText Text in confirm button
   * @memberof Dialog
   */
  public static callDialogWithIcon(
    title: string,
    text: string,
    icon: SweetAlertIcon,
    confirmButtonText: string
  ) {
    Swal.fire({
      title: title,
      text: text,
      icon: icon,
      confirmButtonText: confirmButtonText,
    });
  }
/**
 *
 * Shows dialog when game is selected by user
 * Input for player name and type of game - singleplayer or multiplayer
 * @static
 * @param {string} link
 * @memberof Dialog
 */
public static gameDialog(link: string) {
    var name;
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger",
      },
    });

    swalWithBootstrapButtons
      .fire({
        confirmButtonText: "Ďalej &rarr;",
        showCloseButton: true,
        title: "Zadaj meno",
        input: "text",
      })
      .then((result) => {
        if (result.value) {
          name = result.value;
          swalWithBootstrapButtons
            .fire({
              title: "Typ hry",
              showCancelButton: true,
              showCloseButton: true,
              confirmButtonText: '<i class="fas fa-user"></i> Jeden hráč',
              cancelButtonText: '<i class="fas fa-users"></i> Viac hráčov',
            })
            .then(async (result) => {
              if (result.value) {
                var object = link.split("_")[1];
        
                await localStorage.saveToSession(object, "singleplayer", name);
                location.replace(link);
              } else if (result.dismiss === Swal.DismissReason.cancel) {
                var object = link.split("_")[1];
                await localStorage.saveToSession(object, "multiplayer", name);
                location.replace(link);
              }
            });
        }
      });
  }
}
