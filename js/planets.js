class Planet {
    constructor(scene) {
        this.scene = scene;
        this.planetData = [];
        this.orbits = [];
        this.planetsMeshes = [];
    }

    createPlanets = function() {
        // 10x smaller scale for the Sun
        this.sun = new THREE.SphereBufferGeometry(5, 50, 50);
        this.mercury = new THREE.SphereBufferGeometry(0.175, 50, 50);
        this.venus = new THREE.SphereBufferGeometry(0.435, 50, 50);
        this.earth = new THREE.SphereBufferGeometry(0.457, 50, 50);
        this.moon = new THREE.SphereBufferGeometry(0.124, 50, 50);
        this.mars = new THREE.SphereBufferGeometry(0.243, 50, 50);

        // 3x smaller scale (4 planets)
        this.jupiter = new THREE.SphereBufferGeometry(1.673, 50, 50);
        this.saturn = new THREE.SphereBufferGeometry(1.394, 50, 50);
        this.uranus = new THREE.SphereBufferGeometry(0.607, 50, 50);
        this.neptune = new THREE.SphereBufferGeometry(0.589, 50, 50);
    }

    setNewMesh = function(imageSrc) {
        let texture = new THREE.TextureLoader().load(imageSrc);
        this.meshMaterial = new THREE.MeshPhongMaterial({ map: texture });
        this.meshMaterial.receiveShadow = true;
        this.meshMaterial.castShadow = true;
        return this.meshMaterial;
    }

    createPlanetsMesh = function() {
        this.sunMesh = new THREE.Mesh(this.sun, this.setNewMesh('/images/textures/sunTexture2k.jpg'));
        this.mercuryMesh = new THREE.Mesh(this.mercury, this.setNewMesh('/images/textures/mercuryTexture2k.jpg'));
        this.venusMesh = new THREE.Mesh(this.venus, this.setNewMesh('/images/textures/venusTexture2k.jpg'));
        this.earthMesh = new THREE.Mesh(this.earth, this.setNewMesh('/images/textures/earthTexture2k.jpg'));
        this.moonMesh = new THREE.Mesh(this.moon, this.setNewMesh('/images/textures/moonTexture2k.jpg'));
        this.marsMesh = new THREE.Mesh(this.mars, this.setNewMesh('/images/textures/marsTexture2k.jpg'));
        this.jupiterMesh = new THREE.Mesh(this.jupiter, this.setNewMesh('/images/textures/jupiterTexture2k.jpg'));
        this.saturnMesh = new THREE.Mesh(this.saturn, this.setNewMesh('/images/textures/saturnTexture2k.jpg'));
        this.uranusMesh = new THREE.Mesh(this.uranus, this.setNewMesh('/images/textures/uranusTexture2k.jpg'));
        this.neptuneMesh = new THREE.Mesh(this.neptune, this.setNewMesh('/images/textures/neptuneTexture2k.jpg'));

        this.planetsMeshes.push(this.sunMesh, this.moonMesh, this.mercuryMesh, this.venusMesh, this.earthMesh, this.marsMesh,
            this.jupiterMesh, this.saturnMesh, this.uranusMesh, this.neptuneMesh);
    }

    addMeshToScene = function(planetsMesh) {
        for (var i = 0; i < planetsMesh.length; i++) {
            this.scene.add(planetsMesh[i]);
        }
    }

    setPlanetsRotationAngle = function() {
        // Planets' angle around its axis = Z
        var angleValuesZ = [0.03, 177.4, 23.4, 25.2, 3.1, 26.7, 97.8, 28.3];

        for (var i = 2, angle = 0; i < this.planetsMeshes.length; i++, angle++) {
            this.planetsMeshes[i].setRotationFromAxisAngle(new THREE.Vector3(0, 0, 1), (angleValuesZ[angle] * Math.PI) / 180);
        }
    }

    setMoonDistanceFromEarth = function() {
        // Not proper value = set according to model
        this.moonMesh.position.x = 1;
    }

    // Position for every planet's orbit from the Sun
    setPlanetsDistanceFromSun = function() {
        // Changed scale for better view
        for (var i = 0; i < this.planetData.length; i++) {
            this.planetsMeshes[i + 2].position.x = this.planetData[i]["a"] * this.planetData[i]["scaleFactor"] +
                this.planetData[i]["c"] * (this.planetData[i]["scaleFactor"] / 2);
        }
        this.setMoonDistanceFromEarth();
    }

    //Empty objects will control planets' movement around the Sun
    createEmptyObjects = function() {
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

    // For rotating planets around the Sun
    addEmptyToSun = function() {
        var emptyObjectsArray = [this.emptyObjectRotateMercury, this.emptyObjectRotateVenus, this.emptyObjectRotateEarth, this.emptyObjectRotateMars, this.emptyObjectRotateJupiter, this.emptyObjectRotateSaturn,
            this.emptyObjectRotateUranus, this.emptyObjectRotateNeptune
        ];

        for (var i = 0; i < emptyObjectsArray.length; i++) {
            this.sunMesh.add(emptyObjectsArray[i]);
        }
    }

    setMoonRotationAroundEarth = function() {
        // Not proper value, needs to change
        this.emptyObjectRotateMoon.rotation.y += 0.001;
    }

    setPlanetsRotationSpeedAroundSun = function(values) {
        // this.emptyObjectRotateMercury.rotation.y += values[0] / 100;
        // this.emptyObjectRotateVenus.rotation.y += values[1] / 100;
        // this.emptyObjectRotateEarth.rotation.y += values[2] / 100;
        // this.emptyObjectRotateMars.rotation.y += values[3] / 100;
        // this.emptyObjectRotateJupiter.rotation.y += values[4] / 100;
        // this.emptyObjectRotateSaturn.rotation.y += values[5] / 100;
        // this.emptyObjectRotateUranus.rotation.y += values[6] / 100;
        // this.emptyObjectRotateNeptune.rotation.y += values[7] / 100;
        //this.setMoonRotationAroundEarth();

        var timestamp = Date.now() * 0.0001;
        for (var i = 0; i < this.orbits.length; i++) {
            this.orbits[i].add(this.planetsMeshes[i + 2]);
            //this.planetsMeshes[i + 2].position.x = Math.cos(timestamp * 1.607);
            //this.planetsMeshes[i + 2].position.z = Math.sin(timestamp * 1.607);
        }
    }

    // POKUS - ORBITA V TVARE ELIPSY
    createOrbitShape = function(planetData) {
        var curve, points, geometry, material, ellipse;
        var scaleFactor = [19, 17, 17, 13.5, 5, 3.5, 2, 1.5]; // my values - to fit orbits into 1 screen

        for (var i = 0; i < planetData.length; i++) {
            curve = new THREE.EllipseCurve(
                this.planetData[i]["c"] * (this.planetData[i]["scaleFactor"] / 2), 0, // aX, aY (X/Y center of the ellipse)
                this.planetData[i]["a"] * this.planetData[i]["scaleFactor"], //xRadius (The radius of the ellipse in the X direction)
                this.planetData[i]["b"] * this.planetData[i]["scaleFactor"], //yRadius
                0, 2 * Math.PI, // aStartAngle, aEndAngle (angle of the curve in radians starting from the positive X axis)
                false, 0 // aClockwise, aRotation
            );
            points = curve.getPoints(500);
            geometry = new THREE.BufferGeometry().setFromPoints(points);
            material = new THREE.LineBasicMaterial({ color: 0xffffff });
            ellipse = new THREE.Line(geometry, material);
            ellipse.rotation.x = THREE.Math.degToRad(90);
            this.orbits.push(ellipse);
            this.scene.add(ellipse);
        }
    }

    // DOPLNENIE DAT PRE PLANETY
    addDataToPlanetObject = function() {
        // a: semi-major axis, which is the largest distance between the center of the ellipse and the curve of the orbit
        // b: semi-minor axis, which is the shortest distance between the center of the ellipse and the curve of the orbit
        // c: distance between the center of the orbit and the focus of the orbit, which is where the Sun would be in a     planetary orbit.
        // e: eccentricity, which is the measure of the deviation of the shape of an orbit from that of a perfect circle (a measure of how elliptical an orbit is). The higher the eccentricity of an orbit, the more elliptical it is;
        var mercuryData = {
            a: 0.3870,
            b: 0.3788,
            c: 0.0796,
            e: 0.2056,
            rotationSpeedAroundSun: 1.607,
            eulerDistanceFromSun: 2.0790e+3,
            scaleFactor: 19
        };
        this.planetData.push(mercuryData);

        var venusData = {
            a: 0.7219,
            b: 0.7219,
            c: 0.0049,
            e: 0.0068,
            rotationSpeedAroundSun: 1.174,
            eulerDistanceFromSun: 3.8849e+3,
            scaleFactor: 17
        };
        this.planetData.push(venusData);

        var earthData = {
            a: 1.0027,
            b: 1.0025,
            c: 0.0167,
            e: 0.0167,
            rotationSpeedAroundSun: 1.000,
            eulerDistanceFromSun: 5.3709e+3,
            scaleFactor: 17
        };
        this.planetData.push(earthData);

        var marsData = {
            a: 1.5241,
            b: 1.5173,
            c: 0.1424,
            e: 0.0934,
            rotationSpeedAroundSun: 0.802,
            eulerDistanceFromSun: 8.1834e+3,
            scaleFactor: 13.5
        };
        this.planetData.push(marsData);

        var jupiterData = {
            a: 5.2073,
            b: 5.2010,
            c: 0.2520,
            e: 0.0484,
            rotationSpeedAroundSun: 0.434,
            eulerDistanceFromSun: 2.7951e+4,
            scaleFactor: 5
        };
        this.planetData.push(jupiterData);

        var saturnData = {
            a: 9.5590,
            b: 9.5231,
            c: 0.5181,
            e: 0.0542,
            rotationSpeedAroundSun: 0.323,
            eulerDistanceFromSun: 5.1464e+4,
            scaleFactor: 3.5
        };
        this.planetData.push(saturnData);

        var uranusData = {
            a: 19.1848,
            b: 19.1645,
            c: 0.9055,
            e: 0.0472,
            rotationSpeedAroundSun: 0.228,
            eulerDistanceFromSun: 1.0328e+5,
            scaleFactor: 2
        };
        this.planetData.push(uranusData);

        var neptuneData = {
            a: 30.0806,
            b: 30.0788,
            c: 0.2587,
            e: 0.0086,
            rotationSpeedAroundSun: 0.182,
            eulerDistanceFromSun: 1.6168e+5,
            scaleFactor: 1.5
        };
        this.planetData.push(neptuneData);
    }


    // Called outside the class //////////////////////////////////////
    initializePlanets = function() {
        this.createPlanets();
        this.createPlanetsMesh();
        this.addMeshToScene(this.planetsMeshes);
        this.setPlanetsRotationAngle();
        //this.createEmptyObjects();
        this.addDataToPlanetObject();
        // POKUS
        this.createOrbitShape(this.planetData);

    }
}

// POKUS - ELIPSA
class OrbitEllipse {
    constructor(orbitAroundPos, orbiterPos, endingApsis, circular) {
        this.startingApsis = 0;
        this.endingApsis = 0;
        this.semiMajorAxis = 0;
        this.semiMinorAxis = 0;
        this.focalDistance = 0;
        this.difference = 0;
        this.update(orbitAroundPos, orbiterPos, endingApsis, circular);
    }
    update = function(orbitAroundPos, orbiterPos, endingApsis, circular) {
        this.difference = orbiterPos - orbitAroundPos;
        this.startingApsis = this.difference.magnitude;
        if (endingApsis == 0 || circular)
            this.endingApsis = this.startingApsis;
        else
            this.endingApsis = endingApsis;
        this.semiMajorAxis = this.calcSemiMajorAxis(this.startingApsis, this.endingApsis);
        this.focalDistance = this.calcFocalDistance(this.semiMajorAxis, this.endingApsis);
        this.semiMinorAxis = this.calcSemiMinorAxis(this.semiMajorAxis, this.focalDistance);
    }

    getPosition = function(degrees, orbitAroundPos) {
        // Use the difference between the orbiter and the object it's orbiting around to determine the direction
        // that the ellipse is aimed
        // Angle is given in degrees
        var ellipseDirection = Vector3.Angle(Vector3.left, difference); // the direction the ellipse is rotated
        if (difference.y < 0) {
            ellipseDirection = 360 - ellipseDirection; // Full 360 degrees, rather than doubling back after 180 degrees
        }

        var beta = ellipseDirection * Mathf.Deg2Rad;
        var sinBeta = Mathf.Sin(beta);
        var cosBeta = Mathf.Cos(beta);

        var alpha = degrees * Mathf.Deg2Rad;
        var sinalpha = Mathf.Sin(alpha);
        var cosalpha = Mathf.Cos(alpha);

        // Position the ellipse relative to the "orbit around" transform
        var ellipseOffset = difference.normalized * (semiMajorAxis - endingApsis);

        var finalPosition = new THREE.Vector3();
        finalPosition.x = ellipseOffset.x + (semiMajorAxis * cosalpha * cosBeta - semiMinorAxis * sinalpha * sinBeta) * -1;
        finalPosition.y = ellipseOffset.y + (semiMajorAxis * cosalpha * sinBeta + semiMinorAxis * sinalpha * cosBeta);

        // Offset entire ellipse proportional to the position of the object we're orbiting around
        finalPosition += orbitAroundPos;

        return finalPosition;
    }

    calcSemiMajorAxis = function(startingApsis, endingApsis) {
        return (startingApsis + endingApsis) * 0.5;
    }

    calcSemiMinorAxis = function(semiMajorAxis, focalDistance) {
        var distA = semiMajorAxis + focalDistance * 0.5;
        var distB = semiMajorAxis - focalDistance * 0.5;
        return Math.sqrt(Math.pow(distA + distB, 2) - focalDistance * focalDistance) * 0.5;
    }
    calcFocalDistance = function(semiMajorAxis, endingApsis) {
        return (semiMajorAxis - endingApsis) * 2;
    }

}