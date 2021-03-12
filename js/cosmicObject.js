class CosmicObject extends Planet {
    constructor(scene, planetMeshes) {
        super();
        this.scene = scene;
        this.allPlanetDataJSON = super.getPlanetData();
        this.planetMeshes = planetMeshes;
        this.cosmicObject;
        this.addCosmicObject = true;
        this.createCosmicObject();
    }

    // Cosmic object
    // -------------------------------------------------------------------------
    createCosmicObject() {
        var geometry = new THREE.ConeGeometry(0.3, 0.4, 5, 1, false, 1, 6.3);
        var material = new THREE.MeshBasicMaterial({ color: 0xffffff });
        this.cosmicObject = new THREE.Mesh(geometry, material);
        this.cosmicObject.rotation.x = THREE.Math.degToRad(90);
        //this.cosmicObject.rotation.y = THREE.Math.degToRad(50);
        this.cosmicObject.name = "cosmicObject";
    }

    addCosmicObjectToScene() {
        if (this.addCosmicObject) {
            document.getElementById("cosmicObjectButton").style.backgroundColor = "lightblue";
            document.getElementById("allMoonObjectsChecked").checked = false;
            this.addCosmicObject = false;
        } else {
            this.scene.remove(this.cosmicObject);
            this.moonsVisibilityOfSelectedPlanet(window.myParam[0].object.name, true);
            document.getElementById("allMoonObjectsChecked").checked = true;
            document.getElementById("cosmicObjectButton").style.backgroundColor = "#061327";
            this.addCosmicObject = true;
        }
    }

    // Called in scene.js - animate
    findClickedPlanet(scaleValue, speedValue, time) {
        var buttonColor = document.getElementById("cosmicObjectButton").style.backgroundColor;
        if (window.myParam != undefined && buttonColor == "lightblue") {
            var selectedPlanet = window.myParam[0].object;
            var meshOrder = this.orderOfSelectedPlanetMesh(selectedPlanet);

            this.positionCosmicObject(buttonColor, this.cosmicObject, this.planetMeshes, meshOrder, scaleValue, speedValue, time);
            this.scene.add(this.cosmicObject);
            this.moonsVisibilityOfSelectedPlanet(selectedPlanet, false);
        }
    }

    moonsVisibilityOfSelectedPlanet(selectedPlanet, showObjectsBoolean) {
        if (selectedPlanet.name == "Earth") {
            this.scene.traverse(function(children) {
                if (children.name == "Moon" || children.name == "nameMoon") {
                    children.visible = showObjectsBoolean;
                }
            });
        } else if (selectedPlanet.name == "Jupiter") {
            this.scene.traverse(function(children) {
                if (children.name == "Io" || children.name == "Europa" || children.name == "Ganymede" || children.name == "Callisto" ||
                    children.name == "nameIo" || children.name == "nameEuropa" || children.name == "nameGanymede" ||
                    children.name == "nameCallisto") {
                    children.visible = showObjectsBoolean;
                }
            });
        } else if (selectedPlanet.name == "Saturn") {
            this.scene.traverse(function(children) {
                if (children.name == "Rhea" || children.name == "Titan" || children.name == "nameRhea" || children.name == "nameTitan") {
                    children.visible = showObjectsBoolean;
                }
            });
        } else if (selectedPlanet.name == "Uranus") {
            this.scene.traverse(function(children) {
                if (children.name == "Ariel" || children.name == "Umbriel" || children.name == "Titania" || children.name == "Oberon" ||
                    children.name == "nameAriel" || children.name == "nameUmbriel" || children.name == "nameTitania" ||
                    children.name == "nameOberon") {
                    children.visible = showObjectsBoolean;
                }
            });
        } else if (selectedPlanet.name == "Neptune") {
            this.scene.traverse(function(children) {
                if (children.name == "Triton" || children.name == "nameTriton") {
                    children.visible = showObjectsBoolean;
                }
            });
        }
    }

    setScaleForCosmicObject(scaleValue) {
        this.cosmicObject.scale.set(2 * scaleValue, 2 * scaleValue, 2 * scaleValue);
    }

    // Position cosmic object to selected planet
    // -------------------------------------------------------------------------
    positionCosmicObject(buttonColor, cosmicObject, planetMeshes, planetOrder, scaleValue, speedValue, time) {
        if (window.myParam != undefined && buttonColor == "lightblue") {
            var dataOfCurrentPlanetJSON = this.allPlanetDataJSON[0];
            var orbitalSpeed = 0;
            var rangesliderSpeed = this.calculateRotationSpeed(speedValue, time);
            var selectedPlanet = window.myParam[0].object;

            // OPRAVIŤ RÝCHLOSŤ TOČENIA
            dataOfCurrentPlanetJSON.then(function(result) {
                orbitalSpeed = result[selectedPlanet.name]["cosmicObjectSpeed"];

                cosmicObject.position.x = planetMeshes[planetOrder].position.x + 2 *
                    result[selectedPlanet.name]["cosmicObjectDistanceX"] * result[selectedPlanet.name]["cosmicObjectScaleFactor"] * scaleValue * Math.cos(orbitalSpeed * rangesliderSpeed);
                cosmicObject.position.z = planetMeshes[planetOrder].position.z - 2 *
                    result[selectedPlanet.name]["cosmicObjectDistanceZ"] * result[selectedPlanet.name]["cosmicObjectScaleFactor"] * scaleValue * Math.sin(orbitalSpeed * rangesliderSpeed);
            });
        }
    }

    orderOfSelectedPlanetMesh(selectedPlanet) {
        // Need position of planet mesh, position of selectedPlanet is not updated (= 0)
        // In For-cycle it's too slow
        if (selectedPlanet.name == "Mercury") {
            return 0;
        } else if (selectedPlanet.name == "Venus") {
            return 1;
        } else if (selectedPlanet.name == "Earth") {
            return 2;
        } else if (selectedPlanet.name == "Mars") {
            return 3;
        } else if (selectedPlanet.name == "Jupiter") {
            return 4;
        } else if (selectedPlanet.name == "Saturn") {
            return 5;
        } else if (selectedPlanet.name == "Uranus") {
            return 6;
        } else if (selectedPlanet.name == "Neptune") {
            return 7;
        }
    }

    calculateRotationSpeed(speedValue, time) {
        if (speedValue == 0) {
            return 0.0001 * time;
        } else if (speedValue > 0) {
            return 0.0001 * time * speedValue;
        } else if (speedValue < 0) {
            return (0.0001 * time) / Math.abs(speedValue);
        }
    }
}