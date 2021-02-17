// This class is for detecting clicked objects in scene
// Basic code is used from: https://threejs.org/docs/index.html#api/en/core/Raycaster

class RayCaster extends Planet {
    constructor(camera) {
        super();
        this.camera = camera;
    }

    onMouseMove = function(event) {
        var mouse = new THREE.Vector2(0, 0);
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        var raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, this.camera);

        var intersects = raycaster.intersectObjects(scene.children);
        if (intersects.length > 0 && intersects[0].object.name != "Sun") {
            document.getElementById("sidebarPlanetInfo").style.left = "40px";

            var moveAbout = 0; // Difference between Mesh (planet) and Line (orbit) in scene.children
            if (intersects[0].object.parent.children[12].type == "Line") {
                moveAbout = 10;
            } else if (intersects[0].object.parent.children[20].type == "Line") {
                moveAbout = 18;
            }

            // Clear the last coloured planet/orbit, using "window.myParam"
            if (window.myParam != undefined) {
                var clearObjectColor = window.myParam;
                clearObjectColor[0].object.material.color.set(0xffffff);
                var indexOfClickedObject = clearObjectColor[0].object.parent.children.indexOf(clearObjectColor[0].object);

                if (clearObjectColor[0].object.type == "Mesh") {
                    clearObjectColor[0].object.parent.children[indexOfClickedObject + moveAbout].material.color.set(0xffffff);
                } else if (clearObjectColor[0].object.type == "Line") {
                    clearObjectColor[0].object.parent.children[indexOfClickedObject - moveAbout].material.color.set(0xffffff);
                }
            }

            // Colour clicked object (planet and orbit)
            intersects[0].object.material.color.set(0x792128);
            var indexOfClickedObject = intersects[0].object.parent.children.indexOf(intersects[0].object);
            if (intersects[0].object.type == "Mesh") {
                intersects[0].object.parent.children[indexOfClickedObject + moveAbout].material.color.set(0x792128);
            } else if (intersects[0].object.type == "Line") {
                intersects[0].object.parent.children[indexOfClickedObject - moveAbout].material.color.set(0x792128);
            }
            // Save the last clicked object, used for colouring back and for getting info from JSON
            window.myParam = intersects;
        }
    }

    getPlanetPhysicalValuesFromJSON = function(allPlanetDataJSON) {
        var intersects = window.myParam;
        if (intersects != undefined) {
            var dataOfCurrentPlanetJSON = allPlanetDataJSON[0];
            dataOfCurrentPlanetJSON.then(function(result) {
                document.getElementById("planetWeightInput").value = result[intersects[0].object.name]["weight"];
                document.getElementById("diameterInput").value = result[intersects[0].object.name]["diameter"];
                document.getElementById("perimeterInput").value = result[intersects[0].object.name]["perimeter"];
                document.getElementById("currentRotationInput").value = result[intersects[0].object.name]["currentRotationSpeed"];
                document.getElementById("rotationPeriodInput").value = result[intersects[0].object.name]["rotationPeriod"];
                document.getElementById("orbitalPeriodInput").value = result[intersects[0].object.name]["orbitalPeriod"];
                document.getElementById("distanceFromSunInput").value = result[intersects[0].object.name]["distanceFromSun"];
            });
            this.setCurrentSpeedOfClickedPlanet();
        }
    }

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