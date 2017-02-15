function fixedFunction() {
var clientHeightHeader = document.getElementById('fixed-header').clientHeight;
   
var clientHeightFooter = document.getElementById('fixed-footer').clientHeight;

	
    var ch = document.getElementById("body").style.paddingTop = (clientHeightHeader + "px");
    var cf = document.getElementById("body").style.paddingBottom = (clientHeightFooter + "px");

  
}