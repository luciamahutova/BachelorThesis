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
        $('#cosmicObjectButton').prop('disabled', false);
        $('#cameraToObjectButton').prop('disabled', false);
        $('#rangesliderSpeedInput').prop('disabled', false);
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
        this.showHideAllPlanetNamesOnScene(this.getPlanetNamesEN(), this.getPlanetNamesCZ(), this.getPlanetNamesSK());
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
    showHideAllPlanetNamesOnScene(namesEN, namesCZ, namesSK) {
        if (document.getElementById("allPlanetNamesChecked").checked == true) {
            (this.getScene()).add(namesEN[0], namesEN[1], namesEN[2], namesEN[3], namesEN[4], namesEN[5], namesEN[6], namesEN[7]);
            (this.getScene()).add(namesCZ[0], namesCZ[1], namesCZ[2], namesCZ[3], namesCZ[4], namesCZ[5], namesCZ[6], namesCZ[7]);
            (this.getScene()).add(namesSK[0], namesSK[1], namesSK[2], namesSK[3], namesSK[4], namesSK[5], namesSK[6], namesSK[7]);
        } else if (document.getElementById("allPlanetNamesChecked").checked == false) {
            (this.getScene()).remove(namesEN[0], namesEN[1], namesEN[2], namesEN[3], namesEN[4], namesEN[5], namesEN[6], namesEN[7]);
            (this.getScene()).remove(namesCZ[0], namesCZ[1], namesCZ[2], namesCZ[3], namesCZ[4], namesCZ[5], namesCZ[6], namesCZ[7]);
            (this.getScene()).remove(namesSK[0], namesSK[1], namesSK[2], namesSK[3], namesSK[4], namesSK[5], namesSK[6], namesSK[7]);
        }
    }

    showHideSinglePlanetNameOnScene(namesEN, namesCZ, namesSK) {
        var selectedElem = document.getElementById("singlePlanetNameSelected");
        var allPlanetNamesSelected = document.getElementById("allPlanetNamesChecked").checked;
        // -1 is for option with no planet name
        if (selectedElem.value != -1 && allPlanetNamesSelected == false) {
            (this.getScene()).remove(namesEN[0], namesEN[1], namesEN[2], namesEN[3], namesEN[4], namesEN[5], namesEN[6], namesEN[7]);
            (this.getScene()).remove(namesCZ[0], namesCZ[1], namesCZ[2], namesCZ[3], namesCZ[4], namesCZ[5], namesCZ[6], namesCZ[7]);
            (this.getScene()).remove(namesSK[0], namesSK[1], namesSK[2], namesSK[3], namesSK[4], namesSK[5], namesSK[6], namesSK[7]);
            (this.getScene()).add(namesEN[selectedElem.value], namesCZ[selectedElem.value], namesSK[selectedElem.value]);
        }
    }

    showHideAllMoonNamesOnScene(translatedMoonNames) {
        if (document.getElementById("allMoonNamesChecked").checked == true) {
            this.showAllMoonObjects(this.getMoonNamesOnScene(), true);
            (this.getScene()).add(translatedMoonNames[0], translatedMoonNames[1]);
        } else if (document.getElementById("allMoonNamesChecked").checked == false) {
            this.showAllMoonObjects(this.getMoonNamesOnScene(), false);
            (this.getScene()).remove(translatedMoonNames[0], translatedMoonNames[1]);
        }
    }

    showHideSingleMoonNameOnScene(moonNamesOnScene, translatedMoonNames) {
        var selectedElem = document.getElementById("singleMoonNameSelected");
        var allMoonNamesSelected = document.getElementById("allMoonNamesChecked").checked;

        if (selectedElem.value != -1 && allMoonNamesSelected == false) {
            this.showAllMoonObjects(moonNamesOnScene, false);
            moonNamesOnScene[selectedElem.value].visible = true;
            if (document.getElementById("cz").style.fontWeight == "bold" && selectedElem.value == 0) {
                (this.getScene()).add(translatedMoonNames[0]);
            } else if (document.getElementById("sk").style.fontWeight == "bold" && selectedElem.value == 0) {
                (this.getScene()).add(translatedMoonNames[1]);
            }
        }
    }

    showAllPlanetObjects(objects, boolean) {
        (this.getScene()).traverse(function(children) {
            if (children == objects[0] || children == objects[1] || children == objects[2] || children == objects[3] ||
                children == objects[4] || children == objects[5] || children == objects[6] || children == objects[7]) {
                children.visible = boolean;
            }
        });
    }

    // Sidebar - functions for moon objects
    // -------------------------------------------------------------------------
    showHideAllMoonsOnScene(translatedMoonNames) {
        if (document.getElementById("allMoonObjectsChecked").checked == true) {
            this.showAllMoonObjects(this.getMoonMeshes(), true);
            if (document.getElementById("allMoonOrbitsChecked").checked == true) {
                this.showAllMoonOrbits(this.getOrbits(), true);
            }
        } else if (document.getElementById("allMoonObjectsChecked").checked == false) {
            this.showAllMoonObjects(this.getMoonMeshes(), false);
            this.showAllMoonObjects(this.getMoonNamesOnScene(), false);
            this.showAllMoonOrbits(this.getOrbits(), false);
            (this.getScene()).remove(translatedMoonNames[0], translatedMoonNames[1]);
        }
    }

    showHideMoonsOfSinglePlanet(moonMeshes, moonNamesOnScene, translatedMoonNames, orbits) {
        var selectedElem = document.getElementById("singlePlanetSelectedForMoons");
        var selectedMoonNameValue = document.getElementById("singleMoonNameSelected").value;
        var selectedMoonOrbitValue = document.getElementById("singleMoonOrbitNameSelected").value;
        var allMoonObjectsChecked = document.getElementById("allMoonObjectsChecked").checked;

        if (selectedElem.value != -1 && allMoonObjectsChecked == false) {
            this.showAllMoonObjects(moonMeshes, false);
            this.showAllMoonObjects(moonNamesOnScene, false);
            this.showAllMoonOrbits(this.getOrbits(), false);
            this.disableDropDownOptionsMoonNames(true);
            this.disableDropDownOptionsMoonOrbits(true);

            if (selectedElem.value == 2) { // Earth
                this.enableSingleDropDownOption("earthMoonName", "earthMoonOrbit");
                moonMeshes[0].visible = true;

                this.addEnabledObjectsForEarth(selectedMoonNameValue, selectedMoonOrbitValue, moonNamesOnScene,
                    translatedMoonNames, orbits);
            } else if (selectedElem.value == 4) { // Jupiter
                this.enableSingleDropDownOption("jupiterIoName", "jupiterIoOrbit");
                this.enableSingleDropDownOption("jupiterEuropaName", "jupiterEuropaOrbit");
                this.enableSingleDropDownOption("jupiterGanymedeName", "jupiterGanymedeOrbit");
                this.enableSingleDropDownOption("jupiterCallistoName", "jupiterCallistoOrbit");
                moonMeshes[1].visible = true;
                moonMeshes[2].visible = true;
                moonMeshes[3].visible = true;
                moonMeshes[4].visible = true;

                var moonIdNames = ["jupiterIoName", "jupiterEuropaName", "jupiterGanymedeName", "jupiterCallistoName"];
                var moonIdOrbits = ["jupiterIoOrbit", "jupiterEuropaOrbit", "jupiterGanymedeOrbit", "jupiterCallistoOrbit"];
                this.addEnabledObjectsForJupiterUranus("allMoonNamesChecked", moonIdNames, moonNamesOnScene, 1, selectedMoonNameValue, 1);
                this.addEnabledObjectsForJupiterUranus("allMoonOrbitsChecked", moonIdOrbits, orbits, 9, selectedMoonOrbitValue, 1);
            } else if (selectedElem.value == 5) { // Saturn
                this.enableSingleDropDownOption("saturnRheaName", "saturnRheaOrbit");
                this.enableSingleDropDownOption("saturnTitanName", "saturnTitanOrbit");
                moonMeshes[5].visible = true;
                moonMeshes[6].visible = true;

                this.addEnabledObjectsForSaturn("allMoonNamesChecked", "saturnRheaName", moonNamesOnScene, 5, selectedMoonNameValue);
                this.addEnabledObjectsForSaturn("allMoonOrbitsChecked", "saturnRheaOrbit", orbits, 13, selectedMoonOrbitValue);
            } else if (selectedElem.value == 6) { // Uranus
                this.enableSingleDropDownOption("uranusArielName", "uranusArielOrbit");
                this.enableSingleDropDownOption("uranusUmbrielName", "uranusUmbrielOrbit");
                this.enableSingleDropDownOption("uranusTitaniaName", "uranusTitaniaOrbit");
                this.enableSingleDropDownOption("uranusOberonName", "uranusOberonOrbit");
                moonMeshes[7].visible = true;
                moonMeshes[8].visible = true;
                moonMeshes[9].visible = true;
                moonMeshes[10].visible = true;

                var moonIdNames = ["uranusArielName", "uranusUmbrielName", "uranusTitaniaName", "uranusOberonName"];
                var moonIdOrbits = ["uranusArielOrbit", "uranusUmbrielOrbit", "uranusTitaniaOrbit", "uranusOberonOrbit"];
                this.addEnabledObjectsForJupiterUranus("allMoonNamesChecked", moonIdNames, moonNamesOnScene, 7, selectedMoonNameValue, 7);
                this.addEnabledObjectsForJupiterUranus("allMoonOrbitsChecked", moonIdOrbits, orbits, 15, selectedMoonOrbitValue, 7);
            } else if (selectedElem.value == 7) { // Neptune
                this.enableSingleDropDownOption("neptuneTritonName", "neptuneTritonOrbit");
                moonMeshes[11].visible = true;

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
        if (document.getElementById("allMoonNamesChecked").checked == true || selectedMoonNameValue == 0) {
            moonNamesOnScene[0].visible = true;
            (this.getScene()).add(translatedMoonNames[0], translatedMoonNames[1]);
        }
        // Orbits
        if (document.getElementById("allMoonOrbitsChecked").checked == true || selectedMoonOrbitValue == 0) {
            orbits[8].visible = true;
        }
    }

    addEnabledObjectsForJupiterUranus(dropDownId, idNameMoons, objects, firstIndex, nameOrOrbit, nameOrOrbitIndex) {
        if (document.getElementById(dropDownId).checked == true) {
            objects[firstIndex].visible = true;
            objects[firstIndex + 1].visible = true;
            objects[firstIndex + 2].visible = true;
            objects[firstIndex + 3].visible = true;
        } else {
            if (!document.getElementById(idNameMoons[0]).disabled && nameOrOrbit == nameOrOrbitIndex) {
                objects[firstIndex].visible = true;
            } else if (!document.getElementById(idNameMoons[1]).disabled && nameOrOrbit == nameOrOrbitIndex + 1) {
                objects[firstIndex + 1].visible = true;
            } else if (!document.getElementById(idNameMoons[2]).disabled && nameOrOrbit == nameOrOrbitIndex + 2) {
                objects[firstIndex + 2].visible = true;
            } else if (!document.getElementById(idNameMoons[3]).disabled && nameOrOrbit == nameOrOrbitIndex + 3) {
                objects[firstIndex + 3].visible = true;
            }
        }
    }

    addEnabledObjectsForSaturn(dropDownId, elemId, objects, firstIndex, nameOrOrbit) {
        if (document.getElementById(dropDownId).checked == true) {
            objects[firstIndex].visible = true;
            objects[firstIndex + 1].visible = true;
        } else {
            if (!document.getElementById(elemId).disabled && nameOrOrbit == 5) {
                objects[firstIndex].visible = true;
            } else if (!document.getElementById(elemId).disabled && nameOrOrbit == 6) {
                objects[firstIndex + 1].visible = true;
            }
        }
    }

    addEnabledObjectsForNeptune(dropDownId, elemId, objects, objectIndex, nameOrOrbit) {
        if (document.getElementById(dropDownId).checked == true ||
            (!document.getElementById(elemId).disabled && nameOrOrbit == 11)) {
            objects[objectIndex].visible = true;
        }
    }

    showAllMoonObjects(objects, boolean) {
        (this.getScene()).traverse(function(children) {
            if (children == objects[0] || children == objects[1] || children == objects[2] || children == objects[3] ||
                children == objects[4] || children == objects[5] || children == objects[6] || children == objects[7] ||
                children == objects[8] || children == objects[9] || children == objects[10] || children == objects[11]) {
                children.visible = boolean;
            }
        });
    }

    // Sidebar - functions for planets' and moons' orbits
    // -------------------------------------------------------------------------
    showHideAllPlanetOrbitsOnScene() {
        if (document.getElementById("allPlanetOrbitsChecked").checked == true) {
            this.showAllPlanetObjects(this.getOrbits(), true);
        } else if (document.getElementById("allPlanetOrbitsChecked").checked == false) {
            this.showAllPlanetObjects(this.getOrbits(), false);
        }
    }

    showHideSinglePlanetOrbitOnScene(orbits) {
        var selectedElem = document.getElementById("singlePlanetOrbitSelected");
        var allPlanetOrbitsSelected = document.getElementById("allPlanetOrbitsChecked").checked;

        if (selectedElem.value != -1 && allPlanetOrbitsSelected == false) {
            this.showAllPlanetObjects(this.getOrbits(), false);
            orbits[selectedElem.value].visible = true;
        }
    }

    showHideAllMoonOrbitsOnScene() {
        if (document.getElementById("allMoonOrbitsChecked").checked == true) {
            if (document.getElementById("allMoonOrbitsChecked").checked == true) {
                this.showAllMoonOrbits(this.getOrbits(), true);
            }
        } else if (document.getElementById("allMoonOrbitsChecked").checked == false) {
            this.showAllMoonOrbits(this.getOrbits(), false);
        }
    }

    showHideSingleMoonOrbitOnScene(orbits) {
        var selectedElem = document.getElementById("singleMoonOrbitNameSelected");
        var allMoonOrbitsSelected = document.getElementById("allMoonOrbitsChecked").checked;
        var indexOfOrbit;

        if (selectedElem.value != -1 && allMoonOrbitsSelected == false) {
            this.showAllMoonOrbits(this.getOrbits(), false);
            indexOfOrbit = parseInt(selectedElem.value) + 8;
            orbits[indexOfOrbit].visible = true;
        }
    }

    showAllMoonOrbits(objects, boolean) {
        (this.getScene()).traverse(function(children) {
            if (children == objects[8] || children == objects[9] || children == objects[10] || children == objects[11] ||
                children == objects[12] || children == objects[13] || children == objects[14] || children == objects[15] ||
                children == objects[16] || children == objects[17] || children == objects[18] || children == objects[19]) {
                children.visible = boolean;
            }
        });
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