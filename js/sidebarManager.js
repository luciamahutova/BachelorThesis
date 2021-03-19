class SidebarManager {
    constructor(planetNamesEN, planetNamesCZ, planetNamesSK, moonNamesOnScene, moonMeshes, scene, orbits) {
        this.isSidebarOpen = true;
        this.isAppRunning = true;
        this.planetNamesEN = planetNamesEN;
        this.planetNamesCZ = planetNamesCZ;
        this.planetNamesSK = planetNamesSK;
        this.moonNamesOnScene = moonNamesOnScene;
        this.moonMeshes = moonMeshes;
        this.scene = scene;
        this.orbits = orbits;
        this.pauseTime = this.playTime = Date.now();

        this.pauseApplication();
        this.playApplication();
    }

    getIsAppRunning = function() { return this.isAppRunning; }
    setIsAppRunning = function(value) { this.isAppRunning = value; }
    setPauseTime = function(value) { this.pauseTime = value; }
    getPlayTime = function() { return this.playTime; }
    setPlayTime = function(value) { this.playTime = value; }
    getPlayPauseTimeDifference = function() { return this.playTime - this.pauseTime; }

    // Show/hide sidebars 
    // -------------------------------------------------------------------------
    showHideSidebarToRight() {
        if (!this.isSidebarOpen) {
            this.isSidebarOpen = true;
            document.getElementById("sidebarRight").style.right = "40px";

        } else {
            this.isSidebarOpen = false;
            document.getElementById("sidebarRight").style.right = "-300px";
        }
    }

    hideSidebarToLeft() {
        var physicalTable;
        (document.getElementById("sidebarPlanetInfo").style.left == "40px") ? physicalTable = "sidebarPlanetInfo":
            physicalTable = "sidebarMoonInfo";
        document.getElementById(physicalTable).style.left = "-300px";

        // "window.myParam" - from raycaster.js, represents the last clicked planet/orbit = for clearing the colour        
        if (window.myParam != undefined) {
            var clearObjectColor = window.myParam;
            this.scene.traverse(function(children) {
                if (children.name == clearObjectColor[0].object.name) {
                    children.material.color.set(0xffffff);
                }
            });
        }
    }

    // Menu options - used in simulationPage.html
    // -------------------------------------------------------------------------
    startNewSimulation() {
        var confirmMessage;
        if (document.getElementById("sk").style.fontWeight == "bold") {
            confirmMessage = "Všetky prevedené zmeny budú stratené. Prajete si začať novú simuláciu?"
        } else if (document.getElementById("cz").style.fontWeight == "bold") {
            confirmMessage = "Všechny provedené změny budou ztraceny. Přejete si zahájit novou simulaci?"
        } else { confirmMessage = "All changes will be lost. Do you want to start a new simulation?" }

        if (confirm(confirmMessage)) {
            window.open("simulationPage.html", "_self")
        }
    }

    openInNewTab(id) {
        if (id == "planets") {
            window.open("planetsPage.html", '_blank');
        } else if (id == "about") {
            window.open("infoPage.html", '_blank');
        }
    }

    // Play/pause the application (on click or for active/inactive window)
    // -------------------------------------------------------------------------
    pauseApplication() {
        // playButton, disabled at the beginning
        $('.playButton').prop('disabled', true);
        var isRunning = this.getIsAppRunning();

        if (isRunning) {
            this.setIsAppRunning(false);
            this.setPauseTime(Date.now());
            $(".pauseButton").on("click", function() {
                $('.pauseButton').prop('disabled', true);
                $('.playButton').prop('disabled', false);
                $('#cosmicObjectButton').prop('disabled', true);
                $('#cameraToObjectButton').prop('disabled', true);
            });
        }
    }

    pauseApplicationOnInactiveWindow() {
        this.setIsAppRunning(false);
    }

    playApplication() {
        var isRunning = this.getIsAppRunning();
        if (!isRunning) {
            this.setIsAppRunning(true);
            this.setPlayTime(Date.now());
            $(".playButton").on("click", function() {
                $('.pauseButton').prop('disabled', false);
                $('.playButton').prop('disabled', true);
                $('#cosmicObjectButton').prop('disabled', false);
                $('#cameraToObjectButton').prop('disabled', false);
            });
        }
    }

    playApplicationOnActiveWindow() {
        this.setIsAppRunning(true);
        $('.pauseButton').prop('disabled', false);
        $('.playButton').prop('disabled', true);
    }

    // Sidebar - Confirm button 
    // -------------------------------------------------------------------------
    confirmButtonBehavior() {
        // Cannot add/remove names or orbits in for-cycle, planets will jump to different position
        this.showHideAllPlanetNamesOnScene();
        this.showHideSinglePlanetNameOnScene();
        this.showHideAllMoonNamesOnScene();
        this.showHideSingleMoonNameOnScene();

        this.showHideAllMoonsOnScene();

        this.showHideAllPlanetOrbitsOnScene();
        this.showHideSinglePlanetOrbitOnScene();
        this.showHideAllMoonOrbitsOnScene();
        this.showHideSingleMoonOrbitOnScene();

        this.showHideMoonsOfSinglePlanet();
        this.disableConfirmButtonForMoment();
    }

    disableConfirmButtonForMoment() {
        setTimeout(function() {
            $('.confirmChangesButton').prop('disabled', false);
            document.getElementById("confirm").style.backgroundColor = "#BABABA";
        }, 3000);
        $('.confirmChangesButton').prop('disabled', true);
        document.getElementById("confirm").style.backgroundColor = "#F0F0F0";
    }

    // Sidebar - functions for planet and moon names
    // -------------------------------------------------------------------------
    showHideAllPlanetNamesOnScene() {
        if (document.getElementById("allPlanetNamesChecked").checked == true) {
            this.addPlanetNamesToScene(this.planetNamesEN, "nameEn");
            this.addPlanetNamesToScene(this.planetNamesCZ, "nameCz");
            this.addPlanetNamesToScene(this.planetNamesSK, "nameSk");
        } else if (document.getElementById("allPlanetNamesChecked").checked == false) {
            this.removeObjectsForPlanetsFromScene(this.planetNamesEN);
            this.removeObjectsForPlanetsFromScene(this.planetNamesCZ);
            this.removeObjectsForPlanetsFromScene(this.planetNamesSK);
        }
    }

    showHideSinglePlanetNameOnScene() {
        var selectedElem = document.getElementById("singlePlanetNameSelected");
        var allPlanetNamesSelected = document.getElementById("allPlanetNamesChecked").checked;
        // -1 is for option with no planet name
        if (selectedElem.value != -1 && allPlanetNamesSelected == false) {
            this.removeObjectsForPlanetsFromScene(this.planetNamesEN);
            this.removeObjectsForPlanetsFromScene(this.planetNamesCZ);
            this.removeObjectsForPlanetsFromScene(this.planetNamesSK);
            this.scene.add(this.planetNamesEN[selectedElem.value], this.planetNamesCZ[selectedElem.value],
                this.planetNamesSK[selectedElem.value]);
        }
    }

    showHideAllMoonNamesOnScene() {
        if (document.getElementById("allMoonNamesChecked").checked == true) {
            this.addAllToScene(this.moonNamesOnScene);
        } else if (document.getElementById("allMoonNamesChecked").checked == false) {
            this.removeAllFromScene(this.moonNamesOnScene);
        }
    }

    showHideSingleMoonNameOnScene() {
        var selectedElem = document.getElementById("singleMoonNameSelected");
        var allMoonNamesSelected = document.getElementById("allMoonNamesChecked").checked;

        if (selectedElem.value != -1 && allMoonNamesSelected == false) {
            this.removeAllFromScene(this.moonNamesOnScene);
            this.scene.add(this.moonNamesOnScene[selectedElem.value]);
        }
    }

    // Help functions
    traverseSceneToFindPlanetNames(showBoolean, stringName) {
        this.scene.traverse(function(children) {
            if (children.name.startsWith(stringName)) {
                children.visible = showBoolean;
            }
        });
    }

    addPlanetNamesToScene(objects, stringName) {
        this.scene.add(objects[0], objects[1], objects[2], objects[3], objects[4], objects[5], objects[6], objects[7]);
        // names are set to 'true' in planets.js -> rotateAllPlanets(...) - according to current language
        this.traverseSceneToFindPlanetNames(false, stringName);
    }

    addObjectsForPlanetsToScene(objects) {
        this.scene.add(objects[0], objects[1], objects[2], objects[3], objects[4], objects[5], objects[6], objects[7]);
    }

    removeObjectsForPlanetsFromScene(objects) {
        this.scene.remove(objects[0], objects[1], objects[2], objects[3], objects[4], objects[5], objects[6], objects[7]);
    }

    // Sidebar - functions for moon objects
    // -------------------------------------------------------------------------
    showHideAllMoonsOnScene() {
        if (document.getElementById("allMoonObjectsChecked").checked == true) {
            this.addAllToScene(this.moonMeshes);
            this.addAllMoonOrbitsToScene(this.orbits);
        } else if (document.getElementById("allMoonObjectsChecked").checked == false) {
            this.removeAllFromScene(this.moonMeshes);
            this.removeAllFromScene(this.moonNamesOnScene);
            this.removeAllMoonOrbitsFromScene(this.orbits);
        }
    }

    showHideMoonsOfSinglePlanet() {
        var selectedElem = document.getElementById("singlePlanetSelectedForMoons");
        var allMoonObjectsChecked = document.getElementById("allMoonObjectsChecked").checked;

        if (selectedElem.value != -1 && allMoonObjectsChecked == false) {
            this.removeAllFromScene(this.moonMeshes);
            this.removeAllFromScene(this.moonNamesOnScene);
            this.removeAllMoonOrbitsFromScene(this.orbits);

            document.getElementById("allMoonOrbitsChecked").checked = true;
            if (selectedElem.value == 2) { // Earth
                this.scene.add(this.moonMeshes[0], this.moonNamesOnScene[0], this.orbits[8]);
            } else if (selectedElem.value == 4) { // Jupiter
                this.scene.add(this.moonMeshes[1], this.moonMeshes[2], this.moonMeshes[3], this.moonMeshes[4]);
                this.scene.add(this.moonNamesOnScene[1], this.moonNamesOnScene[2], this.moonNamesOnScene[3], this.moonNamesOnScene[4]);
                this.scene.add(this.orbits[9], this.orbits[10], this.orbits[11], this.orbits[12]);
            } else if (selectedElem.value == 5) { // Saturn
                this.scene.add(this.moonMeshes[5], this.moonMeshes[6]);
                this.scene.add(this.moonNamesOnScene[5], this.moonNamesOnScene[6]);
                this.scene.add(this.orbits[13], this.orbits[14]);
            } else if (selectedElem.value == 6) { // Uranus
                this.scene.add(this.moonMeshes[7], this.moonMeshes[8], this.moonMeshes[9], this.moonMeshes[10]);
                this.scene.add(this.moonNamesOnScene[7], this.moonNamesOnScene[8],
                    this.moonNamesOnScene[9], this.moonNamesOnScene[10]);
                this.scene.add(this.orbits[15], this.orbits[16], this.orbits[17], this.orbits[18]);
            } else if (selectedElem.value == 7) { // Neptune
                this.scene.add(this.moonMeshes[11], this.moonNamesOnScene[11], this.orbits[19]);
            }
        }
    }

    // Helpful functions for moon objects or moon names (textures)
    addAllToScene(objects) {
        this.scene.add(objects[0], objects[1], objects[2], objects[3], objects[4], objects[5], objects[6], objects[7],
            objects[8], objects[9], objects[10], objects[11]);
    }

    removeAllFromScene(objects) {
        this.scene.remove(objects[0], objects[1], objects[2], objects[3], objects[4], objects[5], objects[6], objects[7],
            objects[8], objects[9], objects[10], objects[11]);
    }

    // Sidebar - functions for planets' and moons' orbits
    // -------------------------------------------------------------------------
    showHideAllPlanetOrbitsOnScene() {
        if (document.getElementById("allPlanetOrbitsChecked").checked == true) {
            this.addObjectsForPlanetsToScene(this.orbits);
        } else if (document.getElementById("allPlanetOrbitsChecked").checked == false) {
            this.removeObjectsForPlanetsFromScene(this.orbits);
        }
    }

    showHideSinglePlanetOrbitOnScene() {
        var selectedElem = document.getElementById("singlePlanetOrbitSelected");
        var allPlanetOrbitsSelected = document.getElementById("allPlanetOrbitsChecked").checked;

        if (selectedElem.value != -1 && allPlanetOrbitsSelected == false) {
            this.removeObjectsForPlanetsFromScene(this.orbits);
            this.scene.add(this.orbits[selectedElem.value]);
        }
    }

    showHideAllMoonOrbitsOnScene() {
        if (document.getElementById("allMoonOrbitsChecked").checked == true) {
            this.addAllMoonOrbitsToScene(this.orbits);
        } else if (document.getElementById("allMoonOrbitsChecked").checked == false) {
            this.removeAllMoonOrbitsFromScene(this.orbits);
        }
    }

    showHideSingleMoonOrbitOnScene() {
        var selectedElem = document.getElementById("singleMoonOrbitNameSelected");
        var allMoonOrbitsSelected = document.getElementById("allMoonOrbitsChecked").checked;
        var indexOfOrbit;

        if (selectedElem.value != -1 && allMoonOrbitsSelected == false) {
            this.removeAllMoonOrbitsFromScene(this.orbits);
            indexOfOrbit = parseInt(selectedElem.value) + 8;
            this.scene.add(this.orbits[indexOfOrbit]);
        }
    }

    // Functions for moons' orbits
    addAllMoonOrbitsToScene(objects) {
        this.scene.add(objects[8], objects[9], objects[10], objects[11], objects[12], objects[13], objects[14], objects[15],
            objects[16], objects[17], objects[18], objects[19]);
    }

    removeAllMoonOrbitsFromScene(objects) {
        document.getElementById("allMoonOrbitsChecked").checked = false; // because of f. showHideAllMoonsOnScene() - also hide orbits 
        this.scene.remove(objects[8], objects[9], objects[10], objects[11], objects[12], objects[13], objects[14], objects[15],
            objects[16], objects[17], objects[18], objects[19]);
    }
}

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
    closeNav();
}