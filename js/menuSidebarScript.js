// Script for menu
function openNav() {
    document.getElementById("menu").style.right = "0"
}

function closeNav() {
    document.getElementById("menu").style.right = "-300px"
}

// Script for sidebar
var isSidebarOpen = true;

function showHideSidebar() {
    if (!isSidebarOpen) {
        isSidebarOpen = true;
        document.getElementById("sidebar").style.right = "40px"

    } else {
        isSidebarOpen = false;
        document.getElementById("sidebar").style.right = "-300px";
    }
}