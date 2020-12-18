// Script for menu
///////////////////////////////////////////////////////////////
function openNav() {
    document.getElementById("menu").style.right = "0"
}

function closeNav() {
    document.getElementById("menu").style.right = "-300px"
}

function highlightLang() {
    document.getElementById("languages").onclick = highlightChosenLanguage;
}

function highlightChosenLanguage(event) {
    if (event.target.id == "cz") {
        event.target.style.fontWeight = "bold";
        document.getElementById("en").style.fontWeight = document.getElementById("sk").style.fontWeight = "normal";
        document.getElementById("en").style.color = document.getElementById("sk").style.color = "#BABABABA";
    } else if (event.target.id == "en") {
        event.target.style.fontWeight = "bold";
        document.getElementById("cz").style.fontWeight = document.getElementById("sk").style.fontWeight = "normal";
        document.getElementById("cz").style.color = document.getElementById("sk").style.color = "#BABABABA";
    } else if (event.target.id == "sk") {
        event.target.style.fontWeight = "bold";
        document.getElementById("cz").style.fontWeight = document.getElementById("en").style.fontWeight = "normal";
        document.getElementById("cz").style.color = document.getElementById("en").style.color = "#BABABABA";
    }
    event.target.style.color = "#ffffff";
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