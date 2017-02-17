
function myNavResponsive() {
    var x = document.getElementById("myNavbar");
    if (x.className === "navbar") {
        x.className += " navResponsive";
    } else {
        x.className = "navbar";
    }
}
