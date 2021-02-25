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
        if (intersects.length > 0 && intersects[0].object.name != "Sun") {
            document.getElementById("sidebarPlanetInfo").style.left = "40px";

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

    getPlanetPhysicalValuesFromJSON = function(allPlanetDataJSON) {
        var intersects = window.myParam;
        if (intersects != undefined) {
            var dataOfCurrentPlanetJSON = allPlanetDataJSON[0];
            dataOfCurrentPlanetJSON.then(function(result) {
                document.getElementById("planetWeightInput").value = result[intersects[0].object.name]["weight"];
                document.getElementById("diameterInput").value = result[intersects[0].object.name]["diameter"];
                document.getElementById("perimeterInput").value = result[intersects[0].object.name]["perimeter"];
                document.getElementById("rotationSpeedInput").value = result[intersects[0].object.name]["rotationSpeed"];
                document.getElementById("rotationPeriodInput").value = result[intersects[0].object.name]["rotationPeriod"];
                document.getElementById("orbitalPeriodInput").value = result[intersects[0].object.name]["orbitalPeriod"];
                document.getElementById("distanceFromSunInput").value = result[intersects[0].object.name]["distanceFromSun"];
            });
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