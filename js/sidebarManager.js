class SidebarManager {
    constructor() {
        this.isSidebarOpen = true;
        this.isAppRunning = true;
        this.animationFrameOutput = 0;

        this.pauseApplication();
        this.playApplication();
    }

    showHideSidebarToRight = function() {
        if (!this.isSidebarOpen) {
            this.isSidebarOpen = true;
            document.getElementById("sidebarRight").style.right = "40px";

        } else {
            this.isSidebarOpen = false;
            document.getElementById("sidebarRight").style.right = "-300px";
        }
    }

    hideSidebarToLeft = function() {
        document.getElementById("sidebarPlanetInfo").style.left = "-300px";
    }


    // Functions for play/pause the application
    // -------------------------------------------------------------------------
    pauseApplication = function() {
        // playButton, disabled at the beginning
        document.getElementById("play").disabled = true;
        var isRunning = this.getIsAppRunning();

        if (isRunning) {
            this.setIsAppRunning(false);
            $(".pauseButton").on("click", function() {
                cancelAnimationFrame(animationFrameOutput);
                document.getElementById("pause").disabled = true; // pauseButton
                document.getElementById("play").disabled = false; // playButton
            });
        }
    }

    playApplication = function() {
        var isRunning = this.getIsAppRunning();
        if (!isRunning) {
            this.setIsAppRunning(true);
            $(".playButton").on("click", function() {
                animationFrameOutput = requestAnimationFrame(animate);
                document.getElementById("pause").disabled = false; // pauseButton
                document.getElementById("play").disabled = true; // playButton
            });
        }
    }

    getIsAppRunning = function() { return this.isAppRunning; }
    setIsAppRunning = function(value) { return this.isAppRunning = value; }
}

// Script for menu - NIEKDE ZARADIT
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