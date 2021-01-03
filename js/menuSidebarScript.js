// Script for menu
///////////////////////////////////////////////////////////////
function openNav() {
    document.getElementById("menu").style.right = "0"
}

function closeNav() {
    document.getElementById("menu").style.right = "-300px"
}

function highlightChosenLanguage(id) {
    if (id == "cz") {
        document.getElementById("en").style.fontWeight = document.getElementById("sk").style.fontWeight = "normal";
        document.getElementById("en").style.color = document.getElementById("sk").style.color = "#BABABABA";
    } else if (id == "en") {
        document.getElementById("cz").style.fontWeight = document.getElementById("sk").style.fontWeight = "normal";
        document.getElementById("cz").style.color = document.getElementById("sk").style.color = "#BABABABA";
    } else if (id == "sk") {
        document.getElementById("cz").style.fontWeight = document.getElementById("en").style.fontWeight = "normal";
        document.getElementById("cz").style.color = document.getElementById("en").style.color = "#BABABABA";
    }
    document.getElementById(id).style.fontWeight = "bold";
    document.getElementById(id).style.color = "#ffffff";
}

//POKUS-UMIESTNIT INDE
// NEFUNGUJE
$(document).on("click", "#planetSwitch", function(event) {
    var target = $(event.target);
    console.log(target.is('#planetSwitch'));
    if (target.is('#planet-1')) {
        console.log("yes2");
        document.getElementById("data-1").style.visibility = visible;
    }
});


// Script for sidebar 
///////////////////////////////////////////////////////////////
var isSidebarOpen = true;
var isAppRunning = true;
var animationFrameOutput = 0;

function showHideSidebar() {
    if (!isSidebarOpen) {
        isSidebarOpen = true;
        document.getElementById("sidebarRight").style.right = "40px";

    } else {
        isSidebarOpen = false;
        document.getElementById("sidebarRight").style.right = "-300px";
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