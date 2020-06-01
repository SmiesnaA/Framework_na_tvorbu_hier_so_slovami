
/**
 * Dropdown menu buttons for mobile version
 */
var x = document.getElementById("dropdown-content");
if (x.style.display === "block") {
    x.style.display = "none";
}

function showMenu() {
    var x = document.getElementById("dropdown-content");
    if (x.style.display === "none") {
        x.style.display = "block";
    } else {
        x.style.display = "none";
    }
}