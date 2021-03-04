class Orbits {
    constructor(scene, allPlanetDataJSON, allMoonDataJSON, planetsMeshes) {
        this.scene = scene;
        this.orbits = [];
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
    var moons = ["Moon", "Io", "Europa", "Ganymede", "Callisto", "Rhea", "Titan",
        "Ariel", "Umbriel", "Titania", "Oberon", "Triton"
    ];
    for (i = 0; i < planets.length; i++) {
        this.createCurveForOrbit(planets[i], this.orbits, this.scene, this.allPlanetDataJSON[0], -3);
    }
    for (i = 0; i < moons.length; i++) {
        this.createCurveForOrbit(moons[i], this.orbits, this.scene, this.allMoonDataJSON[0], 1);
    }
}

Orbits.prototype.createCurveForOrbit = function(objectName, orbits, scene, dataJSON, moveOrbitByNum) {
    var curve, geometry, material, ellipse;
    var dataOfCurrentOrbitJSON = dataJSON;

    dataOfCurrentOrbitJSON.then(function(result) {
        curve = new THREE.EllipseCurve( // values for ellipse curve
            moveOrbitByNum * result[objectName]["c"], 0, // aX, aY (X/Y center of the ellipse)
            result[objectName]["a"] * result[objectName]["scaleFactor"], //xRadius 
            result[objectName]["b"] * result[objectName]["scaleFactor"], //yRadius 
            0, 2 * Math.PI, // aStartAngle, aEndAngle (angle of the curve in radians starting from the positive X axis)
            false, 0 // aClockwise, aRotation
        );
        geometry = new THREE.BufferGeometry().setFromPoints(curve.getPoints(500));
        material = new THREE.LineBasicMaterial({ color: 0xffffff });
        ellipse = new THREE.Line(geometry, material);
        ellipse.rotation.x = THREE.Math.degToRad(90);
        ellipse.name = objectName;
        orbits.push(ellipse);
        scene.add(ellipse);
    });
}

Orbits.prototype.positionSingleMoonOrbit = function(moonOrbit, planetsMeshes, planetOrder, moonName) {
    var dataOfCurrentOrbitJSON = this.allMoonDataJSON[0];
    dataOfCurrentOrbitJSON.then(function(result) {
        moonOrbit.position.x = planetsMeshes[planetOrder].position.x + result[moonName]["c"];
        moonOrbit.position.z = planetsMeshes[planetOrder].position.z
    });
}

Orbits.prototype.positionAllMoonOrbits = function() {
    var planetOrder = [2, 4, 4, 4, 4, 5, 5, 6, 6, 6, 6, 7];
    var moonNames = ["Moon", "Io", "Europa", "Ganymede", "Callisto", "Rhea", "Titan",
        "Ariel", "Umbriel", "Titania", "Oberon", "Triton"
    ];

    for (var i = 8, j = 0; i < this.orbits.length; i++, j++) {
        moonOrbit = this.orbits[i];
        this.positionSingleMoonOrbit(moonOrbit, this.planetsMeshes, planetOrder[j], moonNames[j]);
    }
}

// Scaling orbits according to zoom value from rangeslider
// -------------------------------------------------------------------------
Orbits.prototype.scaleOrbitsByRangeslider = function(scaleValue) {
    for (var i = 0; i < this.orbits.length; i++) {
        this.orbits[i].scale.set(2 * scaleValue, 2 * scaleValue, 2 * scaleValue);
    }
}