// Script for menu
///////////////////////////////////////////////////////////////
function openNav() {
    document.getElementById("menu").style.right = "0"
}

function closeNav() {
    document.getElementById("menu").style.right = "-300px"
}

// Script for sidebar 
///////////////////////////////////////////////////////////////
var isSidebarOpen = true;
var isAppRunning = true;
var animationFrameOutput = 0;

function showHideSidebar() {
    if (!isSidebarOpen) {
        isSidebarOpen = true;
        document.getElementById("sidebar").style.right = "40px";

    } else {
        isSidebarOpen = false;
        document.getElementById("sidebar").style.right = "-300px";
    }
}

function pauseApplication() {
    $(".pauseButton").on("click", function() {
        if (isAppRunning) {
            isAppRunning = false;
            cancelAnimationFrame(animationFrameOutput);
        }
    });
}
pauseApplication();

function playApplication() {
    $(".playButton").on("click", function() {
        if (!isAppRunning) {
            isAppRunning = true;
            animationFrameOutput = requestAnimationFrame(animate);
        }
    });
}
playApplication();