class CosmicObject extends JSONManager {
    constructor(scene, planetMeshes) {
        super();
        this.scene = scene;
        this.allPlanetDataJSON = super.getPlanetData();
        this.planetMeshes = planetMeshes;
        this.cosmicObject;
        this.addCosmicObject = true;
        this.isPlanetClicked = false;
        this.createCosmicObject();
    }

    getCosmicObject() { return [this.cosmicObject]; } // Used in class Planet - for scale
    getIsPlanetClicked() { return this.isPlanetClicked; }
    setIsPlanetClicked(boolean) { this.isPlanetClicked = boolean; }

    // Cosmic object
    // -------------------------------------------------------------------------
    createCosmicObject() {
        var geometry = new THREE.ConeGeometry(0.3, 0.4, 5, 1, false, 1, 6.3);
        var material = new THREE.MeshBasicMaterial({ color: 0xffffff });
        this.cosmicObject = new THREE.Mesh(geometry, material);
        this.cosmicObject.rotation.x = THREE.Math.degToRad(90);
        this.cosmicObject.name = "cosmicObject";
    }

    activeCosmicObjectButton() {
        if (this.addCosmicObject) {
            document.getElementById("cosmicObjectButton").style.backgroundColor = "lightblue";
            $('#allMoonObjectsChecked').prop('checked', false);
            $('#cameraToObjectButton').prop('disabled', true);
            this.addCosmicObject = false;
        } else if (!this.addCosmicObject) {
            this.scene.remove(this.cosmicObject);
            if (window.myParam != undefined) {
                this.moonsVisibilityOfSelectedPlanet(window.myParam[0].object.name, true);
            }
            document.getElementById("cosmicObjectButton").style.backgroundColor = "#061327";
            $('#allMoonObjectsChecked').prop('checked', true);
            $('#cameraToObjectButton').prop('disabled', false);
            this.addCosmicObject = true;
        }
    }

    // Called in scene.js - animate
    findClickedPlanet(scaleValue, time) {
        var buttonColor = document.getElementById("cosmicObjectButton").style.backgroundColor;
        if (window.myParam != undefined && buttonColor == "lightblue") {
            var selectedPlanet = window.myParam[0].object;
            this.moonsVisibilityOfSelectedPlanet(selectedPlanet, false);

            if (this.getIsPlanetClicked()) {
                var meshOrder = this.orderOfSelectedPlanetMesh(selectedPlanet);
                this.positionCosmicObject(buttonColor, this.cosmicObject, this.planetMeshes, meshOrder, scaleValue, time);
                this.scene.add(this.cosmicObject);
            } else if (!this.getIsPlanetClicked()) {
                this.scene.remove(this.cosmicObject);
            }
        }
    }

    // Hides moons of seletected planet when cosmic object is added to scene
    moonsVisibilityOfSelectedPlanet(selectedPlanet, showObjectsBoolean) {
        if (selectedPlanet.name == "Earth") {
            this.scene.traverse(function(children) {
                if (children.name == "Moon" || children.name == "nameMoon") {
                    children.visible = showObjectsBoolean;
                }
            });
            this.setIsPlanetClicked(true);
        } else if (selectedPlanet.name == "Jupiter") {
            this.scene.traverse(function(children) {
                if (children.name == "Io" || children.name == "Europa" || children.name == "Ganymede" || children.name == "Callisto" ||
                    children.name == "nameIo" || children.name == "nameEuropa" || children.name == "nameGanymede" ||
                    children.name == "nameCallisto") {
                    children.visible = showObjectsBoolean;
                }
            });
            this.setIsPlanetClicked(true);
        } else if (selectedPlanet.name == "Saturn") {
            this.scene.traverse(function(children) {
                if (children.name == "Rhea" || children.name == "Titan" || children.name == "nameRhea" || children.name == "nameTitan") {
                    children.visible = showObjectsBoolean;
                }
            });
            this.setIsPlanetClicked(true);
        } else if (selectedPlanet.name == "Uranus") {
            this.scene.traverse(function(children) {
                if (children.name == "Ariel" || children.name == "Umbriel" || children.name == "Titania" || children.name == "Oberon" ||
                    children.name == "nameAriel" || children.name == "nameUmbriel" || children.name == "nameTitania" ||
                    children.name == "nameOberon") {
                    children.visible = showObjectsBoolean;
                }
            });
            this.setIsPlanetClicked(true);
        } else if (selectedPlanet.name == "Neptune") {
            this.scene.traverse(function(children) {
                if (children.name == "Triton" || children.name == "nameTriton") {
                    children.visible = showObjectsBoolean;
                }
            });
            this.setIsPlanetClicked(true);
        } else if (selectedPlanet.name == "Mercury" || selectedPlanet.name == "Venus" || selectedPlanet.name == "Mars") {
            this.setIsPlanetClicked(true);
        } else { this.setIsPlanetClicked(false); }

    }

    // Position cosmic object to selected planet
    // -------------------------------------------------------------------------
    positionCosmicObject(buttonColor, cosmicObject, planetMeshes, planetOrder, scaleValue, time) {
        if (window.myParam != undefined && buttonColor == "lightblue") {
            var dataOfCurrentPlanetJSON = this.allPlanetDataJSON[0];
            var orbitalSpeed = 0;
            var selectedPlanet = window.myParam[0].object;

            dataOfCurrentPlanetJSON.then(function(result) {
                orbitalSpeed = result[selectedPlanet.name]["cosmicObjectSpeed"];

                cosmicObject.position.x = planetMeshes[planetOrder].position.x + 2 *
                    result[selectedPlanet.name]["cosmicObjectDistanceX"] * result[selectedPlanet.name]["cosmicObjectScaleFactor"] * scaleValue * Math.cos(orbitalSpeed * 0.0001 * time);
                cosmicObject.position.z = planetMeshes[planetOrder].position.z - 2 *
                    result[selectedPlanet.name]["cosmicObjectDistanceZ"] * result[selectedPlanet.name]["cosmicObjectScaleFactor"] * scaleValue * Math.sin(orbitalSpeed * 0.0001 * time);
            });
        }
    }

    orderOfSelectedPlanetMesh(selectedPlanet) {
        // Need position of planet mesh, position of selectedPlanet (from window.myParam) is not updated (still 0)
        // In For-cycle it's too slow, planets will jump a little
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
}