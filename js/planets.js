class Planet {
    constructor(scene) {
        this.scene = scene;
        this.planetData = [];
        this.orbits = [];
        this.planetsObjects = [];
        this.planetsMeshes = [];
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

    addToScene = function(mesh) {
        this.scene.add(mesh);
    }

    // Values for planets
    addDataToPlanetObject = function() {
        // a: semi-major axis, which is the largest distance between the center of the ellipse and the curve of the orbit
        // b: semi-minor axis, which is the shortest distance between the center of the ellipse and the curve of the orbit
        // c: distance between the center of the orbit and the focus of the orbit, which is where the Sun would be in a     planetary orbit.
        // e: eccentricity, which is the measure of the deviation of the shape of an orbit from that of a perfect circle (a measure of how elliptical an orbit is). The higher the eccentricity of an orbit, the more elliptical it is;
        // tiltAxisZ: planets' tilt angle around its axis = Z
        var mercuryData = {
            a: 0.3870,
            b: 0.3788,
            c: 0.0796,
            e: 0.2056,
            zoom: 1,
            rotationSpeedAroundSun: 1.607,
            eulerDistanceFromSun: 2.0790e+3,
            scaleFactor: 19,
            tiltAxisZ: 0.03
        };
        this.planetData.push(mercuryData);

        var venusData = {
            a: 0.7219,
            b: 0.7219,
            c: 0.0049,
            e: 0.0068,
            zoom: 1,
            rotationSpeedAroundSun: 1.174,
            eulerDistanceFromSun: 3.8849e+3,
            scaleFactor: 17,
            tiltAxisZ: 177.4
        };
        this.planetData.push(venusData);

        var earthData = {
            a: 1.0027,
            b: 1.0025,
            c: 0.0167,
            e: 0.0167,
            zoom: 1,
            rotationSpeedAroundSun: 1.000,
            eulerDistanceFromSun: 5.3709e+3,
            scaleFactor: 17,
            tiltAxisZ: 23.4
        };
        this.planetData.push(earthData);

        var marsData = {
            a: 1.5241,
            b: 1.5173,
            c: 0.1424,
            e: 0.0934,
            zoom: 1,
            rotationSpeedAroundSun: 0.802,
            eulerDistanceFromSun: 8.1834e+3,
            scaleFactor: 13.5,
            tiltAxisZ: 25.2
        };
        this.planetData.push(marsData);

        var jupiterData = {
            a: 5.2073,
            b: 5.2010,
            c: 0.2520,
            e: 0.0484,
            zoom: 1,
            rotationSpeedAroundSun: 0.434,
            eulerDistanceFromSun: 2.7951e+4,
            scaleFactor: 5,
            tiltAxisZ: 3.1
        };
        this.planetData.push(jupiterData);

        var saturnData = {
            a: 9.5590,
            b: 9.5231,
            c: 0.5181,
            e: 0.0542,
            zoom: 1,
            rotationSpeedAroundSun: 0.323,
            eulerDistanceFromSun: 5.1464e+4,
            scaleFactor: 3.5,
            tiltAxisZ: 26.7
        };
        this.planetData.push(saturnData);

        var uranusData = {
            a: 19.1848,
            b: 19.1645,
            c: 0.9055,
            e: 0.0472,
            zoom: 1,
            rotationSpeedAroundSun: 0.228,
            eulerDistanceFromSun: 1.0328e+5,
            scaleFactor: 2,
            tiltAxisZ: 97.8
        };
        this.planetData.push(uranusData);

        var neptuneData = {
            a: 30.0806,
            b: 30.0788,
            c: 0.2587,
            e: 0.0086,
            zoom: 1,
            rotationSpeedAroundSun: 0.182,
            eulerDistanceFromSun: 1.6168e+5,
            scaleFactor: 1.5,
            tiltAxisZ: 28.3
        };
        this.planetData.push(neptuneData);
    }

    // VYNECHANE
    createEmptyObjects = function() {
        //Empty objects will control planets' movement around the Sun
        this.emptyObjectRotateMercury = new THREE.Object3D();
        this.emptyObjectRotateMercury.add(this.mercuryMesh);

        this.emptyObjectRotateVenus = new THREE.Object3D();
        this.emptyObjectRotateVenus.add(this.venusMesh);

        this.emptyObjectRotateEarth = new THREE.Object3D();
        this.emptyObjectRotateEarth.add(this.earthMesh);

        this.emptyObjectRotateMoon = new THREE.Object3D();
        this.earthMesh.add(this.emptyObjectRotateMoon);
        this.emptyObjectRotateMoon.add(this.moonMesh);

        this.emptyObjectRotateMars = new THREE.Object3D();
        this.emptyObjectRotateMars.add(this.marsMesh);

        this.emptyObjectRotateJupiter = new THREE.Object3D();
        this.emptyObjectRotateJupiter.add(this.jupiterMesh);

        this.emptyObjectRotateSaturn = new THREE.Object3D();
        this.emptyObjectRotateSaturn.add(this.saturnMesh);

        this.emptyObjectRotateUranus = new THREE.Object3D();
        this.emptyObjectRotateUranus.add(this.uranusMesh);

        this.emptyObjectRotateNeptune = new THREE.Object3D();
        this.emptyObjectRotateNeptune.add(this.neptuneMesh);

        this.addEmptyToSun();
    }

    // VYNECHANE
    addEmptyToSun = function() {
        // For rotating planets around the Sun
        var emptyObjectsArray = [this.emptyObjectRotateMercury, this.emptyObjectRotateVenus, this.emptyObjectRotateEarth, this.emptyObjectRotateMars, this.emptyObjectRotateJupiter, this.emptyObjectRotateSaturn,
            this.emptyObjectRotateUranus, this.emptyObjectRotateNeptune
        ];

        for (var i = 0; i < emptyObjectsArray.length; i++) {
            this.sunMesh.add(emptyObjectsArray[i]);
        }
    }

    // NEDOKONCENE = ROTACIA PLANET PO ICH ORBITE
    setPlanetsRotationSpeedAroundSun = function(values) {
        // this.emptyObjectRotateMercury.rotation.y += values[0] / 100;
        // this.emptyObjectRotateVenus.rotation.y += values[1] / 100;
        // this.emptyObjectRotateEarth.rotation.y += values[2] / 100;
        // this.emptyObjectRotateMars.rotation.y += values[3] / 100;
        // this.emptyObjectRotateJupiter.rotation.y += values[4] / 100;
        // this.emptyObjectRotateSaturn.rotation.y += values[5] / 100;
        // this.emptyObjectRotateUranus.rotation.y += values[6] / 100;
        // this.emptyObjectRotateNeptune.rotation.y += values[7] / 100;
        // this.emptyObjectRotateMoon.rotation.y += 0.001;

        var timestamp = Date.now() * 0.0001;
        for (var i = 0; i < this.orbits.length; i++) {
            this.orbits[i].add(this.planetsMeshes[i + 2]);
            //this.planetsMeshes[i + 2].position.x = Math.cos(timestamp * 1.607);
            //this.planetsMeshes[i + 2].position.z = Math.sin(timestamp * 1.607);
        }
    }

    // Called outside the class //////////////////////////////////////
    initializePlanets = function() {
        this.createPlanets();
        this.createPlanetsMesh();
        //this.createEmptyObjects();
        this.addDataToPlanetObject();
        this.setPlanetsRotationAngle();
        this.createOrbitShape(this.planetData);
        this.zoomRangeslider(this.planetData, this.orbits);
    }
}


Planet.prototype.createPlanets = function(planetData) {
    // 10x smaller scale for the Sun
    this.sun = this.createPlanetObject(4);
    this.mercury = this.createPlanetObject(0.175);
    this.venus = this.createPlanetObject(0.435);
    this.earth = this.createPlanetObject(0.457);
    this.moon = this.createPlanetObject(0.124);
    this.mars = this.createPlanetObject(0.243);

    // // 3x smaller scale (4 planets)
    this.jupiter = this.createPlanetObject(1.673);
    this.saturn = this.createPlanetObject(1.394);
    this.uranus = this.createPlanetObject(0.607);
    this.neptune = this.createPlanetObject(0.589);

    this.planetsObjects.push(this.sun, this.moon, this.mercury, this.venus, this.earth, this.mars,
        this.jupiter, this.saturn, this.uranus, this.neptune);
}

Planet.prototype.createPlanetsMesh = function() {
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

    this.addMeshToScene();
}

Planet.prototype.addMeshToScene = function() {
    for (var i = 0; i < this.planetsMeshes.length; i++) {
        this.addToScene(this.planetsMeshes[i]);
    }
}

Planet.prototype.setPlanetsRotationAngle = function() {
    for (var i = 2, angle = 0; i < this.planetsMeshes.length; i++, angle++) {
        this.planetsMeshes[i].setRotationFromAxisAngle(new THREE.Vector3(0, 0, 1),
            (this.planetData[angle]["tiltAxisZ"] * Math.PI) / 180);
        this.planetsMeshes[i].rotation.x = THREE.Math.degToRad(-90);
    }
}

Planet.prototype.setPlanetsDistanceFromSun = function(planetData) {
    var zoom = 0;
    // Changed scale for better view
    for (var i = 0; i < planetData.length; i++) {
        if (planetData[i]["zoom"] > 0) {
            zoom = planetData[i]["zoom"];
            this.planetsMeshes[i + 2].position.x = planetData[i]["a"] * planetData[i]["scaleFactor"] * zoom +
                planetData[i]["c"] * (planetData[i]["scaleFactor"] * zoom / 2)
                // POKUS
                // this.mercury = 
        } else if (planetData[i]["zoom"] < 0) {
            zoom = (planetData[i]["zoom"] * -1);
            this.planetsMeshes[i + 2].position.x = (planetData[i]["a"] * planetData[i]["scaleFactor"]) / zoom +
                planetData[i]["c"] * ((planetData[i]["scaleFactor"] / zoom) / 2);
        } else {
            this.planetsMeshes[i + 2].position.x = planetData[i]["a"] * planetData[i]["scaleFactor"] +
                planetData[i]["c"] * (planetData[i]["scaleFactor"] / 2);
        }
    }
    // Not proper value = set according to model
    this.moonMesh.position.x = 1;
}

Planet.prototype.createOrbitShape = function(planetData) {
    var curve, geometry, material, ellipse;

    for (var i = 0; i < planetData.length; i++) {
        curve = this.createCurveForOrbit(planetData, i);

        geometry = new THREE.BufferGeometry().setFromPoints(curve.getPoints(500));
        material = new THREE.LineBasicMaterial({ color: 0xffffff });
        ellipse = new THREE.Line(geometry, material);
        ellipse.rotation.x = THREE.Math.degToRad(90);
        this.orbits.push(ellipse);
        //ellipse.add(this.planetsMeshes[i + 2]); // POTREBNE?
        this.scene.add(ellipse);
    }
}

Planet.prototype.createCurveForOrbit = function(planetData, i) {
    var curve;
    if (planetData[i]["zoom"] > 0) {
        curve = new THREE.EllipseCurve(
            planetData[i]["c"] * (planetData[i]["scaleFactor"] / 2), 0, // aX, aY (X/Y center of the ellipse)
            planetData[i]["a"] * planetData[i]["scaleFactor"] * planetData[i]["zoom"], //xRadius
            planetData[i]["b"] * planetData[i]["scaleFactor"] * planetData[i]["zoom"], //yRadius
            0, 2 * Math.PI, // aStartAngle, aEndAngle (angle of the curve in radians starting from the positive X axis)
            false, 0 // aClockwise, aRotation
        );
    } else if (planetData[i]["zoom"] < 0) {
        curve = new THREE.EllipseCurve(
            planetData[i]["c"] * (planetData[i]["scaleFactor"] / 2), 0,
            (planetData[i]["a"] * planetData[i]["scaleFactor"]) / (planetData[i]["zoom"] * -1),
            (planetData[i]["b"] * planetData[i]["scaleFactor"]) / (planetData[i]["zoom"] * -1),
            0, 2 * Math.PI,
            false, 0
        );
    } else {
        curve = new THREE.EllipseCurve(
            planetData[i]["c"] * (planetData[i]["scaleFactor"] / 2), 0,
            planetData[i]["a"] * planetData[i]["scaleFactor"],
            planetData[i]["b"] * planetData[i]["scaleFactor"],
            0, 2 * Math.PI,
            false, 0
        );
    }
    return curve;
}

Planet.prototype.addNamesToPlanets = function() {
    // const map = new THREE.TextureLoader().load('sprite.png');
    // const material = new THREE.SpriteMaterial({ map: map });
    // const sprite = new THREE.Sprite(material);
    // scene.add(sprite);
}

Planet.prototype.getPoint = function(curve, t) {
    // var radians = 2 * Math.PI * t;
    // return new THREE.Vector3(curve.xRadius * Math.cos(radians),
    //     curve.yRadius * Math.sin(radians),
    //     0);
};

Planet.prototype.zoomRangeslider = function(planetData, orbits) {
    var slider = document.getElementById("rangesliderInput");
    var sliderValue = document.getElementById("rangesliderValue");
    let updateZoomValue = () => {
        sliderValue.innerHTML = slider.value;
        for (var i = 0; i < planetData.length; i++) {
            planetData[i]["zoom"] = sliderValue.innerHTML;
            console.log(planetData[0]["zoom"]);
        }

        this.updateOrbitSize(planetData, orbits);
        this.setPlanetsDistanceFromSun(planetData);
    }

    slider.addEventListener('input', updateZoomValue);
    updateZoomValue();
}

Planet.prototype.updateOrbitSize = function(planetData, orbits) {
    for (var i = 0; i < orbits.length; i++) {
        this.scene.remove(orbits[i]);
    }
    orbits.length = 0; // making array empty 
    this.createOrbitShape(planetData);
}

// Planet.prototype.applyZoomValueToModel = function() {
// }