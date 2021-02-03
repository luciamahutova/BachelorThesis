class SidebarManager {
    constructor(planetsNamesOnScene, scene) {
        this.isSidebarOpen = true;
        this.isAppRunning = true;
        this.animationFrameOutput = 0;
        this.planetsNamesOnScene = planetsNamesOnScene;
        this.scene = scene;

        this.pauseApplication();
        this.playApplication();
        //this.confirmButtonBehavior();
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
        // Call in the 1st sidebar will be: onclick="sidebarManager.hideSidebarToLeft()"
    }


    // Functions for play/pause the application
    // -------------------------------------------------------------------------
    pauseApplication = function() {
        // playButton, disabled at the beginning
        $('.playButton').prop('disabled', true);
        var isRunning = this.getIsAppRunning();

        if (isRunning) {
            this.setIsAppRunning(false);
            $(".pauseButton").on("click", function() {
                cancelAnimationFrame(animationFrameOutput);
                $('.pauseButton').prop('disabled', true);
                $('.playButton').prop('disabled', false);
            });
        }
    }

    playApplication = function() {
        var isRunning = this.getIsAppRunning();
        if (!isRunning) {
            this.setIsAppRunning(true);
            $(".playButton").on("click", function() {
                animationFrameOutput = requestAnimationFrame(animate);
                $('.pauseButton').prop('disabled', false);
                $('.playButton').prop('disabled', true);
            });
        }
    }

    getIsAppRunning = function() { return this.isAppRunning; }
    setIsAppRunning = function(value) { return this.isAppRunning = value; }
}

// Confirm button and functions for Sidebar
// -------------------------------------------------------------------------
SidebarManager.prototype.confirmButtonBehavior = function() {
    this.showHideAllNamesOfPlanetsOnScene();
    this.showHideSingleNameOfPlanetOnScene();
}

SidebarManager.prototype.showHideAllNamesOfPlanetsOnScene = function() {
    if (document.getElementById("allPlanetNamesChecked").checked == true) {
        for (i = 0; i < 8; i++) {
            this.scene.add(this.planetsNamesOnScene[i]);
        }
    } else if (document.getElementById("allPlanetNamesChecked").checked == false) {
        for (i = 0; i < 8; i++) {
            this.scene.remove(this.planetsNamesOnScene[i]);
        }
    }
}

SidebarManager.prototype.showHideSingleNameOfPlanetOnScene = function() {
    var selectedElem = document.getElementById("singlePlanetNameSelected");
    var allPlanetNamesSelected = document.getElementById("allPlanetNamesChecked").checked;
    // -1 is for option with no planet name
    if (selectedElem.value != -1 && allPlanetNamesSelected == false) {
        for (i = 0; i < 8; i++) {
            this.scene.remove(this.planetsNamesOnScene[i]);
        }
        this.scene.add(this.planetsNamesOnScene[selectedElem.value]);
    }
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