// This class is for detecting clicked objects in scene
// Basic code is used from: https://threejs.org/docs/index.html#api/en/core/Raycaster
class RayCaster extends JSONManager {
    constructor() {
        super();
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2(0, 0);
    }

    // Get()
    getRaycaster() { return this.raycaster }
    getMouse() { return this.mouse }

    // Mouse event
    // -------------------------------------------------------------------------
    onMouseMove(camera, scene, raycaster, mouse) {
        var planetNames = this.getPlanetNames();
        return function(event) {
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
            raycaster.setFromCamera(mouse, camera);
            var intersects = raycaster.intersectObjects(scene.children);

            if (intersects.length > 0 && intersects[0].object.name != "Sun" && intersects[0].object.visible == true) {
                // Show only the 1 table with physical info for planet/moon
                document.getElementById("sidebarPlanetInfo").style.left = "-300px";
                document.getElementById("sidebarMoonInfo").style.left = "-300px";

                var physicalTable;
                var selectedObjectName = intersects[0].object.name;
                var isPlanetSelected = false;
                for (var i = 0; i < planetNames.length; i++) {
                    if (selectedObjectName == planetNames[i]) {
                        isPlanetSelected = true;
                        break;
                    }
                }
                (isPlanetSelected) ? physicalTable = "sidebarPlanetInfo": physicalTable = "sidebarMoonInfo";
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

                // Colour clicked object (planet and its orbit) unless the button for cosmic object is activated
                if (document.getElementById("cosmicObjectButton").style.backgroundColor != "lightblue") {
                    scene.traverse(function(children) {
                        if (children.name == intersects[0].object.name) {
                            children.material.color.set(0x792128);
                        }
                    });
                } else { document.getElementById(physicalTable).style.left = "-300px"; }
                window.myParam = intersects;
            }
        }
    }

    disableRaycasterThroughOverlayObjects = function() {
        document.querySelectorAll('.overlay').forEach(item => {
            item.addEventListener('click', event => {
                event.stopPropagation();
            });
            item.addEventListener('mousemove', event => {
                event.stopPropagation();
            })
        })
    }

    getPhysicalValuesOfClickedObjectFromJSON = function() {
        var intersects = window.myParam;
        var showPlanetTable = false;

        if (intersects != undefined) {
            var selectedObjectName = intersects[0].object.name;
            var planetNames = this.getPlanetNames();
            for (var i = 0; i < planetNames.length; i++) {
                if (selectedObjectName == planetNames[i]) {
                    showPlanetTable = true
                }
            }

            var dataOfCurrentObjectJSON;
            if (showPlanetTable) {
                dataOfCurrentObjectJSON = (this.getPlanetData())[0];
                dataOfCurrentObjectJSON.then(function(result) {
                    document.getElementById("planetMassInput").value = result[selectedObjectName]["mass"];
                    document.getElementById("diameterInput").value = result[selectedObjectName]["diameter"];
                    document.getElementById("perimeterInput").value = result[selectedObjectName]["perimeter"];
                    document.getElementById("rotationSpeedInput").value = result[selectedObjectName]["rotationSpeed"];
                    document.getElementById("rotationPeriodInput").value = result[selectedObjectName]["rotationPeriod"];
                    document.getElementById("orbitalPeriodInput").value = result[selectedObjectName]["orbitalPeriod"];
                    document.getElementById("distanceFromSunPerihelionInput").value = result[selectedObjectName]["perihelion"];
                    document.getElementById("distanceFromSunAphelionInput").value = result[selectedObjectName]["aphelion"];
                });
            } else if (!showPlanetTable) {
                dataOfCurrentObjectJSON = (this.getMoonData())[0];
                dataOfCurrentObjectJSON.then(function(result) {
                    document.getElementById("moonMassInput").value = result[selectedObjectName]["mass"];
                    document.getElementById("diameterInputMoon").value = result[selectedObjectName]["diameter"];
                    document.getElementById("orbitalSpeedInputMoon").value = result[selectedObjectName]["orbitalSpeed"];
                    document.getElementById("orbitalPeriodInputMoon").value = result[selectedObjectName]["orbitalPeriod"];
                    document.getElementById("distanceFromPlanetInput").value = result[selectedObjectName]["distanceFromPlanet"];
                    document.getElementById("minTemperatureInput").value = result[selectedObjectName]["minTemperature"];
                    document.getElementById("maxTemperatureInput").value = result[selectedObjectName]["maxTemperature"];
                });
            }
        }
    }

    // Animate
    // -------------------------------------------------------------------------
    animate() {
        this.disableRaycasterThroughOverlayObjects();
        this.getPhysicalValuesOfClickedObjectFromJSON();
    }
}