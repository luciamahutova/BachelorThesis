class Planet {
    constructor(scene) {
        this.scene = scene;
        this.planetsObjects = [];
        this.planetsMeshes = [];
        this.betha = 0;
        this.timestamp = Date.now() * 0.000001;

        this.orbitClass = new Orbits(scene, this.planetData, this.planetsMeshes);
        this.jsonManager = new JSONManager();

        this.allDataJSON = [];
        this.addAllDataJSON();
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
        this.createPlanets(this.planetData);
        this.createPlanetsMesh(this.scene);
        this.setRotationAngleForAllPlanets();
        this.orbitClass.createOrbitShape();
    }

    getPlanetMeshes = function() {
        return this.planetsMeshes;
    }

    getScaleValue = function() {
        return this.scaleValueScene;
    }
}


// Read data from JSON and save them
// -------------------------------------------------------------------------
Planet.prototype.addAllDataJSON = function() {
    this.mercuryDataJSON = this.jsonManager.readPlanetData("Mercury");
    this.venusDataJSON = this.jsonManager.readPlanetData("Venus");
    this.earthDataJSON = this.jsonManager.readPlanetData("Earth");
    this.marsDataJSON = this.jsonManager.readPlanetData("Mars");
    this.jupiterDataJSON = this.jsonManager.readPlanetData("Jupiter");
    this.saturnDataJSON = this.jsonManager.readPlanetData("Saturn");
    this.uranusDataJSON = this.jsonManager.readPlanetData("Uranus");
    this.neptuneDataJSON = this.jsonManager.readPlanetData("Neptune");

    this.allDataJSON.push(this.mercuryDataJSON, this.venusDataJSON, this.earthDataJSON, this.marsDataJSON,
        this.jupiterDataJSON, this.saturnDataJSON, this.uranusDataJSON, this.neptuneDataJSON);

    // a: semi-major axis, which is the largest distance between the center of the ellipse and the curve of the orbit
    // b: semi-minor axis, which is the shortest distance between the center of the ellipse and the curve of the orbit
    // c: distance between the center of the orbit and the focus of the orbit, which is where the Sun would be in a     planetary orbit.
    // e: eccentricity, which is the measure of the deviation of the shape of an orbit from that of a perfect circle (a measure of how elliptical an orbit is). The higher the eccentricity of an orbit, the more elliptical it is;
    // tiltAxisZ: planets' tilt angle around its axis = Z
    // scaleFaktor: my values for better view of all planets
}

// Creating planet objects
// -------------------------------------------------------------------------
Planet.prototype.createPlanets = function(planetData) {
    // 10x smaller scale for the Sun
    this.mercury = this.createPlanetObject(planetData[0]["planetSize"]);
    this.venus = this.createPlanetObject(planetData[1]["planetSize"]);
    this.earth = this.createPlanetObject(planetData[2]["planetSize"]);
    this.mars = this.createPlanetObject(planetData[3]["planetSize"]);
    // 3x smaller scale (4 planets)
    this.jupiter = this.createPlanetObject(planetData[4]["planetSize"]);
    this.saturn = this.createPlanetObject(planetData[5]["planetSize"]);
    this.uranus = this.createPlanetObject(planetData[6]["planetSize"]);
    this.neptune = this.createPlanetObject(planetData[7]["planetSize"]);

    this.planetsObjects.push(this.mercury, this.venus, this.earth, this.mars,
        this.jupiter, this.saturn, this.uranus, this.neptune);
}

Planet.prototype.createPlanetsMesh = function(scene) {
    this.mercuryMesh = this.createMesh(this.planetsObjects[0], '/images/textures/mercuryTexture2k.jpg');
    this.venusMesh = this.createMesh(this.planetsObjects[1], '/images/textures/venusTexture2k.jpg');
    this.earthMesh = this.createMesh(this.planetsObjects[2], '/images/textures/earthTexture2k.jpg');
    this.marsMesh = this.createMesh(this.planetsObjects[3], '/images/textures/marsTexture2k.jpg');
    this.jupiterMesh = this.createMesh(this.planetsObjects[4], '/images/textures/jupiterTexture2k.jpg');
    this.saturnMesh = this.createMesh(this.planetsObjects[5], '/images/textures/saturnTexture2k.jpg');
    this.uranusMesh = this.createMesh(this.planetsObjects[6], '/images/textures/uranusTexture2k.jpg');
    this.neptuneMesh = this.createMesh(this.planetsObjects[7], '/images/textures/neptuneTexture2k.jpg');

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
        console.log(result["tiltAxisZ"]);
    });
}

Planet.prototype.setRotationAngleForAllPlanets = function() {
    for (var i = 0; i < this.planetsMeshes.length; i++) {
        this.setRotationAngleForSinglePlanet(this.planetsMeshes[i], i);
    }
}

// Setting scale for planets and orbits (according to rangeslider value)
// -------------------------------------------------------------------------
Planet.prototype.setScaleForPlanetsAndOrbits = function(scaleValue, planetsMeshes) {
    // Changed scale for better view
    if (scaleValue > 0) {
        this.scaleMeshesRangesliderPositiveValue(scaleValue, planetsMeshes);
        this.orbitClass.scaleOrbitsRangesliderPositiveValue(scaleValue);
    } else if (scaleValue < 0) {
        scaleValue *= -1;
        this.scaleMeshesRangesliderNegativeValue(scaleValue, planetsMeshes);
        this.orbitClass.scaleOrbitsRangesliderNegativeValue(scaleValue);
    } else {
        this.scaleMeshesToOriginalSize(planetsMeshes);
        this.orbitClass.scaleOrbitsToOriginalSize();
    }
}

Planet.prototype.scaleMeshesRangesliderPositiveValue = function(scaleValue, objects) {
    for (var i = 0; i < objects.length; i++) {
        objects[i].scale.set(2 * scaleValue, 2 * scaleValue, 2 * scaleValue);
    }
}

Planet.prototype.scaleMeshesRangesliderNegativeValue = function(scaleValue, objects) {
    for (var i = 0; i < objects.length; i++) {
        // cannot use number 1 for planets, because: (1 / -1 * 1) = 1, so -1 would not zoom out
        objects[i].scale.set(0.8 / (-1 * scaleValue), 0.8 / (-1 * scaleValue), 0.8 / (-1 * scaleValue));
    }
}

Planet.prototype.scaleMeshesToOriginalSize = function(objects) {
    for (var i = 0; i < objects.length; i++) {
        objects[i].scale.set(1, 1, 1);
    }
}

// Moving planets on their orbits (ellipses)
// -------------------------------------------------------------------------
Planet.prototype.rotatePlanetOnOrbit = function(planet, planetOrder, scaleValue) {
    // PREROBIT, VSETKY SA TOCIA ROVNAKO RYCHLO
    // this.timestamp += (this.planetData[planetOrder]["rotationSpeedAroundSun"] / 5000);
    this.timestamp += 0.0001;
    this.betha = Math.cos(planet.position.x / (planet.position.z + this.timestamp));

    // scaleValue is used because of zooming in/out by rangeslider
    if (scaleValue > 0) {
        this.positionPlanetOnRangesliderPositiveValue(planet, planetOrder, scaleValue, this.betha, this.timestamp);
        this.positionUranusOnRangesliderPositiveValue(this.uranusMesh, scaleValue, this.betha, this.timestamp);
    } else if (scaleValue < 0) {
        this.positionPlanetOnRangesliderNegativeValue(planet, planetOrder, scaleValue, this.betha, this.timestamp);
        this.positionUranusOnRangesliderNegativeValue(this.uranusMesh, scaleValue, this.betha, this.timestamp);
    } else {
        this.positionPlanetToOriginalPosition(planet, planetOrder, this.betha, this.timestamp);
    }
}

// Called in f. animate() (scene.js) - movement needs to by redrawn by renderer
Planet.prototype.rotateAllPlanets = function(scaleValue) {
    var planet;
    for (var i = 0; i < this.planetsMeshes.length; i++) {
        planet = this.planetsMeshes[i];
        this.rotatePlanetOnOrbit(planet, i, scaleValue);
    }
}

// Positions for planet - according to scale from rangeslider
// -------------------------------------------------------------------------
Planet.prototype.positionPlanetOnRangesliderPositiveValue = function(planetMesh, planetOrder, scaleValue, betha, timestamp) {
    var scale = scaleValue * 2;
    var dataOfCurrentPlanetJSON = this.allDataJSON[planetOrder];

    // (-1 * ...) for anticlockwise rotation
    dataOfCurrentPlanetJSON.then(function(result) {
        planetMesh.position.x = result["c"] + (result["a"] * result["scaleFactor"] * scale * Math.cos(betha + timestamp));
        planetMesh.position.z = -1 * (result["b"] * result["scaleFactor"] * scale * Math.sin(betha + timestamp));
    });
}

Planet.prototype.positionUranusOnRangesliderPositiveValue = function(planetMesh, scaleValue, betha, timestamp) {
    var scale = scaleValue * 2;
    var dataOfCurrentPlanetJSON = this.allDataJSON[6];
    // Specially positioned because of its angle rotation (nearly 100 degrees)

    dataOfCurrentPlanetJSON.then(function(result) {
        var halfSizeOfUranus = result["planetSize"] / scaleValue / 2;

        planetMesh.position.x = result["c"] + (result["a"] * result["scaleFactor"] * scale * Math.cos(betha + timestamp)) +
            halfSizeOfUranus;
        planetMesh.position.z = -1 * (result["b"] * result["scaleFactor"] * scale * Math.sin(betha + timestamp)) +
            halfSizeOfUranus;
    });
}

Planet.prototype.positionPlanetOnRangesliderNegativeValue = function(planetMesh, planetOrder, scaleValue, betha, timestamp) {
    // The same scale as in class Orbits
    var scale = 0.5 / (-1 * scaleValue);
    var dataOfCurrentPlanetJSON = this.allDataJSON[planetOrder];

    dataOfCurrentPlanetJSON.then(function(result) {
        planetMesh.position.x = (result["a"] * result["scaleFactor"] * scale * Math.cos(betha + timestamp));
        planetMesh.position.z = -1 * (result["b"] * result["scaleFactor"] * scale * Math.sin(betha + timestamp));
    });
}

Planet.prototype.positionUranusOnRangesliderNegativeValue = function(planetMesh, scaleValue, betha, timestamp) {
    var scale = 0.5 / (-1 * scaleValue);
    var dataOfCurrentPlanetJSON = this.allDataJSON[6];

    dataOfCurrentPlanetJSON.then(function(result) {
        var halfSizeOfUranus = result["planetSize"] / scaleValue / 2;

        planetMesh.position.x = (result["a"] * result["scaleFactor"] * scale * Math.cos(betha + timestamp)) + halfSizeOfUranus;
        planetMesh.position.z = -1 * (result["b"] * result["scaleFactor"] * scale * Math.sin(betha + timestamp)) +
            halfSizeOfUranus;
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