class SidebarManager {
    constructor(planetsNamesOnScene, moonsNamesOnScene, scene, orbits) {
        this.isSidebarOpen = true;
        this.isLeftSidebarOpen = true;
        this.isAppRunning = true;
        this.animationFrameOutput = 0;
        this.planetsNamesOnScene = planetsNamesOnScene;
        this.moonsNamesOnScene = moonsNamesOnScene;
        this.scene = scene;
        this.orbits = orbits;
        this.pauseTime = this.playTime = Date.now();

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
        this.isLeftSidebarOpen = false;
        document.getElementById("sidebarPlanetInfo").style.left = "-300px";

        // "window.myParam" - from raycaster.js, represents the last clicked planet/orbit = for clearing the colour
        if (window.myParam != undefined) {
            var clearObjectColor = window.myParam;
            var moveAbout = 0; // Difference between Mesh (planet) and Line (orbit) in scene.children

            if (clearObjectColor[0].object.parent.children[27].type == "Line") {
                moveAbout = 25;
            } else if (clearObjectColor[0].object.parent.children[35].type == "Line") {
                moveAbout = 33;
            }

            clearObjectColor[0].object.material.color.set(0xffffff);
            var indexOfClickedObject = clearObjectColor[0].object.parent.children.indexOf(clearObjectColor[0].object);

            if (clearObjectColor[0].object.type == "Mesh") {
                clearObjectColor[0].object.parent.children[indexOfClickedObject + moveAbout].material.color.set(0xffffff);
            } else if (clearObjectColor[0].object.type == "Line") {
                clearObjectColor[0].object.parent.children[indexOfClickedObject - moveAbout].material.color.set(0xffffff);
            }
        }
    }

    // Functions for play/pause the application (on click or for active/inactive window)
    // -------------------------------------------------------------------------
    pauseApplication = function() {
        // playButton, disabled at the beginning
        $('.playButton').prop('disabled', true);
        var isRunning = this.getIsAppRunning();

        if (isRunning) {
            this.setIsAppRunning(false);
            this.setPauseTime(Date.now());
            $(".pauseButton").on("click", function() {
                cancelAnimationFrame(animationFrameOutput);
                $('.pauseButton').prop('disabled', true);
                $('.playButton').prop('disabled', false);
            });
        }
    }

    pauseApplicationOnInactiveWindow = function() {
        cancelAnimationFrame(animationFrameOutput);
        this.setIsAppRunning(false);
    }

    playApplication = function() {
        var isRunning = this.getIsAppRunning();
        if (!isRunning) {
            this.setIsAppRunning(true);
            this.setPlayTime(Date.now());
            $(".playButton").on("click", function() {
                animationFrameOutput = requestAnimationFrame(animate);
                $('.pauseButton').prop('disabled', false);
                $('.playButton').prop('disabled', true);
            });
        }
    }

    playApplicationOnActiveWindow = function() {
        animationFrameOutput = requestAnimationFrame(animate);
        this.setIsAppRunning(true);
        $('.pauseButton').prop('disabled', false);
        $('.playButton').prop('disabled', true);
    }

    // Open in new tab 
    openNewTabForPlanets = function() {
        window.open("planetsPage.html", '_blank');
    }

    openNewTabForInfo = function() {
        window.open("infoPage.html", '_blank');
    }

    // Get and Set functions
    // -------------------------------------------------------------------------
    getIsAppRunning = function() { return this.isAppRunning; }
    setIsAppRunning = function(value) { this.isAppRunning = value; }
    getPauseTime = function() { return this.pauseTime; }
    setPauseTime = function(value) { this.pauseTime = value; }
    getPlayTime = function() { return this.playTime; }
    setPlayTime = function(value) { this.playTime = value; }
    getPlayPauseTimeDifference = function() { return this.playTime - this.getPauseTime(); }
}

// Sidebar - Confirm button 
// -------------------------------------------------------------------------
SidebarManager.prototype.confirmButtonBehavior = function() {
    // Cannot add/remove names or orbits in for-cycle, planets will jump to different position
    this.showHideAllNamesOfPlanetsOnScene();
    this.showHideSingleNameOfPlanetOnScene();
    this.showHideAllNamesOfMoonsOnScene();
    this.showHideSingleNameOfMoonOnScene();
    this.showHideAllPlanetOrbitsOnScene();
    this.showHideSinglePlanetOrbitOnScene();
}

// Sidebar - functions for planets' and moons' names
// -------------------------------------------------------------------------
SidebarManager.prototype.showHideAllNamesOfPlanetsOnScene = function() {
    if (document.getElementById("allPlanetNamesChecked").checked == true) {
        this.scene.add(this.planetsNamesOnScene[0], this.planetsNamesOnScene[1],
            this.planetsNamesOnScene[2], this.planetsNamesOnScene[3],
            this.planetsNamesOnScene[4], this.planetsNamesOnScene[5],
            this.planetsNamesOnScene[6], this.planetsNamesOnScene[7]);
    } else if (document.getElementById("allPlanetNamesChecked").checked == false) {
        this.scene.remove(this.planetsNamesOnScene[0], this.planetsNamesOnScene[1],
            this.planetsNamesOnScene[2], this.planetsNamesOnScene[3],
            this.planetsNamesOnScene[4], this.planetsNamesOnScene[5],
            this.planetsNamesOnScene[6], this.planetsNamesOnScene[7]);
    }
}

SidebarManager.prototype.showHideSingleNameOfPlanetOnScene = function() {
    var selectedElem = document.getElementById("singlePlanetNameSelected");
    var allPlanetNamesSelected = document.getElementById("allPlanetNamesChecked").checked;
    // -1 is for option with no planet name
    if (selectedElem.value != -1 && allPlanetNamesSelected == false) {
        this.scene.remove(this.planetsNamesOnScene[0], this.planetsNamesOnScene[1],
            this.planetsNamesOnScene[2], this.planetsNamesOnScene[3],
            this.planetsNamesOnScene[4], this.planetsNamesOnScene[5],
            this.planetsNamesOnScene[6], this.planetsNamesOnScene[7]);
        this.scene.add(this.planetsNamesOnScene[selectedElem.value]);
    }
}

SidebarManager.prototype.showHideAllNamesOfMoonsOnScene = function() {
    if (document.getElementById("allMoonNamesChecked").checked == true) {
        this.scene.add(this.moonsNamesOnScene[0], this.moonsNamesOnScene[1], this.moonsNamesOnScene[2],
            this.moonsNamesOnScene[3], this.moonsNamesOnScene[4], this.moonsNamesOnScene[5], this.moonsNamesOnScene[6],
            this.moonsNamesOnScene[7], this.moonsNamesOnScene[8], this.moonsNamesOnScene[9], this.moonsNamesOnScene[10],
            this.moonsNamesOnScene[11], this.moonsNamesOnScene[12], this.moonsNamesOnScene[13], this.moonsNamesOnScene[14]);

    } else if (document.getElementById("allMoonNamesChecked").checked == false) {
        this.scene.remove(this.moonsNamesOnScene[0], this.moonsNamesOnScene[1], this.moonsNamesOnScene[2],
            this.moonsNamesOnScene[3], this.moonsNamesOnScene[4], this.moonsNamesOnScene[5], this.moonsNamesOnScene[6],
            this.moonsNamesOnScene[7], this.moonsNamesOnScene[8], this.moonsNamesOnScene[9], this.moonsNamesOnScene[10],
            this.moonsNamesOnScene[11], this.moonsNamesOnScene[12], this.moonsNamesOnScene[13], this.moonsNamesOnScene[14]);
    }
}

SidebarManager.prototype.showHideSingleNameOfMoonOnScene = function() {
    var selectedElem = document.getElementById("singleMoonNameSelected");
    var allMoonNamesSelected = document.getElementById("allMoonNamesChecked").checked;
    // -1 is for option with no planet name
    if (selectedElem.value != -1 && allMoonNamesSelected == false) {
        this.scene.remove(this.moonsNamesOnScene[0], this.moonsNamesOnScene[1], this.moonsNamesOnScene[2],
            this.moonsNamesOnScene[3], this.moonsNamesOnScene[4], this.moonsNamesOnScene[5], this.moonsNamesOnScene[6],
            this.moonsNamesOnScene[7], this.moonsNamesOnScene[8], this.moonsNamesOnScene[9], this.moonsNamesOnScene[10],
            this.moonsNamesOnScene[11], this.moonsNamesOnScene[12], this.moonsNamesOnScene[13], this.moonsNamesOnScene[14]);
        this.scene.add(this.moonsNamesOnScene[selectedElem.value]);
    }
}

// Sidebar - functions for planets' orbits
// -------------------------------------------------------------------------
SidebarManager.prototype.showHideAllPlanetOrbitsOnScene = function() {
    if (document.getElementById("allPlanetOrbitsChecked").checked == true) {
        this.scene.add(this.orbits[0], this.orbits[1], this.orbits[2], this.orbits[3],
            this.orbits[4], this.orbits[5], this.orbits[6], this.orbits[7]);
    } else if (document.getElementById("allPlanetOrbitsChecked").checked == false) {
        this.scene.remove(this.orbits[0], this.orbits[1], this.orbits[2], this.orbits[3],
            this.orbits[4], this.orbits[5], this.orbits[6], this.orbits[7]);
    }
}

SidebarManager.prototype.showHideSinglePlanetOrbitOnScene = function() {
    var selectedElem = document.getElementById("singlePlanetOrbitSelected");
    var allPlanetOrbitsSelected = document.getElementById("allPlanetOrbitsChecked").checked;
    // -1 is for option with no planet name
    if (selectedElem.value != -1 && allPlanetOrbitsSelected == false) {
        this.scene.remove(this.orbits[0], this.orbits[1], this.orbits[2], this.orbits[3],
            this.orbits[4], this.orbits[5], this.orbits[6], this.orbits[7]);
        this.scene.add(this.orbits[selectedElem.value]);
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
    closeNav();
}