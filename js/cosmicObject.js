class CosmicObject extends JSONManager {
    constructor(scene, planetMeshes) {
        super();
        this.scene = scene;
        this.planetMeshes = planetMeshes;
        this.addCosmicObject = true;
        this.isPlanetClicked = false;
        this.cosmicObject = this.createCosmicObject();
        this.objectOrbit = this.cosmicObjectOrbit();

        this.lastSpeedFromSlider = 1;
        this.isSpeedChanged = false;
        this.currentForceForAxisX = 1;
        this.currentForceForAxisZ = 1;
        this.lastForceForAxisX = 1;
        this.lastForceForAxisZ = 1;
    }

    // Get()
    getCosmicObject() { return this.cosmicObject }
    getScene() { return this.scene }
    getAddCosmicObject() { return this.addCosmicObject }
    getIsPlanetClicked() { return this.isPlanetClicked }
    getObjectOrbit() { return this.objectOrbit }
    getPlanetMeshes() { return this.planetMeshes }
    getLastSpeedFromSlider() { return this.lastSpeedFromSlider }
    getIsSpeedChanged() { return this.isSpeedChanged }
    getCurrentForceForAxisX() { return this.currentForceForAxisX }
    getCurrentForceForAxisZ() { return this.currentForceForAxisZ }
    getLastForceForAxisX() { return this.lastForceForAxisX }
    getLastForceForAxisZ() { return this.lastForceForAxisZ }

    // Set()
    setAddCosmicObject(boolean) { this.addCosmicObject = boolean }
    setIsPlanetClicked(boolean) { this.isPlanetClicked = boolean }
    setLastSpeedFromSlider(value) { this.lastSpeedFromSlider = value }
    setIsSpeedChanged(value) { this.isSpeedChanged = value }
    setCurrentForceForAxisX(value) { this.currentForceForAxisX = value }
    setCurrentForceForAxisZ(value) { this.currentForceForAxisZ = value }
    setLastForceForAxisX(value) { this.lastForceForAxisX = value }
    setLastForceForAxisZ(value) { this.lastForceForAxisZ = value }

    // Cosmic object and orbit
    // -------------------------------------------------------------------------
    createCosmicObject() {
        var geometry = new THREE.ConeGeometry(0.3, 0.4, 5, 1, false, 1, 6.3);
        var material = new THREE.MeshBasicMaterial({ color: 0xffffff });
        var cosmicObject = new THREE.Mesh(geometry, material);
        cosmicObject.rotation.x = THREE.Math.degToRad(90);
        cosmicObject.name = "cosmicObject";
        return cosmicObject;
    }

    cosmicObjectOrbit() {
        // Initial xRadius and yRadius = 1
        var curve = new THREE.EllipseCurve(0, 0, 1, 1, 0, 2 * Math.PI, false, 0);
        var geometry = new THREE.BufferGeometry().setFromPoints(curve.getPoints(200));
        var material = new THREE.LineBasicMaterial({ color: 0x7C6CE2 });
        var ellipse = new THREE.Line(geometry, material);
        ellipse.rotation.x = THREE.Math.degToRad(90);
        this.scene.add(ellipse);
        return ellipse;
    }

    activateCosmicObjectButton() {
        if (this.getAddCosmicObject()) {
            document.getElementById("cosmicObjectButton").style.backgroundColor = "lightblue";
            $('#cameraToObjectButton').prop('disabled', true);
            (this.getScene()).add(this.getObjectOrbit());
            this.setAddCosmicObject(false);
        } else if (!(this.getAddCosmicObject())) {
            (this.getScene()).remove(this.getCosmicObject());
            if (window.myParam != undefined) {
                this.moonsVisibilityOfSelectedPlanet(window.myParam[0].object.name, true);
            }
            document.getElementById("cosmicObjectButton").style.backgroundColor = "#061327";
            $('#cameraToObjectButton').prop('disabled', false);
            (this.getScene()).remove(this.getObjectOrbit());
            this.setAddCosmicObject(true);
        }
    }

    // Find clicked planet to show cosmic object, called if ModelScene - animate()
    // -------------------------------------------------------------------------
    findClickedPlanet(scaleValue, force, time) {
        var buttonColor = document.getElementById("cosmicObjectButton").style.backgroundColor;
        if (window.myParam != undefined && buttonColor == "lightblue") {
            var selectedPlanet = window.myParam[0].object;
            this.moonsVisibilityOfSelectedPlanet(selectedPlanet, false);

            if (this.getIsPlanetClicked()) {
                var meshOrder = this.getIndexOfSelectedPlanet(selectedPlanet);
                this.positionCosmicObject(buttonColor, this.getCosmicObject(), this.getPlanetMeshes(), meshOrder, scaleValue,
                    force, this.getObjectOrbit(), time);
                (this.getScene()).add(this.getCosmicObject());
            } else if (!this.getIsPlanetClicked()) {
                (this.getScene()).remove(this.getCosmicObject());
            }
        }
    }

    // Hides moons of seletected planet when cosmic object is added to scene
    // -------------------------------------------------------------------------
    moonsVisibilityOfSelectedPlanet(selectedPlanet, showObjectsBoolean) {
        if (selectedPlanet.name == "Venus" || selectedPlanet.name == "Earth") {
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

    // Position cosmic object on its orbit
    // -------------------------------------------------------------------------
    positionCosmicObject(buttonColor, cosmicObject, planetMeshes, planetOrder, scaleValue, force, orbit, time) {
        if (window.myParam != undefined && buttonColor == "lightblue") {
            var dataOfCurrentPlanetJSON = (this.getPlanetData())[0];
            var selectedPlanet = window.myParam[0].object.name;
            orbit.position.x = planetMeshes[planetOrder].position.x;
            orbit.position.z = planetMeshes[planetOrder].position.z;
            var changeX, changeY, orbitPoint = 0;

            if (this.getLastSpeedFromSlider() !== force) {
                this.setIsSpeedChanged(true);
            }
            var isSpeedChanged = this.getIsSpeedChanged();
            var orbitPointX, orbitPointZ = 1;

            (async() => {
                var valueX = this.getCurrentForceForAxisX();
                var valueZ = this.getCurrentForceForAxisZ();

                var promiseValue = dataOfCurrentPlanetJSON.then(function(result) {
                    changeX = result[selectedPlanet]["cosmicObjectDistanceX"] * scaleValue * valueX;
                    changeY = result[selectedPlanet]["cosmicObjectDistanceZ"] * scaleValue * valueZ;

                    orbit.scale.set(changeX, changeY, 1);
                    orbitPoint = new THREE.Vector3(
                        changeX * Math.cos(result[selectedPlanet]["cosmicObjectSpeed"] * Math.PI * (-0.00001) * time), 0,
                        changeY * Math.sin(result[selectedPlanet]["cosmicObjectSpeed"] * Math.PI * (-0.00001) * time));
                    cosmicObject.position.set(orbit.position.x + orbitPoint.x, orbit.position.y, orbit.position.z + orbitPoint.z);

                    // save and use outside Promise (after await) - to know if the orbit will change on x/z-axis
                    if (isSpeedChanged) { // change is needed only when value from slider is changed
                        orbitPointX = orbitPoint.x;
                        orbitPointZ = orbitPoint.z;
                    }
                });

                if (isSpeedChanged) {
                    await promiseValue; // await - to read data from Promise.then()
                    this.setLastForceForAxisX(this.getCurrentForceForAxisX());
                    this.setLastForceForAxisZ(this.getCurrentForceForAxisZ());

                    var positionX = 1.4;
                    if (selectedPlanet == "Mercury") { // orbit for object is too smal, original value did not work right
                        positionX = 0.6;
                    }

                    if (orbitPointX < positionX && orbitPointX > -positionX) { // EŠTE UPRAVIŤ PODMIENKU - PRESNEJŠIE NASTAVOVANIE
                        this.setCurrentForceForAxisX(force);
                        this.setCurrentForceForAxisZ(this.getLastForceForAxisZ());
                    } else {
                        this.setCurrentForceForAxisX(this.getLastForceForAxisX());
                        this.setCurrentForceForAxisZ(force);
                    }
                    orbit.scale.set(this.getCurrentForceForAxisX(), this.getCurrentForceForAxisZ(), 1);
                }
            })();
            this.setLastSpeedFromSlider(force);
            this.setIsSpeedChanged(false);
        }
    }
}