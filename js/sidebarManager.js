class SidebarManager {
    constructor(planetNamesEN, planetNamesCZ, planetNamesSK, moonNamesOnScene, translatedMoonNames, moonMeshes, scene, orbits) {
        this.isSidebarOpen = true;
        this.isAppRunning = true;
        this.planetNamesEN = planetNamesEN;
        this.planetNamesCZ = planetNamesCZ;
        this.planetNamesSK = planetNamesSK;
        this.moonNamesOnScene = moonNamesOnScene;
        this.translatedMoonNames = translatedMoonNames;
        this.moonMeshes = moonMeshes;
        this.scene = scene;
        this.orbits = orbits;
        this.pauseTime = this.playTime = Date.now();

        this.pauseApplication();
        this.playApplication();
    }

    // Get()
    getIsSidebarOpen() { return this.isSidebarOpen }
    getIsAppRunning() { return this.isAppRunning }
    getPlayTime() { return this.playTime }
    getPlayPauseTimeDifference() { return this.playTime - this.pauseTime }
    getScene() { return this.scene }
    getPlanetNamesEN() { return this.planetNamesEN }
    getPlanetNamesCZ() { return this.planetNamesCZ }
    getPlanetNamesSK() { return this.planetNamesSK }
    getMoonNamesOnScene() { return this.moonNamesOnScene }
    getTranslatedMoonNames() { return this.translatedMoonNames }
    getMoonMeshes() { return this.moonMeshes }
    getOrbits() { return this.orbits }

    // Set()
    setIsSidebarOpen(boolean) { this.isSidebarOpen = boolean }
    setIsAppRunning(boolean) { this.isAppRunning = boolean }
    setPauseTime(value) { this.pauseTime = value }
    setPlayTime(value) { this.playTime = value }

    // Show/hide sidebars 
    // -------------------------------------------------------------------------
    showHideSidebarToRight() {
        if (!(this.getIsSidebarOpen())) {
            this.setIsSidebarOpen(true);
            document.getElementById("sidebarRight").style.right = "40px";

        } else {
            this.setIsSidebarOpen(false);
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
            (this.getScene()).traverse(function(children) {
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
                $('#rangesliderSpeedInput').prop('disabled', true);
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
                $('#rangesliderSpeedInput').prop('disabled', false);
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
        this.showHideSinglePlanetNameOnScene(this.getPlanetNamesEN(), this.getPlanetNamesCZ(), this.getPlanetNamesSK());
        this.showHideAllMoonNamesOnScene(this.getTranslatedMoonNames());
        this.showHideSingleMoonNameOnScene(this.getMoonNamesOnScene(), this.getTranslatedMoonNames());

        this.showHideAllPlanetOrbitsOnScene();
        this.showHideSinglePlanetOrbitOnScene(this.getOrbits());
        this.showHideAllMoonOrbitsOnScene();
        this.showHideSingleMoonOrbitOnScene(this.getOrbits());

        this.showHideAllMoonsOnScene(this.getTranslatedMoonNames());
        this.showHideMoonsOfSinglePlanet(this.getMoonMeshes(), this.getMoonNamesOnScene(),
            this.getTranslatedMoonNames(), this.getOrbits());

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
            this.addPlanetNamesToScene(this.getPlanetNamesEN());
            this.addPlanetNamesToScene(this.getPlanetNamesCZ());
            this.addPlanetNamesToScene(this.getPlanetNamesSK());
        } else if (document.getElementById("allPlanetNamesChecked").checked == false) {
            this.removeObjectsForPlanetsFromScene(this.getPlanetNamesEN());
            this.removeObjectsForPlanetsFromScene(this.getPlanetNamesCZ());
            this.removeObjectsForPlanetsFromScene(this.getPlanetNamesSK());
        }
    }

    showHideSinglePlanetNameOnScene(planetNamesEN, planetNamesCZ, planetNamesSK) {
        var selectedElem = document.getElementById("singlePlanetNameSelected");
        var allPlanetNamesSelected = document.getElementById("allPlanetNamesChecked").checked;
        // -1 is for option with no planet name
        if (selectedElem.value != -1 && allPlanetNamesSelected == false) {
            this.removeObjectsForPlanetsFromScene(planetNamesEN);
            this.removeObjectsForPlanetsFromScene(planetNamesCZ);
            this.removeObjectsForPlanetsFromScene(planetNamesSK);
            (this.getScene()).add(planetNamesEN[selectedElem.value], planetNamesCZ[selectedElem.value],
                planetNamesSK[selectedElem.value]);
        }
    }

    showHideAllMoonNamesOnScene(translatedMoonNames) {
        if (document.getElementById("allMoonNamesChecked").checked == true) {
            this.addAllToScene(this.getMoonNamesOnScene());
            (this.getScene()).add(translatedMoonNames[0], translatedMoonNames[1]);
        } else if (document.getElementById("allMoonNamesChecked").checked == false) {
            this.removeAllFromScene(this.getMoonNamesOnScene());
            (this.getScene()).remove(translatedMoonNames[0], translatedMoonNames[1]);
        }
    }

    showHideSingleMoonNameOnScene(moonNamesOnScene, translatedMoonNames) {
        var selectedElem = document.getElementById("singleMoonNameSelected");
        var allMoonNamesSelected = document.getElementById("allMoonNamesChecked").checked;

        if (selectedElem.value != -1 && allMoonNamesSelected == false) {
            this.removeAllFromScene(moonNamesOnScene);
            (this.getScene()).add(moonNamesOnScene[selectedElem.value]);
            if (document.getElementById("cz").style.fontWeight == "bold" && selectedElem.value == 0) {
                (this.getScene()).add(translatedMoonNames[0]);
            } else if (document.getElementById("sk").style.fontWeight == "bold" && selectedElem.value == 0) {
                (this.getScene()).add(translatedMoonNames[1]);
            }
        }
    }

    // Help functions
    traverseSceneToFindPlanetNames(showBoolean, stringName) {
        (this.getScene()).traverse(function(children) {
            if (children.name.startsWith(stringName)) {
                children.visible = showBoolean;
            }
        });
    }

    addPlanetNamesToScene(objects) {
        (this.getScene()).add(objects[0], objects[1], objects[2], objects[3], objects[4], objects[5], objects[6], objects[7]);
    }

    removeObjectsForPlanetsFromScene(objects) {
        (this.getScene()).remove(objects[0], objects[1], objects[2], objects[3], objects[4], objects[5], objects[6], objects[7]);
    }

    // Sidebar - functions for moon objects
    // -------------------------------------------------------------------------
    showHideAllMoonsOnScene(translatedMoonNames) {
        if (document.getElementById("allMoonObjectsChecked").checked == true) {
            this.addAllToScene(this.getMoonMeshes());
            this.addAllMoonOrbitsToScene(this.getOrbits());
        } else if (document.getElementById("allMoonObjectsChecked").checked == false) {
            this.removeAllFromScene(this.getMoonMeshes());
            this.removeAllFromScene(this.getMoonNamesOnScene());
            this.removeAllMoonOrbitsFromScene(this.getOrbits());
            (this.getScene()).remove(translatedMoonNames[0], translatedMoonNames[1]);
        }
    }

    showHideMoonsOfSinglePlanet(moonMeshes, moonNamesOnScene, translatedMoonNames, orbits) {
        var selectedElem = document.getElementById("singlePlanetSelectedForMoons");
        var selectedMoonNameValue = document.getElementById("singleMoonNameSelected").value;
        var selectedMoonOrbitValue = document.getElementById("singleMoonOrbitNameSelected").value;
        var allMoonObjectsChecked = document.getElementById("allMoonObjectsChecked").checked;

        if (selectedElem.value != -1 && allMoonObjectsChecked == false) {
            this.removeAllFromScene(moonMeshes);
            this.removeAllFromScene(moonNamesOnScene);
            this.removeAllMoonOrbitsFromScene(orbits);
            this.disableDropDownOptionsMoonNames(true);
            this.disableDropDownOptionsMoonOrbits(true);

            if (selectedElem.value == 2) { // Earth
                this.enableSingleDropDownOption("earthMoonName", "earthMoonOrbit");
                (this.getScene()).add(moonMeshes[0]);

                this.addEnabledObjectsForEarth(selectedMoonNameValue, selectedMoonOrbitValue, moonNamesOnScene,
                    translatedMoonNames, orbits);
            } else if (selectedElem.value == 4) { // Jupiter
                this.enableSingleDropDownOption("jupiterIoName", "jupiterIoOrbit");
                this.enableSingleDropDownOption("jupiterEuropaName", "jupiterEuropaOrbit");
                this.enableSingleDropDownOption("jupiterGanymedeName", "jupiterGanymedeOrbit");
                this.enableSingleDropDownOption("jupiterCallistoName", "jupiterCallistoOrbit");
                (this.getScene()).add(moonMeshes[1], moonMeshes[2], moonMeshes[3], moonMeshes[4]);

                var moonIdNames = ["jupiterIoName", "jupiterEuropaName", "jupiterGanymedeName", "jupiterCallistoName"];
                var moonIdOrbits = ["jupiterIoOrbit", "jupiterEuropaOrbit", "jupiterGanymedeOrbit", "jupiterCallistoOrbit"];
                this.addEnabledObjectsForJupiterUranus("allMoonNamesChecked", moonIdNames, moonNamesOnScene, 1, selectedMoonNameValue, 1);
                this.addEnabledObjectsForJupiterUranus("allMoonOrbitsChecked", moonIdOrbits, orbits, 9, selectedMoonOrbitValue, 1);
            } else if (selectedElem.value == 5) { // Saturn
                this.enableSingleDropDownOption("saturnRheaName", "saturnRheaOrbit");
                this.enableSingleDropDownOption("saturnTitanName", "saturnTitanOrbit");
                (this.getScene()).add(moonMeshes[5], moonMeshes[6]);

                this.addEnabledObjectsForSaturn("allMoonNamesChecked", "saturnRheaName", moonNamesOnScene, 5, selectedMoonNameValue);
                this.addEnabledObjectsForSaturn("allMoonOrbitsChecked", "saturnRheaOrbit", orbits, 13, selectedMoonOrbitValue);
            } else if (selectedElem.value == 6) { // Uranus
                this.enableSingleDropDownOption("uranusArielName", "uranusArielOrbit");
                this.enableSingleDropDownOption("uranusUmbrielName", "uranusUmbrielOrbit");
                this.enableSingleDropDownOption("uranusTitaniaName", "uranusTitaniaOrbit");
                this.enableSingleDropDownOption("uranusOberonName", "uranusOberonOrbit");
                (this.getScene()).add(moonMeshes[7], moonMeshes[8], moonMeshes[9], moonMeshes[10]);

                var moonIdNames = ["uranusArielName", "uranusUmbrielName", "uranusTitaniaName", "uranusOberonName"];
                var moonIdOrbits = ["uranusArielOrbit", "uranusUmbrielOrbit", "uranusTitaniaOrbit", "uranusOberonOrbit"];
                this.addEnabledObjectsForJupiterUranus("allMoonNamesChecked", moonIdNames, moonNamesOnScene, 7, selectedMoonNameValue, 7);
                this.addEnabledObjectsForJupiterUranus("allMoonOrbitsChecked", moonIdOrbits, orbits, 15, selectedMoonOrbitValue, 7);
            } else if (selectedElem.value == 7) { // Neptune
                this.enableSingleDropDownOption("neptuneTritonName", "neptuneTritonOrbit");
                (this.getScene()).add(moonMeshes[11]);

                this.addEnabledObjectsForNeptune("allMoonNamesChecked", "neptuneTritonName", moonNamesOnScene, 11, selectedMoonNameValue);
                this.addEnabledObjectsForNeptune("allMoonOrbitsChecked", "neptuneTritonOrbit", orbits, 19, selectedMoonOrbitValue);
            }
        } else {
            this.disableDropDownOptionsMoonNames(false);
            this.disableDropDownOptionsMoonOrbits(false);
        }
    }

    // Disable drop-down options for moon names/orbits of hidden moons
    disableDropDownOptionsMoonNames(boolean) {
        $('#earthMoonName').prop('disabled', boolean);
        $('#jupiterIoName').prop('disabled', boolean);
        $('#jupiterEuropaName').prop('disabled', boolean);
        $('#jupiterGanymedeName').prop('disabled', boolean);
        $('#jupiterCallistoName').prop('disabled', boolean);
        $('#saturnRheaName').prop('disabled', boolean);
        $('#saturnTitanName').prop('disabled', boolean);
        $('#uranusArielName').prop('disabled', boolean);
        $('#uranusUmbrielName').prop('disabled', boolean);
        $('#uranusTitaniaName').prop('disabled', boolean);
        $('#uranusOberonName').prop('disabled', boolean);
        $('#neptuneTritonName').prop('disabled', boolean);
    }

    disableDropDownOptionsMoonOrbits(boolean) {
        $('#earthMoonOrbit').prop('disabled', boolean);
        $('#jupiterIoOrbit').prop('disabled', boolean);
        $('#jupiterEuropaOrbit').prop('disabled', boolean);
        $('#jupiterGanymedeOrbit').prop('disabled', boolean);
        $('#jupiterCallistoOrbit').prop('disabled', boolean);
        $('#saturnRheaOrbit').prop('disabled', boolean);
        $('#saturnTitanOrbit').prop('disabled', boolean);
        $('#uranusArielOrbit').prop('disabled', boolean);
        $('#uranusUmbrielOrbit').prop('disabled', boolean);
        $('#uranusTitaniaOrbit').prop('disabled', boolean);
        $('#uranusOberonOrbit').prop('disabled', boolean);
        $('#neptuneTritonOrbit').prop('disabled', boolean);
    }

    enableSingleDropDownOption(nameId, orbitId) {
        $("#" + nameId).prop('disabled', false);
        $("#" + orbitId).prop('disabled', false);
    }

    // Add only enabled moon names/orbits for selected planet
    addEnabledObjectsForEarth(selectedMoonNameValue, selectedMoonOrbitValue, moonNamesOnScene, translatedMoonNames, orbits) {
        // Names
        if (document.getElementById("allMoonNamesChecked").checked == true) {
            (this.getScene()).add(moonNamesOnScene[0], translatedMoonNames[0], translatedMoonNames[1]);
        } else {
            if (selectedMoonNameValue == 0) {
                (this.getScene()).add(moonNamesOnScene[0], translatedMoonNames[0], translatedMoonNames[1]);
            }
        }
        // Orbits
        if (document.getElementById("allMoonOrbitsChecked").checked == true) {
            (this.getScene()).add(orbits[8]);
        } else {
            if (selectedMoonOrbitValue == 0) {
                (this.getScene()).add(orbits[8]);
            }
        }
    }

    addEnabledObjectsForJupiterUranus(dropDownId, idNameMoons, objects, firstIndex, nameOrOrbit, nameOrOrbitIndex) {
        if (document.getElementById(dropDownId).checked == true) {
            (this.getScene()).add(objects[firstIndex], objects[firstIndex + 1], objects[firstIndex + 2], objects[firstIndex + 3]);
        } else {
            if (!document.getElementById(idNameMoons[0]).disabled && nameOrOrbit == nameOrOrbitIndex) {
                (this.getScene()).add(objects[firstIndex]);
            } else if (!document.getElementById(idNameMoons[1]).disabled && nameOrOrbit == nameOrOrbitIndex + 1) {
                (this.getScene()).add(objects[firstIndex + 1]);
            } else if (!document.getElementById(idNameMoons[2]).disabled && nameOrOrbit == nameOrOrbitIndex + 2) {
                (this.getScene()).add(objects[firstIndex + 2]);
            } else if (!document.getElementById(idNameMoons[3]).disabled && nameOrOrbit == nameOrOrbitIndex + 3) {
                (this.getScene()).add(objects[firstIndex + 3]);
            }
        }
    }

    addEnabledObjectsForSaturn(dropDownId, elemId, objects, firstIndex, nameOrOrbit) {
        if (document.getElementById(dropDownId).checked == true) {
            (this.getScene()).add(objects[firstIndex], objects[firstIndex + 1]);
        } else {
            if (!document.getElementById(elemId).disabled && nameOrOrbit == 5) {
                (this.getScene()).add(objects[firstIndex]);
            } else if (!document.getElementById(elemId).disabled && nameOrOrbit == 6) {
                (this.getScene()).add(objects[firstIndex + 1]);
            }
        }
    }

    addEnabledObjectsForNeptune(dropDownId, elemId, objects, objectIndex, nameOrOrbit) {
        if (document.getElementById(dropDownId).checked == true) {
            (this.getScene()).add(objects[objectIndex]);
        } else {
            if (!document.getElementById(elemId).disabled && nameOrOrbit == 11) {
                (this.getScene()).add(objects[objectIndex]);
            }
        }
    }

    // Helpful functions for moon objects or moon names (textures)
    addAllToScene(objects) {
        (this.getScene()).add(objects[0], objects[1], objects[2], objects[3], objects[4], objects[5], objects[6], objects[7],
            objects[8], objects[9], objects[10], objects[11]);
    }

    removeAllFromScene(objects) {
        (this.getScene()).remove(objects[0], objects[1], objects[2], objects[3], objects[4], objects[5], objects[6], objects[7],
            objects[8], objects[9], objects[10], objects[11]);
    }

    // Sidebar - functions for planets' and moons' orbits
    // -------------------------------------------------------------------------
    showHideAllPlanetOrbitsOnScene() {
        var objects = this.getOrbits();
        if (document.getElementById("allPlanetOrbitsChecked").checked == true) {
            (this.getScene()).add(objects[0], objects[1], objects[2], objects[3], objects[4], objects[5], objects[6], objects[7]);
        } else if (document.getElementById("allPlanetOrbitsChecked").checked == false) {
            this.removeObjectsForPlanetsFromScene(this.getOrbits());
        }
    }

    showHideSinglePlanetOrbitOnScene(orbits) {
        var selectedElem = document.getElementById("singlePlanetOrbitSelected");
        var allPlanetOrbitsSelected = document.getElementById("allPlanetOrbitsChecked").checked;

        if (selectedElem.value != -1 && allPlanetOrbitsSelected == false) {
            this.removeObjectsForPlanetsFromScene(orbits);
            (this.getScene()).add(orbits[selectedElem.value]);
        }
    }

    showHideAllMoonOrbitsOnScene() {
        if (document.getElementById("allMoonOrbitsChecked").checked == true) {
            this.addAllMoonOrbitsToScene(this.getOrbits());
        } else if (document.getElementById("allMoonOrbitsChecked").checked == false) {
            this.removeAllMoonOrbitsFromScene(this.getOrbits());
        }
    }

    showHideSingleMoonOrbitOnScene(orbits) {
        var selectedElem = document.getElementById("singleMoonOrbitNameSelected");
        var allMoonOrbitsSelected = document.getElementById("allMoonOrbitsChecked").checked;
        var indexOfOrbit;

        if (selectedElem.value != -1 && allMoonOrbitsSelected == false) {
            this.removeAllMoonOrbitsFromScene(orbits);
            indexOfOrbit = parseInt(selectedElem.value) + 8;
            (this.getScene()).add(orbits[indexOfOrbit]);
        }
    }

    // Functions for moons' orbits
    addAllMoonOrbitsToScene(objects) {
        if (document.getElementById("allMoonOrbitsChecked").checked == true) {
            (this.getScene()).add(objects[8], objects[9], objects[10], objects[11], objects[12], objects[13], objects[14], objects[15],
                objects[16], objects[17], objects[18], objects[19]);
        }
    }

    removeAllMoonOrbitsFromScene(objects) {
        (this.getScene()).remove(objects[8], objects[9], objects[10], objects[11], objects[12], objects[13], objects[14], objects[15],
            objects[16], objects[17], objects[18], objects[19]);
    }
}

// Script for menu 
// -------------------------------------------------------------------------
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

// Open 2nd simulation in new window and close the duplicate simulation,
// so opened page is not overwritten and close because of duplicate window
// -------------------------------------------------------------------------
function openInNewTab(id) {
    if (id == "ssm") {
        window.open("simulationPage.html", '_blank');
    }
}