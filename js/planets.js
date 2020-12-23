class Planet {
    constructor(scene) {
        this.scene = scene;
        this.planetData = [];
        this.planetsObjects = [];
        this.planetsMeshes = [];
        this.scaleValueScene = 0;
        this.orbitClass = new Orbits(scene, this.planetData, this.planetsMeshes);
        this.betha = 0;
        this.timestamp = Date.now() * 0.00000001;
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

    // Values for planets
    addDataToPlanetObject = function() {
        // a: semi-major axis, which is the largest distance between the center of the ellipse and the curve of the orbit
        // b: semi-minor axis, which is the shortest distance between the center of the ellipse and the curve of the orbit
        // c: distance between the center of the orbit and the focus of the orbit, which is where the Sun would be in a     planetary orbit.
        // e: eccentricity, which is the measure of the deviation of the shape of an orbit from that of a perfect circle (a measure of how elliptical an orbit is). The higher the eccentricity of an orbit, the more elliptical it is;
        // tiltAxisZ: planets' tilt angle around its axis = Z
        // scaleFaktor: my values for better view of all planets
        var mercuryData = {
            a: 0.3870,
            b: 0.3788,
            c: 0.0796,
            e: 0.2056,
            rotationSpeedAroundSun: 1.607,
            eulerDistanceFromSun: 2.0790e+3,
            scaleFactor: 19,
            tiltAxisZ: 0.03,
            planetSize: 0.175
        };
        this.planetData.push(mercuryData);

        var venusData = {
            a: 0.7219,
            b: 0.7219,
            c: 0.0049,
            e: 0.0068,
            rotationSpeedAroundSun: 1.174,
            eulerDistanceFromSun: 3.8849e+3,
            scaleFactor: 17,
            tiltAxisZ: 177.4,
            planetSize: 0.435
        };
        this.planetData.push(venusData);

        var earthData = {
            a: 1.0027,
            b: 1.0025,
            c: 0.0167,
            e: 0.0167,
            rotationSpeedAroundSun: 1.000,
            eulerDistanceFromSun: 5.3709e+3,
            scaleFactor: 17,
            tiltAxisZ: 23.4,
            planetSize: 0.457
        };
        this.planetData.push(earthData);

        var marsData = {
            a: 1.5241,
            b: 1.5173,
            c: 0.1424,
            e: 0.0934,
            rotationSpeedAroundSun: 0.802,
            eulerDistanceFromSun: 8.1834e+3,
            scaleFactor: 13.5,
            tiltAxisZ: 25.2,
            planetSize: 0.243
        };
        this.planetData.push(marsData);

        var jupiterData = {
            a: 5.2073,
            b: 5.2010,
            c: 0.2520,
            e: 0.0484,
            rotationSpeedAroundSun: 0.434,
            eulerDistanceFromSun: 2.7951e+4,
            scaleFactor: 5,
            tiltAxisZ: 3.1,
            planetSize: 1.673
        };
        this.planetData.push(jupiterData);

        var saturnData = {
            a: 9.5590,
            b: 9.5231,
            c: 0.5181,
            e: 0.0542,
            rotationSpeedAroundSun: 0.323,
            eulerDistanceFromSun: 5.1464e+4,
            scaleFactor: 3.5,
            tiltAxisZ: 26.7,
            planetSize: 1.394
        };
        this.planetData.push(saturnData);

        var uranusData = {
            a: 19.1848,
            b: 19.1645,
            c: 0.9055,
            e: 0.0472,
            rotationSpeedAroundSun: 0.228,
            eulerDistanceFromSun: 1.0328e+5,
            scaleFactor: 2,
            tiltAxisZ: 97.8,
            planetSize: 0.607
        };
        this.planetData.push(uranusData);

        var neptuneData = {
            a: 30.0806,
            b: 30.0788,
            c: 0.2587,
            e: 0.0086,
            rotationSpeedAroundSun: 0.182,
            eulerDistanceFromSun: 1.6168e+5,
            scaleFactor: 1.5,
            tiltAxisZ: 28.3,
            planetSize: 0.589
        };
        this.planetData.push(neptuneData);
    }

    // NEDOKONCENE = ROTACIA PLANET PO ICH ORBITE
    setPlanetsRotationSpeedAroundSun = function(values) {
        // this.emptyObjectRotateMercury.rotation.y += values[0] / 100;
        // this.emptyObjectRotateMoon.rotation.y += 0.001;

        var timestamp = Date.now() * 0.0001;
        for (var i = 0; i < this.orbits.length; i++) {
            this.orbits[i].add(this.planetsMeshes[i + 2]);
            //this.planetsMeshes[i + 2].position.x = Math.cos(timestamp * 1.607);
            //this.planetsMeshes[i + 2].position.z = Math.sin(timestamp * 1.607);
        }
    }

    // POKUS
    getPlanetsMeshes = function() { return this.planetsMeshes }

    // Called outside the class //////////////////////////////////////
    initializePlanets = function() {
        this.addDataToPlanetObject();
        this.createPlanets(this.planetData);
        this.createPlanetsMesh(this.scene);
        this.setPlanetsRotationAngle();
        this.orbitClass.createOrbitShape();
        this.zoomRangeslider(this.planetData);
    }
}

// Creating planet objects
// -------------------------------------------------------------------------
Planet.prototype.createPlanets = function(planetData) {
    // 10x smaller scale for the Sun
    this.sun = this.createPlanetObject(4);
    this.mercury = this.createPlanetObject(planetData[0]["planetSize"]);
    this.venus = this.createPlanetObject(planetData[1]["planetSize"]);
    this.earth = this.createPlanetObject(planetData[2]["planetSize"]);
    this.moon = this.createPlanetObject(0.124);
    this.mars = this.createPlanetObject(planetData[3]["planetSize"]);

    // // 3x smaller scale (4 planets)
    this.jupiter = this.createPlanetObject(planetData[4]["planetSize"]);
    this.saturn = this.createPlanetObject(planetData[5]["planetSize"]);
    this.uranus = this.createPlanetObject(planetData[6]["planetSize"]);
    this.neptune = this.createPlanetObject(planetData[7]["planetSize"]);

    this.planetsObjects.push(this.sun, this.moon, this.mercury, this.venus, this.earth, this.mars,
        this.jupiter, this.saturn, this.uranus, this.neptune);
}

Planet.prototype.createPlanetsMesh = function(scene) {
    this.sunMesh = this.createMesh(this.planetsObjects[0], '/images/textures/sunTexture2k.jpg');
    this.moonMesh = this.createMesh(this.planetsObjects[1], '/images/textures/moonTexture2k.jpg');
    this.mercuryMesh = this.createMesh(this.planetsObjects[2], '/images/textures/mercuryTexture2k.jpg');
    this.venusMesh = this.createMesh(this.planetsObjects[3], '/images/textures/venusTexture2k.jpg');
    this.earthMesh = this.createMesh(this.planetsObjects[4], '/images/textures/earthTexture2k.jpg');
    this.marsMesh = this.createMesh(this.planetsObjects[5], '/images/textures/marsTexture2k.jpg');
    this.jupiterMesh = this.createMesh(this.planetsObjects[6], '/images/textures/jupiterTexture2k.jpg');
    this.saturnMesh = this.createMesh(this.planetsObjects[7], '/images/textures/saturnTexture2k.jpg');
    this.uranusMesh = this.createMesh(this.planetsObjects[8], '/images/textures/uranusTexture2k.jpg');
    this.neptuneMesh = this.createMesh(this.planetsObjects[9], '/images/textures/neptuneTexture2k.jpg');

    this.planetsMeshes.push(this.sunMesh, this.moonMesh, this.mercuryMesh, this.venusMesh, this.earthMesh, this.marsMesh,
        this.jupiterMesh, this.saturnMesh, this.uranusMesh, this.neptuneMesh);
    this.earthMesh.add(this.moonMesh); // Earth is parent of the Moon - for correct rotation
    this.addMeshToScene(scene);
}

Planet.prototype.addMeshToScene = function(scene) {
    for (var i = 0; i < this.planetsMeshes.length; i++) {
        scene.add(this.planetsMeshes[i]);
    }
}

// Setting properties of planets
// -------------------------------------------------------------------------
Planet.prototype.setPlanetsRotationAngle = function() {
    for (var i = 2, angle = 0; i < this.planetsMeshes.length; i++, angle++) {
        this.planetsMeshes[i].setRotationFromAxisAngle(new THREE.Vector3(0, 0, 1),
            (this.planetData[angle]["tiltAxisZ"] * Math.PI) / 180);
        //this.planetsMeshes[i].rotation.x = THREE.Math.degToRad(-90); //because orbits are rotated +90degrees
    }
}

Planet.prototype.setScaleForPlanetsAndOrbits = function(planetData, scaleValue) {
    // Changed scale for better view
    if (scaleValue > 0) {
        this.positionMeshesOnRandesliderPositiveValueX(planetData, scaleValue);
        this.scaleMeshesRangesliderPositiveValue(scaleValue);
        this.orbitClass.scaleOrbitsRangesliderPositiveValue(scaleValue);
    } else if (scaleValue < 0) {
        scaleValue *= -1;
        this.positionMeshesOnRangesliderNegativeValueX(planetData, scaleValue);
        this.scaleMeshesRangesliderNegativeValue(scaleValue);
        this.orbitClass.scaleOrbitsRangesliderNegativeValue(scaleValue);
    } else {
        this.positionMeshesToOriginalPosition(planetData);
        this.scaleMeshesToOriginalSize();
        this.orbitClass.scaleOrbitsToOriginalSize();
    }
}

Planet.prototype.positionMeshesOnRandesliderPositiveValueX = function(planetData, scaleValue) {
    var halfSizeOfPlanetMesh = 0;
    var halfSizeOfEarth = planetData[2]["planetSize"] / (scaleValue * 2);

    for (var i = 0; i < planetData.length; i++) {
        halfSizeOfPlanetMesh = planetData[i]["planetSize"] / (scaleValue * 2);
        this.planetsMeshes[i + 2].position.x =
            planetData[i]["a"] * planetData[i]["scaleFactor"] * scaleValue * 2 + halfSizeOfPlanetMesh;
    }
    // Moon - position according its' parent object (Earth)
    var earthPosition = this.planetsMeshes[4].position.x;
    this.moonMesh.visible = true;
    this.moonMesh.position.x = earthPosition + planetData[2]["a"] * scaleValue * 2 + halfSizeOfEarth;
}

Planet.prototype.scaleMeshesRangesliderPositiveValue = function(scaleValue) {
    for (var i = 1; i < this.planetsMeshes.length; i++) {
        this.planetsMeshes[0].scale.set(1.5 * scaleValue, 1.5 * scaleValue, 1.5 * scaleValue); // the Sun
        this.planetsMeshes[i].scale.set(2 * scaleValue, 2 * scaleValue, 2 * scaleValue);
    }
}

Planet.prototype.positionMeshesOnRangesliderNegativeValueX = function(planetData, scaleValue) {
    for (var i = 0; i < planetData.length; i++) {
        this.planetsMeshes[i + 2].position.x =
            (planetData[i]["a"] * planetData[i]["scaleFactor"]) / scaleValue / 2;
    }
    // Hidden Moon when model is too small
    this.moonMesh.visible = false;
}

Planet.prototype.scaleMeshesRangesliderNegativeValue = function(scaleValue) {
    for (var i = 1; i < this.planetsMeshes.length; i++) {
        this.planetsMeshes[0].scale.set(0.5 / (-1 * scaleValue), 0.5 / (-1 * scaleValue), 0.5 / (-1 * scaleValue)); // the Sun
        // cannot use number 1 for planets, because: (1 / -1 * 1) = 1, so -1 would not zoom out
        this.planetsMeshes[i].scale.set(0.8 / (-1 * scaleValue), 0.8 / (-1 * scaleValue), 0.8 / (-1 * scaleValue));
    }
}

Planet.prototype.positionMeshesToOriginalPosition = function(planetData) {
    var halfSizeOfPlanetMesh = 0;
    for (var i = 0; i < planetData.length; i++) {
        halfSizeOfPlanetMesh = planetData[i]["planetSize"] / 2;
        this.planetsMeshes[i + 2].position.x = planetData[i]["a"] * planetData[i]["scaleFactor"] + halfSizeOfPlanetMesh;
    }
    // Set original Moon position -> my value according to model
    this.moonMesh.visible = true;
    this.moonMesh.position.x = this.earthMesh.position.x + 1;
}

Planet.prototype.scaleMeshesToOriginalSize = function() {
    for (var i = 0; i < this.planetsMeshes.length; i++) {
        this.planetsMeshes[i].scale.set(1, 1, 1);
    }
}

// Zooming in/out (for planets and orbits) + movement of the scene
// -------------------------------------------------------------------------
Planet.prototype.zoomRangeslider = function(planetData) {
    var slider = document.getElementById("rangesliderInput");
    var sliderValue = document.getElementById("rangesliderValue");

    var updateZoomValue = () => {
        sliderValue.innerHTML = slider.value;
        for (var i = 0; i < planetData.length; i++) {
            this.scaleValueScene = sliderValue.innerHTML;
        }
        this.setScaleForPlanetsAndOrbits(planetData, this.scaleValueScene);
    }
    slider.addEventListener('input', updateZoomValue);
    updateZoomValue();
}

// Moving planets on their orbits (ellipses)
// -------------------------------------------------------------------------
Planet.prototype.movePlanetOnOrbit = function(planet, planetOrder) {
    this.timestamp += 0.005; // CIM MENSIE CISLO, TYM SA TOCI POMALSIE
    console.log(this.planetData[planetOrder]["rotationSpeedAroundSun"]);
    this.betha = Math.cos(planet.position.x / (planet.position.z + this.timestamp));

    planet.position.x = this.planetData[planetOrder]["c"] + (this.planetData[planetOrder]["a"] *
        this.planetData[planetOrder]["scaleFactor"] * Math.cos(this.betha + this.timestamp));
    // -1 for anticlockwise rotation
    planet.position.z = -1 * (this.planetData[planetOrder]["b"] *
        this.planetData[planetOrder]["scaleFactor"] * Math.sin(this.betha + this.timestamp));

}

Planet.prototype.rotateAllPlanets = function() {
    var planet;
    for (var i = 2, j = 0; i < this.planetsMeshes.length; i++, j++) {
        planet = this.planetsMeshes[i];
        this.movePlanetOnOrbit(planet, j);
    }
}