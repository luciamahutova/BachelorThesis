class CosmicObject {
    constructor(scene, planetMeshes) {
        this.scene = scene;
        this.planetMeshes = planetMeshes;

        this.cosmicObject;
        this.addCosmicObject = true;
        this.createCosmicObject();
    }

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
    findClickedPlanet() {
        var buttonColor = document.getElementById("cosmicObjectButton").style.backgroundColor;
        if (window.myParam != undefined && buttonColor == "lightblue") {
            var selectedPlanet = window.myParam[0].object;
            this.cosmicObject.position.set(10, 10, 0);
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
}