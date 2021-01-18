class Planet {
    constructor(scene) {
        this.scene = scene;
        this.planetsObjects = [];
        this.planetsMeshes = [];
        this.allDataJSON = [];
        this.planetSizes = [];
        this.betha = 0;
        this.timestamp = 0;

        this.jsonManager = new JSONManager();
        this.addAllDataJSON();

        this.orbitClass = new Orbits(scene, this.allDataJSON, this.planetsMeshes);
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
        this.createPlanets();
        this.createPlanetsMesh(this.scene, this.planetsObjects);
        this.setRotationAngleForAllPlanets();
        this.orbitClass.createOrbitShape();
    }

    getPlanetMeshes = function() { return this.planetsMeshes; }
    getScaleValue = function() { return this.scaleValueScene; }
    getDataJSON = function() { return this.allDataJSON; }
}


// Read data from JSON and save them
// -------------------------------------------------------------------------
Planet.prototype.addAllDataJSON = function() {
    var data = [this.mercuryDataJSON, this.venusDataJSON, this.earthDataJSON, this.marsDataJSON,
        this.jupiterDataJSON, this.saturnDataJSON, this.uranusDataJSON, this.neptuneDataJSON
    ];
    var planetNames = ["Mercury", "Venus", "Earth", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune"];

    for (var i = 0; i < planetNames.length; i++) {
        data[i] = this.jsonManager.readPlanetData(planetNames[i]);
        this.allDataJSON.push(data[i]);
    }
}

// Creating planet objects
// -------------------------------------------------------------------------
// DOCASNE, OPRAVIT ABY NEBOLI HODNOTY NASTAVOVANE PRIAMO
Planet.prototype.createPlanets = function() {
    // 10x smaller scale: Sun; 3x smaller scale: Jupiter, Saturn, Uranus, Neptune
    var planetSizes = [0.175, 0.435, 0.457, 0.243, 1.673, 1.394, 0.607, 0.589];
    for (var i = 0; i < planetSizes.length; i++) {
        this.planetsObjects.push(this.createPlanetObject(planetSizes[i]));
    }
}

// NEFUNGUJE, PLANETY NIE SU V  POLI "planetsObjects" PRISTUPNE MIMO FUNKCIE .then 
// Planet.prototype.getPlanetSizes = function(planetsObjects) {
//     var dataOfCurrentPlanetJSON;

//     for (var i = 0; i < 8; i++) {
//         dataOfCurrentPlanetJSON = this.allDataJSON[i];
//         dataOfCurrentPlanetJSON.then(function(result) {
//             planetsObjects.push(new THREE.SphereBufferGeometry(result["planetSize"], 50, 50));
//         });
//     }
// }

Planet.prototype.createPlanetsMesh = function(scene, planetsObjects) {
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
    this.addMeshToScene(scene);
}

Planet.prototype.addMeshToScene = function(scene) {
    for (var i = 0; i < this.planetsMeshes.length; i++) {
        scene.add(this.planetsMeshes[i]);
    }
}

// Setting rotation angle for planets on Z-axis 
// -------------------------------------------------------------------------
Planet.prototype.setRotationAngleForSinglePlanet = function(planetMesh, planetOrder) {
    var dataOfCurrentPlanetJSON = this.allDataJSON[planetOrder];

    dataOfCurrentPlanetJSON.then(function(result) {
        planetMesh.setRotationFromAxisAngle(
            new THREE.Vector3(0, 0, 1),
            (result["tiltAxisZ"] * Math.PI) / 180
        );
    });
}

Planet.prototype.setRotationAngleForAllPlanets = function() {
    for (var i = 0; i < this.planetsMeshes.length; i++) {
        this.setRotationAngleForSinglePlanet(this.planetsMeshes[i], i);
    }
}

// Setting planets' and orbits' positions - according to rangeslider scale value
// -------------------------------------------------------------------------
Planet.prototype.setScaleForPlanetsAndOrbits = function(scaleValue, planetsMeshes) {
    var scale = scaleValue * 200; // value used in scene.js, original from rangeslider
    // Changed scale for better view
    if (scale > 100) {
        this.scaleMeshesRangesliderZoomIn(scaleValue, planetsMeshes);
        this.orbitClass.scaleOrbitsRangesliderZoomIn(scaleValue);
    } else if (scale < 100) {
        scaleValue *= -1;
        this.scaleMeshesRangesliderNegativeValue(scaleValue, planetsMeshes);
        this.orbitClass.scaleOrbitsRangesliderZoomOut(scaleValue);
    } else {
        this.scaleMeshesToOriginalSize(planetsMeshes);
        this.orbitClass.scaleOrbitsToOriginalSize();
    }
}

Planet.prototype.scaleMeshesRangesliderZoomIn = function(scaleValue, objects) {
    for (var i = 0; i < objects.length; i++) {
        objects[i].scale.set(2 * scaleValue, 2 * scaleValue, 2 * scaleValue);
    }
}

Planet.prototype.scaleMeshesRangesliderNegativeValue = function(scaleValue, objects) {
    for (var i = 0; i < objects.length; i++) {
        // cannot use number 1 for planets, because: (1 / -1 * 1) = 1, so -1 would not zoom out
        objects[i].scale.set((-1 * scaleValue) / 0.5, (-1 * scaleValue) / 0.5, (-1 * scaleValue) / 0.5);
    }
}

Planet.prototype.scaleMeshesToOriginalSize = function(objects) {
    for (var i = 0; i < objects.length; i++) {
        objects[i].scale.set(1, 1, 1);
    }
}

// Moving planets on their orbits (ellipses)
// -------------------------------------------------------------------------
Planet.prototype.calculateRotationSpeed = function(planetOrder, speedValue) {
    var rotationSpeedAroundSun = [1.607, 1.174, 1.000, 0.802, 0.434, 0.323, 0.228, 0.128];

    if (speedValue == 0) {
        this.timestamp = (rotationSpeedAroundSun[planetOrder] * 0.0001 * Date.now());
    } else if (speedValue > 0) {
        this.timestamp = (rotationSpeedAroundSun[planetOrder] * 0.0001 * Date.now()) * speedValue;
    } else if (speedValue < 0) {
        this.timestamp = (rotationSpeedAroundSun[planetOrder] * 0.0001 * Date.now()) / Math.abs(speedValue);
    }
    return this.timestamp;
}

Planet.prototype.rotatePlanetOnOrbit = function(planet, planetOrder, scaleValue, speedValue) {
    var rotationSpeed = this.calculateRotationSpeed(planetOrder, speedValue);
    // + rotationSpeed: because of division by zero
    this.betha = Math.cos(planet.position.x / (planet.position.z + rotationSpeed));
    var scale = scaleValue * 200;

    // scaleValue is used because of zooming in/out by rangeslider
    if (scale > 100) {
        this.positionPlanetRangesliderZoomIn(planet, planetOrder, scaleValue, this.betha, rotationSpeed);
    } else if (scale < 100) {
        this.positionPlanetRandesliderZoomOut(planet, planetOrder, scaleValue, this.betha, rotationSpeed);
    } else {
        this.positionPlanetToOriginalPosition(planet, planetOrder, this.betha, rotationSpeed);
    }
}

// Called in f. animate() (scene.js) - movement needs to by redrawn by renderer
Planet.prototype.rotateAllPlanets = function(scaleValue, speedValue) {
    var planet;

    for (var i = 0; i < this.planetsMeshes.length; i++) {
        planet = this.planetsMeshes[i];
        this.rotatePlanetOnOrbit(planet, i, scaleValue, speedValue);
    }
}

// Positions for planet - according to scale from rangeslider
// -------------------------------------------------------------------------
Planet.prototype.positionPlanetRangesliderZoomIn = function(planetMesh, planetOrder, scaleValue, betha, timestamp) {
    var scale = scaleValue * 2;
    var dataOfCurrentPlanetJSON = this.allDataJSON[planetOrder];
    var halfSizeOfUranus = 0;

    dataOfCurrentPlanetJSON.then(function(result) {
        if (planetOrder == 6) {
            halfSizeOfUranus = result["planetSize"] * scale / 2;
        } else { halfSizeOfUranus = 0; }

        planetMesh.position.x = result["c"] + (result["a"] * result["scaleFactor"] * scale * Math.cos(betha + timestamp)) +
            halfSizeOfUranus;
        planetMesh.position.z = -1 * (result["b"] * result["scaleFactor"] * scale * Math.sin(betha + timestamp));
    });
}

Planet.prototype.positionPlanetRandesliderZoomOut = function(planetMesh, planetOrder, scaleValue, betha, timestamp) {
    // The same scale as in class Orbits
    var scale = (-1 * scaleValue) / 0.5;
    var dataOfCurrentPlanetJSON = this.allDataJSON[planetOrder];
    var halfSizeOfUranus = 0;

    dataOfCurrentPlanetJSON.then(function(result) {
        if (planetOrder == 6) {
            halfSizeOfUranus = result["planetSize"] * scaleValue;
        } else {
            halfSizeOfUranus = 0;
            result["c"] = 0;
        }

        planetMesh.position.x = result["c"] + (result["a"] * result["scaleFactor"] * scale * Math.cos(betha + timestamp)) - halfSizeOfUranus;
        planetMesh.position.z = -1 * (result["b"] * result["scaleFactor"] * scale * Math.sin(betha + timestamp));
    });
}

Planet.prototype.positionPlanetToOriginalPosition = function(planetMesh, planetOrder, betha, timestamp) {
    var dataOfCurrentPlanetJSON = this.allDataJSON[planetOrder];
    // "dataOfCurrentPlanetJSON" is equal to Promise, we need data from the Promise
    dataOfCurrentPlanetJSON.then(function(result) {
        planetMesh.position.x = result["c"] + (result["a"] * result["scaleFactor"] * Math.cos(betha + timestamp));
        planetMesh.position.z = -1 * (result["b"] * result["scaleFactor"] * Math.sin(betha + timestamp));
    });
}