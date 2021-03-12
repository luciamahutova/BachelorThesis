class SidebarManager {
    constructor(planetNamesEN, planetNamesCZ, planetNamesSK, moonsNamesOnScene, moonMeshes, scene, orbits) {
        this.isSidebarOpen = true;
        this.isAppRunning = true;
        this.animationFrameOutput = 0;
        this.planetNamesEN = planetNamesEN;
        this.planetNamesCZ = planetNamesCZ;
        this.planetNamesSK = planetNamesSK;
        this.moonsNamesOnScene = moonsNamesOnScene;
        this.moonMeshes = moonMeshes;
        this.scene = scene;
        this.orbits = orbits;
        this.pauseTime = this.playTime = Date.now();

        this.pauseApplication();
        this.playApplication();
    }

    getIsAppRunning = function() { return this.isAppRunning; }
    setIsAppRunning = function(value) { this.isAppRunning = value; }
    getPauseTime = function() { return this.pauseTime; }
    setPauseTime = function(value) { this.pauseTime = value; }
    getPlayTime = function() { return this.playTime; }
    setPlayTime = function(value) { this.playTime = value; }
    getPlayPauseTimeDifference = function() { return this.playTime - this.getPauseTime(); }

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
            scene.traverse(function(children) {
                if (children.name == clearObjectColor[0].object.name) {
                    children.material.color.set(0xffffff);
                }
            });
        }
    }

    // Open in new tab
    // -------------------------------------------------------------------------
    openNewTabForPlanets = function() {
        window.open("planetsPage.html", '_blank');
    }

    openNewTabForInfo = function() {
        window.open("infoPage.html", '_blank');
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
                //window.cancelAnimationFrame(animationFrameOutput);
                $('.pauseButton').prop('disabled', true);
                $('.playButton').prop('disabled', false);
            });
        }
    }

    pauseApplicationOnInactiveWindow() {
        //cancelAnimationFrame(animationFrameOutput);
        this.setIsAppRunning(false);
    }

    playApplication() {
        var isRunning = this.getIsAppRunning();
        if (!isRunning) {
            this.setIsAppRunning(true);
            this.setPlayTime(Date.now());
            $(".playButton").on("click", function() {
                //animationFrameOutput = window.requestAnimationFrame(animate);
                $('.pauseButton').prop('disabled', false);
                $('.playButton').prop('disabled', true);
            });
        }
    }

    playApplicationOnActiveWindow() {
        //animationFrameOutput = requestAnimationFrame(animate);
        this.setIsAppRunning(true);
        $('.pauseButton').prop('disabled', false);
        $('.playButton').prop('disabled', true);
    }

    // Sidebar - Confirm button 
    // -------------------------------------------------------------------------
    confirmButtonBehavior() {
        // Cannot add/remove names or orbits in for-cycle, planets will jump to different position
        this.showHideAllNamesOfPlanetsOnScene();
        this.showHideSingleNameOfPlanetOnScene();
        this.showHideAllNamesOfMoonsOnScene();
        this.showHideSingleNameOfMoonOnScene();

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
    showHideAllNamesOfPlanetsOnScene() {
        if (document.getElementById("allPlanetNamesChecked").checked == true) {
            this.addAllPlanetNamesScene(this.planetNamesEN, "nameEn");
            this.addAllPlanetNamesScene(this.planetNamesCZ, "nameCz");
            this.addAllPlanetNamesScene(this.planetNamesSK, "nameSk");
        } else if (document.getElementById("allPlanetNamesChecked").checked == false) {
            this.removeAllPlanetNamesScene(this.planetNamesEN);
            this.removeAllPlanetNamesScene(this.planetNamesCZ);
            this.removeAllPlanetNamesScene(this.planetNamesSK);
        }
    }

    showHideSingleNameOfPlanetOnScene() {
        var selectedElem = document.getElementById("singlePlanetNameSelected");
        var allPlanetNamesSelected = document.getElementById("allPlanetNamesChecked").checked;
        // -1 is for option with no planet name
        if (selectedElem.value != -1 && allPlanetNamesSelected == false) {
            this.removeAllPlanetNamesScene(this.planetNamesEN);
            this.removeAllPlanetNamesScene(this.planetNamesCZ);
            this.removeAllPlanetNamesScene(this.planetNamesSK);
            this.scene.add(this.planetNamesEN[selectedElem.value], this.planetNamesCZ[selectedElem.value],
                this.planetNamesSK[selectedElem.value]);
        }
    }

    traverseSceneToFindPlanetNames(showBoolean, stringName) {
        this.scene.traverse(function(children) {
            if (children.name.startsWith(stringName)) {
                children.visible = showBoolean;
            }
        });
    }

    addAllPlanetNamesScene(objects, stringName) {
        this.scene.add(objects[0], objects[1], objects[2], objects[3], objects[4], objects[5], objects[6], objects[7]);
        // names are set to 'true' in planets.js -> rotateAllPlanets(...) - according to current language
        this.traverseSceneToFindPlanetNames(false, stringName);
    }

    removeAllPlanetNamesScene(objects) {
        this.scene.remove(objects[0], objects[1], objects[2], objects[3], objects[4], objects[5], objects[6], objects[7]);
    }

    showHideAllNamesOfMoonsOnScene() {
        if (document.getElementById("allMoonNamesChecked").checked == true) {
            this.addAllToScene(this.moonsNamesOnScene);
        } else if (document.getElementById("allMoonNamesChecked").checked == false) {
            this.removeAllFromScene(this.moonsNamesOnScene);
        }
    }

    showHideSingleNameOfMoonOnScene() {
        var selectedElem = document.getElementById("singleMoonNameSelected");
        var allMoonNamesSelected = document.getElementById("allMoonNamesChecked").checked;

        if (selectedElem.value != -1 && allMoonNamesSelected == false) {
            this.removeAllFromScene(this.moonsNamesOnScene);
            this.scene.add(this.moonsNamesOnScene[selectedElem.value]);
        }
    }

    // Sidebar - functions for moon objects
    // -------------------------------------------------------------------------
    showHideAllMoonsOnScene() {
        if (document.getElementById("allMoonObjectsChecked").checked == true) {
            this.addAllToScene(this.moonMeshes);
            this.addAllMoonOrbitsToScene(this.orbits);
        } else if (document.getElementById("allMoonObjectsChecked").checked == false) {
            this.removeAllFromScene(this.moonMeshes);
            this.removeAllFromScene(this.moonsNamesOnScene);
            this.removeAllMoonOrbitsFromScene(this.orbits);
        }
    }

    showHideMoonsOfSinglePlanet() {
        var selectedElem = document.getElementById("singlePlanetSelectedForMoons");
        var allMoonObjectsChecked = document.getElementById("allMoonObjectsChecked").checked;

        if (selectedElem.value != -1 && allMoonObjectsChecked == false) {
            this.removeAllFromScene(this.moonMeshes);
            this.removeAllFromScene(this.moonsNamesOnScene);
            this.removeAllMoonOrbitsFromScene(this.orbits);

            document.getElementById("allMoonOrbitsChecked").checked = true;
            if (selectedElem.value == 2) { // Earth
                this.scene.add(this.moonMeshes[0], this.moonsNamesOnScene[0], this.orbits[8]);
            } else if (selectedElem.value == 4) { // Jupiter
                this.scene.add(this.moonMeshes[1], this.moonMeshes[2], this.moonMeshes[3], this.moonMeshes[4]);
                this.scene.add(this.moonsNamesOnScene[1], this.moonsNamesOnScene[2], this.moonsNamesOnScene[3], this.moonsNamesOnScene[4]);
                this.scene.add(this.orbits[9], this.orbits[10], this.orbits[11], this.orbits[12]);
            } else if (selectedElem.value == 5) { // Saturn
                this.scene.add(this.moonMeshes[5], this.moonMeshes[6]);
                this.scene.add(this.moonsNamesOnScene[5], this.moonsNamesOnScene[6]);
                this.scene.add(this.orbits[13], this.orbits[14]);
            } else if (selectedElem.value == 6) { // Uranus
                this.scene.add(this.moonMeshes[7], this.moonMeshes[8], this.moonMeshes[9], this.moonMeshes[10]);
                this.scene.add(this.moonsNamesOnScene[7], this.moonsNamesOnScene[8],
                    this.moonsNamesOnScene[9], this.moonsNamesOnScene[10]);
                this.scene.add(this.orbits[15], this.orbits[16], this.orbits[17], this.orbits[18]);
            } else if (selectedElem.value == 7) { // Neptune
                this.scene.add(this.moonMeshes[11], this.moonsNamesOnScene[11], this.orbits[19]);
            }
        }
    }

    // Help functions for moon objects or moon names (textures)
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
            this.scene.add(this.orbits[0], this.orbits[1], this.orbits[2], this.orbits[3],
                this.orbits[4], this.orbits[5], this.orbits[6], this.orbits[7]);
        } else if (document.getElementById("allPlanetOrbitsChecked").checked == false) {
            this.scene.remove(this.orbits[0], this.orbits[1], this.orbits[2], this.orbits[3],
                this.orbits[4], this.orbits[5], this.orbits[6], this.orbits[7]);
        }
    }

    showHideSinglePlanetOrbitOnScene() {
        var selectedElem = document.getElementById("singlePlanetOrbitSelected");
        var allPlanetOrbitsSelected = document.getElementById("allPlanetOrbitsChecked").checked;
        // -1 is for option with no planet name
        if (selectedElem.value != -1 && allPlanetOrbitsSelected == false) {
            this.scene.remove(this.orbits[0], this.orbits[1], this.orbits[2], this.orbits[3],
                this.orbits[4], this.orbits[5], this.orbits[6], this.orbits[7]);
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
        // -1 is for option with no planet name
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