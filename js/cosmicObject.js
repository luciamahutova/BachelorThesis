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

        // Vectors are for calculating distance between objects and changing speed
        this.vectorPlanet = new THREE.Vector3(0, 0, 0);
        this.vectorCosmicObject = new THREE.Vector3(0, 0, 0);
        this.planetAndObjectVectorDistance = 0;
        this.movingTime = 0;
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
    getVectorPlanet() { return this.vectorPlanet }
    getVectorCosmicObject() { return this.vectorCosmicObject }
    getVectorsDistance() { return this.planetAndObjectVectorDistance }
    getCosmicObjectMovingTime() { return this.movingTime }

    // Set()
    setAddCosmicObject(boolean) { this.addCosmicObject = boolean }
    setIsPlanetClicked(boolean) { this.isPlanetClicked = boolean }
    setLastSpeedFromSlider(value) { this.lastSpeedFromSlider = value }
    setIsSpeedChanged(value) { this.isSpeedChanged = value }
    setCurrentForceForAxisX(value) { this.currentForceForAxisX = value }
    setCurrentForceForAxisZ(value) { this.currentForceForAxisZ = value }
    setLastForceForAxisX(value) { this.lastForceForAxisX = value }
    setLastForceForAxisZ(value) { this.lastForceForAxisZ = value }
    setCosmicObjectMovingTime(value) { this.movingTime += value }
    setVectorsDistance(value) { this.planetAndObjectVectorDistance = value }
    setVectorPlanet(valueX, valueZ) {
        this.vectorPlanet.x = valueX;
        this.vectorPlanet.z = valueZ;
    }
    setVectorCosmicObject(valueX, valueZ) {
        this.vectorCosmicObject.x = valueX;
        this.vectorCosmicObject.z = valueZ;
    }

    // Cosmic object, orbit and button
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
        var geometry = new THREE.BufferGeometry().setFromPoints(curve.getPoints(150));
        var material = new THREE.LineBasicMaterial({ color: 0x7C6CE2 });
        var ellipse = new THREE.Line(geometry, material);
        ellipse.rotation.x = THREE.Math.degToRad(90);
        this.scene.add(ellipse);
        return ellipse;
    }

    activateCosmicObjectButton() {
        var selected = (document.querySelectorAll(".slidercontainer")[0]);

        if (this.getAddCosmicObject()) {
            document.getElementById("cosmicObjectButton").style.backgroundColor = "lightblue";
            selected.style.visibility = "visible";
            $('#cameraToObjectButton').prop('disabled', true);
            (this.getScene()).add(this.getObjectOrbit());
            this.setAddCosmicObject(false);

            // Hide physical table, color of planet/orbit is change for 2nd object
            document.getElementById("sidebarPlanetInfo").style.left = "-300px";
            document.getElementById("sidebarMoonInfo").style.left = "-300px";
        } else if (!(this.getAddCosmicObject())) {
            (this.getScene()).remove(this.getCosmicObject());
            if (window.myParam != undefined) {
                var selectedPlanet = window.myParam[0].object;
                this.moonsVisibilityOfSelectedPlanet(selectedPlanet, true);
                this.setVisibilityOfSceneChild("Moon", true);
            }
            document.getElementById("cosmicObjectButton").style.backgroundColor = "#061327";
            selected.style.visibility = "hidden";
            $('#cameraToObjectButton').prop('disabled', false);
            (this.getScene()).remove(this.getObjectOrbit());
            this.setAddCosmicObject(true);
        }
    }

    // Hides moons of seletected planet when cosmic object is added to scene
    // -------------------------------------------------------------------------
    moonsVisibilityOfSelectedPlanet(selectedPlanet, showObjectsBoolean) {
        // Specially for Moon, problems with showing its orbit and object
        this.setVisibilityOfSceneChild("Moon", true);

        if (selectedPlanet.name == "Venus" || selectedPlanet.name == "Earth") {
            this.setVisibilityOfSceneChild("Moon", showObjectsBoolean);
            this.setVisibilityOfSceneChild("Mesic", showObjectsBoolean);
            this.setVisibilityOfSceneChild("Mesiac", showObjectsBoolean);
        } else if (selectedPlanet.name == "Jupiter") {
            this.setVisibilityOfSceneChild("Io", showObjectsBoolean);
            this.setVisibilityOfSceneChild("Europa", showObjectsBoolean);
            this.setVisibilityOfSceneChild("Ganymede", showObjectsBoolean);
            this.setVisibilityOfSceneChild("Callisto", showObjectsBoolean);
        } else if (selectedPlanet.name == "Saturn") {
            this.setVisibilityOfSceneChild("Rhea", showObjectsBoolean);
            this.setVisibilityOfSceneChild("Titan", showObjectsBoolean);
        } else if (selectedPlanet.name == "Uranus") {
            this.setVisibilityOfSceneChild("Ariel", showObjectsBoolean);
            this.setVisibilityOfSceneChild("Umbriel", showObjectsBoolean);
            this.setVisibilityOfSceneChild("Titania", showObjectsBoolean);
            this.setVisibilityOfSceneChild("Oberon", showObjectsBoolean);
        } else if (selectedPlanet.name == "Neptune") {
            this.setVisibilityOfSceneChild("Triton", showObjectsBoolean);
        } else if (selectedPlanet.name == "Mercury" || selectedPlanet.name == "Mars") {
            this.setIsPlanetClicked(true);
        } else { this.setIsPlanetClicked(false); }
    }

    setVisibilityOfSceneChild(childName, showObjectsBoolean) {
        // Find object and its orbit by name + its name on scene 
        (this.getScene()).traverse(function(children) {
            if (children.name == childName || children.name == "name" + childName) {
                children.visible = showObjectsBoolean;
            }
        });
        this.setIsPlanetClicked(true);
    }

    // Find clicked planet to show cosmic object, called in ModelScene - rotateSceneObjects()
    // -------------------------------------------------------------------------
    findClickedPlanet(force) {
        var buttonColor = document.getElementById("cosmicObjectButton").style.backgroundColor;
        if (window.myParam != undefined && buttonColor == "lightblue") {
            var selectedPlanet = window.myParam[0].object;
            this.moonsVisibilityOfSelectedPlanet(selectedPlanet, false);

            if (this.getIsPlanetClicked()) {
                var meshOrder = this.getIndexOfSelectedPlanet(selectedPlanet);
                this.addCosmicObjectToOrbit(buttonColor, this.getCosmicObject(), this.getPlanetMeshes(), meshOrder,
                    force, this.getObjectOrbit());
                (this.getScene()).add(this.getCosmicObject());
            } else if (!this.getIsPlanetClicked()) {
                (this.getScene()).remove(this.getCosmicObject());
            }
        }
    }

    // Position cosmic object on its orbit, change shape of orbit and rotation speed
    // -------------------------------------------------------------------------
    addCosmicObjectToOrbit(buttonColor, cosmicObject, planetMeshes, planetOrder, force, orbit) {
        if (window.myParam != undefined && buttonColor == "lightblue") {
            var selectedPlanet = window.myParam[0].object.name;
            orbit.position.x = planetMeshes[planetOrder].position.x;
            orbit.position.z = planetMeshes[planetOrder].position.z;

            // When force is changed, change (1x) shape of orbit in f. positionCosmicObject()
            if (this.getLastSpeedFromSlider() !== force) {
                this.setIsSpeedChanged(true);
            }

            this.positionCosmicObject(selectedPlanet, cosmicObject, orbit, force);
            this.setLastSpeedFromSlider(force);
            this.setIsSpeedChanged(false);
        }
    }

    positionCosmicObject(selectedPlanet, cosmicObject, orbit, force) {
        var dataOfCurrentPlanetJSON = (this.getPlanetData())[0];
        var changeX, changeY, orbitPoint = 0;

        (async() => {
            var valueX = this.getCurrentForceForAxisX();
            var valueZ = this.getCurrentForceForAxisZ();
            var time = this.getCosmicObjectMovingTime();
            var isSpeedChanged = this.getIsSpeedChanged();

            var promiseValue = dataOfCurrentPlanetJSON.then(function(result) {
                changeX = result[selectedPlanet]["cosmicObjectDistanceX"] * valueX * 0.5;
                changeY = result[selectedPlanet]["cosmicObjectDistanceZ"] * valueZ * 0.5;

                orbit.scale.set(changeX, changeY, 1);
                orbitPoint = new THREE.Vector3(
                    changeX * Math.cos(result[selectedPlanet]["cosmicObjectSpeed"] * Math.PI * (-0.00001) * time), 0,
                    changeY * Math.sin(result[selectedPlanet]["cosmicObjectSpeed"] * Math.PI * (-0.00001) * time));
                cosmicObject.position.set(orbit.position.x + orbitPoint.x, orbit.position.y, orbit.position.z + orbitPoint.z);
            });

            await promiseValue; // await - to read data from Promise.then()
            this.changeShapeOfObjectOrbit(isSpeedChanged, selectedPlanet, orbitPoint.x, force, orbit);
            this.changeRotationSpeedOfObject(orbit, cosmicObject, force);
        })();
    }

    // Change speed according position of cosmic object - perihelion/aphelion 
    changeRotationSpeedOfObject(orbit, cosmicObject, force) {
        // Vectors set to position of center planet and object
        // Vectors are good to calculate distance between 2 points
        this.setVectorPlanet(orbit.position.x, orbit.position.z);
        this.setVectorCosmicObject(cosmicObject.position.x, cosmicObject.position.z);
        this.setVectorsDistance((this.getVectorCosmicObject()).distanceTo(this.getVectorPlanet()));

        if (force == 1) {
            this.setCosmicObjectMovingTime(50);
        } else {
            if (this.getVectorsDistance() > (2 * force)) {
                // slow down, object is on perihelion (further away)
                this.setCosmicObjectMovingTime(30);
            } else if (this.getVectorsDistance() < (2 * force)) {
                // speed up, object is closer to its planet (aphelion)
                this.setCosmicObjectMovingTime(50);
            }
        }
    }

    // Change shape of cosmic object orbit according force (and change of object's speed) and object's position
    changeShapeOfObjectOrbit(isSpeedChanged, selectedPlanet, orbitPointX, force, orbit) {
        if (isSpeedChanged) {
            this.setLastForceForAxisX(this.getCurrentForceForAxisX());
            this.setLastForceForAxisZ(this.getCurrentForceForAxisZ());

            var positionX = 1.4;
            if (selectedPlanet == "Mercury") { // orbit for object is too small, original value did not work right
                positionX = 0.6;
            }

            if (orbitPointX < positionX && orbitPointX > -positionX) {
                // change shape on axis-x, object is position on x-axis between values -1.4 and +1.4
                this.setCurrentForceForAxisX(force);
                this.setCurrentForceForAxisZ(this.getLastForceForAxisZ());
            } else {
                this.setCurrentForceForAxisX(this.getLastForceForAxisX());
                this.setCurrentForceForAxisZ(force);
            }
            orbit.scale.set(this.getCurrentForceForAxisX(), this.getCurrentForceForAxisZ(), 1);
        }
    }
}