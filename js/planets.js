class Planet {
    constructor(scene) {
        this.scene = scene;
        this.planetsObjects = [];
        this.planetsMeshes = [];
        this.planetsNamesOnScene = [];
        this.allPlanetDataJSON = [];
        this.allMoonDataJSON = [];
        this.planetSizes = [];
        this.betha = 0;
        this.timestamp = 0;
        //this.speedValueChanger = 1;

        this.jsonManager = new JSONManager();
        this.addAllPlanetDataJSON();
        this.addAllMoonDataJSON();

        this.orbitClass = new Orbits(scene, this.allPlanetDataJSON, this.allMoonDataJSON, this.planetsMeshes);
    }

    createPlanetObject = function(diameter) {
        return new THREE.SphereBufferGeometry(diameter, 50, 50);
    }

    setNewMesh = function(imageSrc) {
        let texture = new THREE.TextureLoader().load(imageSrc);
        this.meshMaterial = new THREE.MeshPhongMaterial({ map: texture });
        this.meshMaterial.receiveShadow = true;
        this.meshMaterial.castShadow = true;
        return this.meshMaterial;
    }

    createMesh = function(planetObject, imageSrc) {
        return new THREE.Mesh(planetObject, this.setNewMesh(imageSrc));
    }

    // Called in scene.js - class MainScene
    initializePlanets = function() {
        this.createPlanetsMesh(this.scene, this.planetsObjects);
        this.orbitClass.createOrbitShape();
        this.addNamesToPlanetObject(this.planetsMeshes, this.planetsNamesOnScene, this.scene);
        this.setRotationAngleForAllPlanets();
    }

    getPlanetMeshes = function() { return this.planetsMeshes; }
    getScaleValue = function() { return this.scaleValueScene; }
    getPlanetData = function() { return this.allPlanetDataJSON; }
    getMoonData = function() { return this.allMoonDataJSON; }
    getPlanetsNamesOnScene = function() { return this.planetsNamesOnScene; }
    getTimestamp = function() { return this.timestamp; }
        // getRotationSpeedValue = function() { return this.speedValueChanger; }
        // setRotationSpeedValue = function(value) { this.speedValueChanger += value; }
        // resetRotationSpeedValue = function() { this.speedValueChanger = 1; }
}


// Read data from JSON and save them
// -------------------------------------------------------------------------
Planet.prototype.addAllPlanetDataJSON = function() {
    this.allPlanetDataJSON.push(this.jsonManager.readPlanetsData());
}

Planet.prototype.addAllMoonDataJSON = function() {
    this.allMoonDataJSON.push(this.jsonManager.readMoonsData());
}

// Creating planet objects
// -------------------------------------------------------------------------
// DOCASNE, OPRAVIT ABY NEBOLI HODNOTY NASTAVOVANE PRIAMO
Planet.prototype.createPlanets = function() {
    // 27x smaller scale for Sun; 5-6x smaller scale for Jupiter, Saturn, Uranus, Neptune
    var planetSizes = [0.3829, 0.9499, 1, 0.5320, 10.97 / 6, 9.140 / 6, 3.981 / 5, 3.865 / 5];
    for (var i = 0; i < planetSizes.length; i++) {
        this.planetsObjects.push(this.createPlanetObject(planetSizes[i]));
    }
}

Planet.prototype.createPlanetsMesh = function(scene, planetsObjects) {
    this.createPlanets();
    this.mercuryMesh = this.createMesh(planetsObjects[0], '/images/textures/mercuryTexture2k.jpg');
    this.venusMesh = this.createMesh(planetsObjects[1], '/images/textures/venusTexture2k.jpg');
    this.earthMesh = this.createMesh(planetsObjects[2], '/images/textures/earthTexture2k.jpg');
    this.marsMesh = this.createMesh(planetsObjects[3], '/images/textures/marsTexture2k.jpg');
    this.jupiterMesh = this.createMesh(planetsObjects[4], '/images/textures/jupiterTexture2k.jpg');
    this.saturnMesh = this.createMesh(planetsObjects[5], '/images/textures/saturnTexture2k.jpg');
    this.uranusMesh = this.createMesh(planetsObjects[6], '/images/textures/uranusTexture2k.jpg');
    this.neptuneMesh = this.createMesh(planetsObjects[7], '/images/textures/neptuneTexture2k.jpg');

    this.planetsMeshes.push(this.mercuryMesh, this.venusMesh, this.earthMesh, this.marsMesh,
        this.jupiterMesh, this.saturnMesh, this.uranusMesh, this.neptuneMesh);
    this.addNamesToPlanetMeshes();
    this.addMeshToScene(scene, this.planetsMeshes);
}

Planet.prototype.addMeshToScene = function(scene, planetsMeshes) {
    for (var i = 0; i < planetsMeshes.length; i++) {
        scene.add(planetsMeshes[i]);
    }
}

Planet.prototype.addNamesToPlanetMeshes = function() {
    var planetNames = ["Mercury", "Venus", "Earth", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune"];

    for (i = 0; i < planetNames.length; i++) {
        (this.planetsMeshes[i]).name = planetNames[i];
    }
}

// Names for planets on Scene: TextGeometry
// -------------------------------------------------------------------------
Planet.prototype.createTextGeometry = function(planetsMeshes, planetsNamesOnScene, scene, objectNames, fontSize) {
    var geometry, textMesh;
    const loader = new THREE.FontLoader();

    loader.load('node_modules/three/examples/fonts/helvetiker_regular.typeface.json', function(font) {
        var material = new THREE.MeshNormalMaterial();
        material.transparent = false;

        for (i = 0; i < planetsMeshes.length; i++) {
            geometry = new THREE.TextGeometry(objectNames[i], {
                font: font,
                size: fontSize,
                height: 0,
                bevelEnabled: false
            });
            textMesh = new THREE.Mesh(geometry, material);
            textMesh.setRotationFromAxisAngle(
                new THREE.Vector3(1, 0, 0),
                (Math.PI / 2 * 3)
            );

            planetsNamesOnScene.push(textMesh);
            planetsMeshes[i].add(textMesh);
            textMesh.name = "name" + objectNames[i];
            scene.add(textMesh);
        }
    });
}

Planet.prototype.addNamesToPlanetObject = function(planetsMeshes, planetsNamesOnScene, scene) {
    var planetNames = ["Mercury", "Venus", "Earth", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune"];
    this.createTextGeometry(planetsMeshes, planetsNamesOnScene, scene, planetNames, 1.2);

}

// Setting rotation angle for planets on Z-axis 
// -------------------------------------------------------------------------
Planet.prototype.setRotationAngleForSinglePlanet = function(planetMesh, planetName) {
    var dataOfCurrentPlanetJSON = this.allPlanetDataJSON[0];

    dataOfCurrentPlanetJSON.then(function(result) {
        planetMesh.setRotationFromAxisAngle(
            new THREE.Vector3(0, 0, 1),
            (result[planetName]["tiltAxisZ"] * Math.PI) / 180
        );
    });
}

Planet.prototype.setRotationAngleForAllPlanets = function() {
    var planetNames = ["Mercury", "Venus", "Earth", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune"];
    for (var i = 0; i < this.planetsMeshes.length; i++) {
        this.setRotationAngleForSinglePlanet(this.planetsMeshes[i], planetNames[i]);
    }
}

// Setting planets' and orbits' positions - according to rangeslider scale value
// -------------------------------------------------------------------------
Planet.prototype.setScaleForPlanetsAndOrbits = function(scaleValue, planetsMeshes) {
    this.scaleObjectMeshesByRangeslider(scaleValue, planetsMeshes);
    this.orbitClass.scaleOrbitsByRangeslider(scaleValue);
    this.orbitClass.positionAllMoonOrbits();
}

Planet.prototype.scaleObjectMeshesByRangeslider = function(scaleValue, objects) {
    for (var i = 0; i < objects.length; i++) {
        objects[i].scale.set(2 * scaleValue, 2 * scaleValue, 2 * scaleValue);
    }
}

// Moving planets on their orbits (ellipses)
// -------------------------------------------------------------------------
Planet.prototype.calculateRotationSpeed = function(planetOrder, speedValue, time, planetRotationSpeedAroundSun) {
    //window.setTimeout(this.timeOutForSpeedCalculation(speedValue), 10000);
    if (speedValue == 0) {
        this.timestamp = (planetRotationSpeedAroundSun[planetOrder] * 0.0001 * time);
    } else if (speedValue > 0) {
        this.timestamp = (planetRotationSpeedAroundSun[planetOrder] * 0.0001 * time) * speedValue;
    } else if (speedValue < 0) {
        this.timestamp = (planetRotationSpeedAroundSun[planetOrder] * 0.0001 * time) / Math.abs(speedValue);
    }
    return this.timestamp;
}

Planet.prototype.rotatePlanetOnOrbit = function(planetMesh, planetOrder, planetName, planetNameOnScene, scaleValue, speedValue, time) {
    var planetRotationSpeedAroundSun = [1.607, 1.174, 1.000, 0.802, 0.434, 0.323, 0.228, 0.128];
    var rotationSpeed = this.calculateRotationSpeed(planetOrder, speedValue, time, planetRotationSpeedAroundSun);

    if (planetMesh.position.z != 0 || planetMesh.position.z != NaN) {
        this.betha = Math.cos(planetMesh.position.x / planetMesh.position.z);
    }
    this.positionPlanetOnOrbit(planetMesh, planetName, planetNameOnScene, scaleValue * 2, true, rotationSpeed);
}

// Called in f. animate() (scene.js) - movement needs to by redrawn by renderer
Planet.prototype.rotateAllPlanets = function(scaleValue, speedValue, time) {
    var planetMesh;
    var planetNames = ["Mercury", "Venus", "Earth", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune"];

    for (var i = 0; i < this.planetsMeshes.length; i++) {
        planetMesh = this.planetsMeshes[i];
        this.rotatePlanetOnOrbit(planetMesh, i, planetNames[i], this.planetsNamesOnScene[i], scaleValue, speedValue, time);
    }
}

// Positions for 1 planet - according to scale from rangeslider
// -------------------------------------------------------------------------
Planet.prototype.positionPlanetOnOrbit = function(planetMesh, planetName, planetNameOnScene, scaleValue, isZoomIn, timestamp) {
    var dataOfCurrentPlanetJSON = this.allPlanetDataJSON[0];
    var halfSizeOfUranus = orbitalSpeed = 0;

    dataOfCurrentPlanetJSON.then(function(result) {
        // PÔVODNE PRE ZOOM >= 100 
        // if (planetName == "Uranus" && isZoomIn == true) {
        //     halfSizeOfUranus = result[planetName]["planetSize"] * scaleValue;
        // } else { halfSizeOfUranus = 0; }

        // PÔVODNE PRE ZOOM < 100
        // if (planetName == "Saturn") {
        //     halfSizeOfPlanet = result[planetName]["planetSize"] * scaleValue;
        // } else if (planetName == "Uranus") {
        //     halfSizeOfPlanet = result[planetName]["planetSize"] / scaleValue / 2;
        // } else { halfSizeOfPlanet = 0; }

        orbitalSpeed = result[planetName]["rotationSpeed"] / 15; // orbital speed was too high
        planetMesh.position.x = -3 * result[planetName]["c"] +
            (result[planetName]["a"] * result[planetName]["scaleFactor"] * scaleValue * Math.cos(timestamp * orbitalSpeed)) - halfSizeOfUranus;
        planetMesh.position.z = -1 * (result[planetName]["b"] * result[planetName]["scaleFactor"] * scaleValue *
            Math.sin(timestamp * orbitalSpeed));

        if (planetNameOnScene != undefined && planetNameOnScene.visible == true) {
            planetNameOnScene.position.x = planetMesh.position.x + result[planetName]["planetSize"] * scaleValue + 1;
            planetNameOnScene.position.z = planetMesh.position.z;
        }
    });
}