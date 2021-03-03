// This class is for detecting clicked objects in scene
// Basic code is used from: https://threejs.org/docs/index.html#api/en/core/Raycaster

class RayCaster {
    constructor(camera) {
        this.camera = camera;
    }

    onMouseMove = function(event) {
        var mouse = new THREE.Vector2(0, 0);
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        var raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, this.camera);

        var intersects = raycaster.intersectObjects(scene.children);
        if (intersects.length > 0 && intersects[0].object.name != "Sun" && intersects[0].object.visible == true) {
            // Show only the 1 table with physical info for planet/moon
            document.getElementById("sidebarPlanetInfo").style.left = "-300px";
            document.getElementById("sidebarMoonInfo").style.left = "-300px";
            var physicalTable;
            (intersects[0].object.name == "Mercury" || intersects[0].object.name == "Venus" || intersects[0].object.name == "Earth" || intersects[0].object.name == "Mars" || intersects[0].object.name == "Jupiter" || intersects[0].object.name == "Saturn" ||
                intersects[0].object.name == "Uranus" || intersects[0].object.name == "Neptune") ?
            physicalTable = "sidebarPlanetInfo": physicalTable = "sidebarMoonInfo";
            document.getElementById(physicalTable).style.left = "40px";

            // Clear the last coloured planet/orbit, using "window.myParam"
            if (window.myParam != undefined) {
                var clearObjectColor = window.myParam;
                scene.traverse(function(children) {
                    if (children.name == clearObjectColor[0].object.name) {
                        children.material.color.set(0xffffff);
                    }
                });
            }

            // Colour clicked object (planet and orbit)
            scene.traverse(function(children) {
                if (children.name == intersects[0].object.name) {
                    children.material.color.set(0x792128);
                }
            });
            window.myParam = intersects;
        }
    }

    disableRaycasterThroughOverlayObjects = function() {
        document.querySelectorAll('.overlay').forEach(item => {
            item.addEventListener('click', event => {
                event.stopPropagation();
            })
        })
    }

    getPhysicalValuesOfClickedObjectFromJSON = function(allPlanetDataJSON, allMoonDataJSON) {
        var intersects = window.myParam;
        var showPlanetTable;

        if (intersects != undefined) {
            (intersects[0].object.name == "Mercury" || intersects[0].object.name == "Venus" || intersects[0].object.name == "Earth" || intersects[0].object.name == "Mars" || intersects[0].object.name == "Jupiter" || intersects[0].object.name == "Saturn" ||
                intersects[0].object.name == "Uranus" || intersects[0].object.name == "Neptune") ? showPlanetTable = true: showPlanetTable = false;

            if (showPlanetTable) {
                var dataOfCurrentPlanetJSON = allPlanetDataJSON[0];
                dataOfCurrentPlanetJSON.then(function(result) {
                    document.getElementById("planetMassInput").value = result[intersects[0].object.name]["mass"];
                    document.getElementById("diameterInput").value = result[intersects[0].object.name]["diameter"];
                    document.getElementById("perimeterInput").value = result[intersects[0].object.name]["perimeter"];
                    document.getElementById("rotationSpeedInput").value = result[intersects[0].object.name]["rotationSpeed"];
                    document.getElementById("rotationPeriodInput").value = result[intersects[0].object.name]["rotationPeriod"];
                    document.getElementById("orbitalPeriodInput").value = result[intersects[0].object.name]["orbitalPeriod"];
                    document.getElementById("distanceFromSunPerihelionInput").value = result[intersects[0].object.name]["perihelion"];
                    document.getElementById("distanceFromSunAphelionInput").value = result[intersects[0].object.name]["aphelion"];
                });
            } else if (!showPlanetTable) {
                var dataOfCurrentPlanetJSON = allMoonDataJSON[0];
                dataOfCurrentPlanetJSON.then(function(result) {
                    document.getElementById("moonMassInput").value = result[intersects[0].object.name]["mass"];
                    document.getElementById("diameterInputMoon").value = result[intersects[0].object.name]["diameter"];
                    document.getElementById("orbitalSpeedInputMoon").value = result[intersects[0].object.name]["orbitalSpeed"];
                    document.getElementById("orbitalPeriodInputMoon").value = result[intersects[0].object.name]["orbitalPeriod"];
                    document.getElementById("distanceFromPlanetInput").value = result[intersects[0].object.name]["distanceFromPlanet"];
                    document.getElementById("minTemperatureInput").value = result[intersects[0].object.name]["minTemperature"];
                    document.getElementById("maxTemperatureInput").value = result[intersects[0].object.name]["maxTemperature"];
                });
            }
        }
    }

    // NEPOUZITE
    setCurrentSpeedOfClickedPlanet = function() {
        var speedSlider = document.getElementById("rangesliderSpeedInput");
        var speedSliderValue = document.getElementById("rangesliderSpeedValue");
        var currentSpeedOfPlanet = document.getElementById("currentRotationInput").value;

        speedSliderValue.innerHTML = speedSlider.value;
        var speedValue = speedSliderValue.innerHTML;
        //console.log(speedValue);

        if (speedValue > 0) {
            currentSpeedOfPlanet = currentSpeedOfPlanet * speedValue;
        } else if (speedValue < 0) {
            currentSpeedOfPlanet = currentSpeedOfPlanet / Math.abs(speedValue);
        }
        //console.log(currentSpeedOfPlanet);
        // HODNOTA DOBRÁ, ALE NEVYPÍŠE SA DO TABUĽKY, PREČO?
        document.getElementById("currentRotationInput").value = currentSpeedOfPlanet;
    }
}