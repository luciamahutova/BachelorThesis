class CosmicObject extends JSONManager {
    constructor(scene, planetMeshes) {
        super();
        this.scene = scene;
        this.planetMeshes = planetMeshes;
        this.addCosmicObject = true;
        this.isPlanetClicked = false;
        this.cosmicObject = this.createCosmicObject();
        // LEN POMOCNA ORBITA
        this.objectOrbit = this.cosmicObjectOrbit();
        this.objectMovingTime = 0;
    }

    // Get()
    getCosmicObject() { return this.cosmicObject }
    getScene() { return this.scene }
    getAddCosmicObject() { return this.addCosmicObject }
    getIsPlanetClicked() { return this.isPlanetClicked }
    getObjectOrbit() { return this.objectOrbit }
    getObjectMovingTime() { return this.objectMovingTime }

    // Set()
    setAddCosmicObject(boolean) { this.addCosmicObject = boolean }
    setIsPlanetClicked(boolean) { this.isPlanetClicked = boolean }
    setObjectMovingTime(value) { this.objectMovingTime -= value }

    // Cosmic object
    // -------------------------------------------------------------------------
    createCosmicObject() {
        var geometry = new THREE.ConeGeometry(0.3, 0.4, 5, 1, false, 1, 6.3);
        var material = new THREE.MeshBasicMaterial({ color: 0xffffff });
        var cosmicObject = new THREE.Mesh(geometry, material);
        cosmicObject.rotation.x = THREE.Math.degToRad(90);
        cosmicObject.name = "cosmicObject";
        return cosmicObject;
    }

    activateCosmicObjectButton() {
        if (this.getAddCosmicObject()) {
            document.getElementById("cosmicObjectButton").style.backgroundColor = "lightblue";
            $('#allMoonObjectsChecked').prop('checked', false);
            $('#cameraToObjectButton').prop('disabled', true);
            this.setAddCosmicObject(false);
        } else if (!(this.getAddCosmicObject())) {
            (this.getScene()).remove(this.getCosmicObject());
            if (window.myParam != undefined) {
                this.moonsVisibilityOfSelectedPlanet(window.myParam[0].object.name, true);
            }
            document.getElementById("cosmicObjectButton").style.backgroundColor = "#061327";
            $('#allMoonObjectsChecked').prop('checked', true);
            $('#cameraToObjectButton').prop('disabled', false);
            this.setAddCosmicObject(true);
        }
    }

    // Called in scene.js - animate
    findClickedPlanet(scaleValue, force, time) {
        var buttonColor = document.getElementById("cosmicObjectButton").style.backgroundColor;
        if (window.myParam != undefined && buttonColor == "lightblue") {
            var selectedPlanet = window.myParam[0].object;
            this.moonsVisibilityOfSelectedPlanet(selectedPlanet, false);

            if (this.getIsPlanetClicked()) {
                var meshOrder = this.getIndexOfSelectedPlanet(selectedPlanet);
                this.positionCosmicObject(buttonColor, this.cosmicObject, this.planetMeshes, meshOrder, scaleValue, force,
                    this.getObjectOrbit());
                (this.getScene()).add(this.getCosmicObject());
            } else if (!this.getIsPlanetClicked()) {
                (this.getScene()).remove(this.getCosmicObject());
            }
        }
    }

    // Hides moons of seletected planet when cosmic object is added to scene
    moonsVisibilityOfSelectedPlanet(selectedPlanet, showObjectsBoolean) {
        if (selectedPlanet.name == "Earth") {
            (this.getScene()).traverse(function(children) {
                if (children.name == "Moon" || children.name == "nameMoon" || children.name == "nameMesic" || children.name == "nameMesiac") {
                    children.visible = showObjectsBoolean;
                }
            });
            this.setIsPlanetClicked(true);
        } else if (selectedPlanet.name == "Jupiter") {
            (this.getScene()).traverse(function(children) {
                if (children.name == "Io" || children.name == "Europa" || children.name == "Ganymede" || children.name == "Callisto" ||
                    children.name == "nameIo" || children.name == "nameEuropa" || children.name == "nameGanymede" ||
                    children.name == "nameCallisto") {
                    children.visible = showObjectsBoolean;
                }
            });
            this.setIsPlanetClicked(true);
        } else if (selectedPlanet.name == "Saturn") {
            (this.getScene()).traverse(function(children) {
                if (children.name == "Rhea" || children.name == "Titan" || children.name == "nameRhea" || children.name == "nameTitan") {
                    children.visible = showObjectsBoolean;
                }
            });
            this.setIsPlanetClicked(true);
        } else if (selectedPlanet.name == "Uranus") {
            (this.getScene()).traverse(function(children) {
                if (children.name == "Ariel" || children.name == "Umbriel" || children.name == "Titania" || children.name == "Oberon" ||
                    children.name == "nameAriel" || children.name == "nameUmbriel" || children.name == "nameTitania" ||
                    children.name == "nameOberon") {
                    children.visible = showObjectsBoolean;
                }
            });
            this.setIsPlanetClicked(true);
        } else if (selectedPlanet.name == "Neptune") {
            (this.getScene()).traverse(function(children) {
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
    // ORIGINÁL FUNKCIA
    // positionCosmicObject(buttonColor, cosmicObject, planetMeshes, planetOrder, scaleValue, force, time) {
    //     if (window.myParam != undefined && buttonColor == "lightblue") {
    //         var dataOfCurrentPlanetJSON = (this.getPlanetData())[0];
    //         var orbitalSpeed, newForce = 0;
    //         var selectedPlanet = window.myParam[0].object;

    //         dataOfCurrentPlanetJSON.then(function(result) {
    //             orbitalSpeed = result[selectedPlanet.name]["cosmicObjectSpeed"];
    //             newForce = (force * result[selectedPlanet.name]["gravitationalPull"]) / 10;

    //             cosmicObject.position.x = planetMeshes[planetOrder].position.x + newForce / 3 *
    //                 result[selectedPlanet.name]["cosmicObjectDistanceX"] * result[selectedPlanet.name]["cosmicObjectScaleFactor"] * scaleValue * Math.cos(orbitalSpeed * 0.0001 * time);
    //             cosmicObject.position.z = planetMeshes[planetOrder].position.z - 2 *
    //                 result[selectedPlanet.name]["cosmicObjectDistanceZ"] * result[selectedPlanet.name]["cosmicObjectScaleFactor"] * scaleValue * Math.sin(orbitalSpeed * 0.0001 * time);
    //         });
    //     }
    // }

    positionCosmicObject(buttonColor, cosmicObject, planetMeshes, planetOrder, scaleValue, force, orbit) {
        if (window.myParam != undefined && buttonColor == "lightblue") {
            var dataOfCurrentPlanetJSON = (this.getPlanetData())[0];
            var selectedPlanet = window.myParam[0].object.name;
            orbit.position.x = planetMeshes[planetOrder].position.x;
            orbit.position.z = planetMeshes[planetOrder].position.z;
            var changeX, changeY, orbitPoint = 0;
            var time = this.getObjectMovingTime();

            dataOfCurrentPlanetJSON.then(function(result) {
                changeX = result[selectedPlanet]["cosmicObjectDistanceX"] * scaleValue * force *
                    result[selectedPlanet]["cosmicObjectScaleFactor"];
                changeY = result[selectedPlanet]["cosmicObjectDistanceZ"] * scaleValue * force *
                    result[selectedPlanet]["cosmicObjectScaleFactor"];

                orbit.scale.set(changeX, changeY, 1);
                orbitPoint = new THREE.Vector3(changeX * Math.cos(2 * Math.PI * time),
                    0, changeY * Math.sin(2 * Math.PI * time));
                cosmicObject.position.set(orbit.position.x + orbitPoint.x, orbit.position.y + orbitPoint.y,
                    orbit.position.z + orbitPoint.z);
            });
            this.setObjectMovingTime(0.001)
        }
    }

    getNextPointFromOrbit(time, force) {
        return new THREE.Vector3(force * Math.cos(2 * Math.PI * time),
            0, Math.sin(2 * Math.PI * time));
    };

    cosmicObjectOrbit() {
        // Initial xRadius and yRadius = 1
        var curve = new THREE.EllipseCurve(0, 0, 1, 1, 0, 2 * Math.PI, false, 0);
        var geometry = new THREE.BufferGeometry().setFromPoints(curve.getPoints(200));
        var material = new THREE.LineBasicMaterial({ color: 0xffff00 });
        var ellipse = new THREE.Line(geometry, material);
        ellipse.rotation.x = THREE.Math.degToRad(90);
        this.scene.add(ellipse);
        return ellipse;
    }
}