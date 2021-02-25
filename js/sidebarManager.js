class SidebarManager {
    constructor(planetsNamesOnScene, moonsNamesOnScene, moonMeshes, scene, orbits) {
        this.isSidebarOpen = true;
        this.isLeftSidebarOpen = true;
        this.isAppRunning = true;
        this.animationFrameOutput = 0;
        this.planetsNamesOnScene = planetsNamesOnScene;
        this.moonsNamesOnScene = moonsNamesOnScene;
        this.moonMeshes = moonMeshes;
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
            scene.traverse(function(children) {
                if (children.name == clearObjectColor[0].object.name) {
                    children.material.color.set(0xffffff);
                }
            });
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

    this.showHideAllMoonsOnScene();
    this.showHideMoonsOfSinglePlanet();

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
        this.removeAllNamesScene(this.planetsNamesOnScene);
    }
}

SidebarManager.prototype.showHideSingleNameOfPlanetOnScene = function() {
    var selectedElem = document.getElementById("singlePlanetNameSelected");
    var allPlanetNamesSelected = document.getElementById("allPlanetNamesChecked").checked;
    // -1 is for option with no planet name
    if (selectedElem.value != -1 && allPlanetNamesSelected == false) {
        this.removeAllNamesScene(this.planetsNamesOnScene);
        this.scene.add(this.planetsNamesOnScene[selectedElem.value]);
    }
}

SidebarManager.prototype.showHideAllNamesOfMoonsOnScene = function() {
    if (document.getElementById("allMoonNamesChecked").checked == true) {
        this.addAllToScene(this.moonsNamesOnScene);
    } else if (document.getElementById("allMoonNamesChecked").checked == false) {
        this.removeAllToScene(this.moonsNamesOnScene);
    }
}

SidebarManager.prototype.showHideSingleNameOfMoonOnScene = function() {
    var selectedElem = document.getElementById("singleMoonNameSelected");
    var allMoonNamesSelected = document.getElementById("allMoonNamesChecked").checked;

    if (selectedElem.value != -1 && allMoonNamesSelected == false) {
        this.removeAllToScene(this.moonsNamesOnScene);
        this.scene.add(this.moonsNamesOnScene[selectedElem.value]);
    }
}

// Function for removing all planet names
SidebarManager.prototype.removeAllNamesScene = function(objects) {
    this.scene.remove(objects[0], objects[1], objects[2], objects[3], objects[4], objects[5], objects[6], objects[7]);
}

// Functions for moons or moon names (textures)
SidebarManager.prototype.addAllToScene = function(objects) {
    this.scene.add(objects[0], objects[1], objects[2], objects[3], objects[4], objects[5], objects[6], objects[7],
        objects[8], objects[9], objects[10], objects[11], objects[12], objects[13], objects[14]);
}

SidebarManager.prototype.removeAllToScene = function(objects) {
    this.scene.remove(objects[0], objects[1], objects[2], objects[3], objects[4], objects[5], objects[6], objects[7],
        objects[8], objects[9], objects[10], objects[11], objects[12], objects[13], objects[14]);
}

// Sidebar - functions for moons
// -------------------------------------------------------------------------
SidebarManager.prototype.showHideAllMoonsOnScene = function() {
    if (document.getElementById("allMoonObjectsChecked").checked == true) {
        this.addAllToScene(this.moonMeshes);
    } else if (document.getElementById("allMoonObjectsChecked").checked == false) {
        this.removeAllToScene(this.moonMeshes);
        this.removeAllToScene(this.moonsNamesOnScene);
    }
}

SidebarManager.prototype.showHideMoonsOfSinglePlanet = function() {
    var selectedElem = document.getElementById("singlePlanetSelectedForMoons");
    var allMoonObjectsChecked = document.getElementById("allMoonObjectsChecked").checked;

    if (selectedElem.value != -1 && allMoonObjectsChecked == false) {
        this.removeAllToScene(this.moonMeshes);
        this.removeAllToScene(this.moonsNamesOnScene);
        if (selectedElem.value == 2) {
            this.scene.add(this.moonMeshes[0], this.moonsNamesOnScene[0]);
        } else if (selectedElem.value == 4) {
            this.scene.add(this.moonMeshes[1], this.moonMeshes[2], this.moonMeshes[3], this.moonMeshes[4]);
            this.scene.add(this.moonsNamesOnScene[1], this.moonsNamesOnScene[2], this.moonsNamesOnScene[3], this.moonsNamesOnScene[4]);
        } else if (selectedElem.value == 5) {
            this.scene.add(this.moonMeshes[5], this.moonMeshes[6], this.moonMeshes[7], this.moonMeshes[8], this.moonMeshes[9]);
            this.scene.add(this.moonsNamesOnScene[5], this.moonsNamesOnScene[6], this.moonsNamesOnScene[7],
                this.moonsNamesOnScene[8], this.moonsNamesOnScene[9]);
        } else if (selectedElem.value == 6) {
            this.scene.add(this.moonMeshes[10], this.moonMeshes[11], this.moonMeshes[12], this.moonMeshes[12]);
            this.scene.add(this.moonsNamesOnScene[10], this.moonsNamesOnScene[11],
                this.moonsNamesOnScene[12], this.moonsNamesOnScene[12]);
        } else if (selectedElem.value == 7) {
            this.scene.add(this.moonMeshes[14], this.moonsNamesOnScene[14]);
        }
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