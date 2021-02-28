class Orbits {
    constructor(scene, allPlanetDataJSON, allMoonDataJSON, planetsMeshes) {
        this.scene = scene;
        this.orbits = this.orbits = [];
        this.allPlanetDataJSON = allPlanetDataJSON;
        this.allMoonDataJSON = allMoonDataJSON;
        this.planetsMeshes = planetsMeshes;
        this.allCurves = [];
    }

    getAllOrbits = function() { return this.orbits; }
}


// Creating orbits for planets
// -------------------------------------------------------------------------
Orbits.prototype.createOrbitShape = function() {
    var planets = ["Mercury", "Venus", "Earth", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune"];
    var moons = ["Moon", "Io", "Europa", "Ganymede", "Callisto", "Tethys", "Dione", "Rhea", "Titan",
        "Iapetus", "Ariel", "Umbriel", "Titania", "Oberon", "Triton"
    ];
    for (i = 0; i < planets.length; i++) {
        this.createCurveForOrbit(planets[i], this.orbits, this.scene, this.allPlanetDataJSON[0]);
    }
    for (i = 0; i < moons.length; i++) {
        this.createCurveForOrbit(moons[i], this.orbits, this.scene, this.allMoonDataJSON[0]);
    }
}

Orbits.prototype.createCurveForOrbit = function(planetName, orbits, scene, dataJSON) {
    var curve, geometry, material, ellipse;
    var dataOfCurrentOrbitJSON = dataJSON;

    dataOfCurrentOrbitJSON.then(function(result) {
        curve = new THREE.EllipseCurve(
            result[planetName]["c"], 0, // aX, aY (X/Y center of the ellipse)
            result[planetName]["a"] * result[planetName]["scaleFactor"], //xRadius 
            result[planetName]["b"] * result[planetName]["scaleFactor"], //yRadius 
            0, 2 * Math.PI, // aStartAngle, aEndAngle (angle of the curve in radians starting from the positive X axis)
            false, 0 // aClockwise, aRotation
        );
        geometry = new THREE.BufferGeometry().setFromPoints(curve.getPoints(500));
        material = new THREE.LineBasicMaterial({ color: 0xffffff });
        ellipse = new THREE.Line(geometry, material);
        ellipse.rotation.x = THREE.Math.degToRad(90);
        ellipse.name = planetName;
        orbits.push(ellipse);
        scene.add(ellipse);
    });
}

Orbits.prototype.positionSingleMoonOrbit = function(moonOrbit, planetsMeshes, planetOrder, moonName, scaleValue) {
    var dataOfCurrentOrbitJSON = this.allMoonDataJSON[0];
    dataOfCurrentOrbitJSON.then(function(result) {
        moonOrbit.position.x = planetsMeshes[planetOrder].position.x + result[moonName]["c"];
        moonOrbit.position.z = planetsMeshes[planetOrder].position.z;
    });
}

Orbits.prototype.positionAllMoonOrbits = function(scaleValue) {
    var planetOrder = [2, 4, 4, 4, 4, 5, 5, 5, 5, 5, 6, 6, 6, 6, 7];
    var moonNames = ["Moon", "Io", "Europa", "Ganymede", "Callisto", "Tethys", "Dione", "Rhea", "Titan",
        "Iapetus", "Ariel", "Umbriel", "Titania", "Oberon", "Triton"
    ];

    for (var i = 8, j = 0; i < this.orbits.length; i++, j++) {
        moonOrbit = this.orbits[i];
        this.positionSingleMoonOrbit(moonOrbit, this.planetsMeshes, planetOrder[j], moonNames[j], scaleValue);
    }
}

// Scaling orbits according to zoom value from rangeslider
// -------------------------------------------------------------------------
Orbits.prototype.setScaleForOrbits = function(scaleValue) {
    var scale = scaleValue * 200;
    if (scale > 100) {
        this.scaleOrbitsRangesliderZoomIn(scaleValue);
    } else if (scale < 100) {
        scaleValue *= -1;
        this.scaleOrbitsRangesliderZoomOut(scaleValue);
    } else {
        this.scaleOrbitsToOriginalSize();
    }
}

Orbits.prototype.scaleOrbitsRangesliderZoomIn = function(scaleValue) {
    for (var i = 0; i < this.orbits.length; i++) {
        this.orbits[i].scale.set(2 * scaleValue, 2 * scaleValue, 2 * scaleValue);
    }
}

Orbits.prototype.scaleOrbitsRangesliderZoomOut = function(scaleValue) {
    for (var i = 0; i < this.orbits.length; i++) {
        this.orbits[i].scale.set(-2 * scaleValue, -2 * scaleValue, -2 * scaleValue);
    }
}

Orbits.prototype.scaleOrbitsToOriginalSize = function() {
    for (var i = 0; i < this.orbits.length; i++) {
        this.orbits[i].scale.set(1, 1, 1);
    }
}