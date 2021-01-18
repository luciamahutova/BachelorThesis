class Orbits {
    constructor(scene, allDataJSON, planetsMeshes) {
        this.scene = scene;
        this.orbits = [];
        this.allDataJSON = allDataJSON;
        this.planetsMeshes = planetsMeshes;
        this.allCurves = [];
    }
}


// Creating orbits for planets
// -------------------------------------------------------------------------
Orbits.prototype.createOrbitShape = function() {
    for (var i = 0; i < 8; i++) {
        this.createCurveForOrbit(i, this.orbits, this.scene);
    }
}

Orbits.prototype.createCurveForOrbit = function(i, orbits, scene) {
    var curve, geometry, material, ellipse;
    var dataOfCurrentPlanetJSON = this.allDataJSON[i];

    dataOfCurrentPlanetJSON.then(function(result) {
        curve = new THREE.EllipseCurve(
            result["c"], 0, // aX, aY (X/Y center of the ellipse)
            result["a"] * result["scaleFactor"], //xRadius 
            result["b"] * result["scaleFactor"], //yRadius 
            0, 2 * Math.PI, // aStartAngle, aEndAngle (angle of the curve in radians starting from the positive X axis)
            false, 0 // aClockwise, aRotation
        );
        geometry = new THREE.BufferGeometry().setFromPoints(curve.getPoints(500));
        material = new THREE.LineBasicMaterial({ color: 0xffffff });
        ellipse = new THREE.Line(geometry, material);
        ellipse.rotation.x = THREE.Math.degToRad(90);
        orbits.push(ellipse);
        scene.add(ellipse);
    });
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
        this.orbits[i].scale.set((-1 * scaleValue) / 0.5, (-1 * scaleValue) / 0.5, (-1 * scaleValue) / 0.5);
    }
}

Orbits.prototype.scaleOrbitsToOriginalSize = function() {
    for (var i = 0; i < this.orbits.length; i++) {
        this.orbits[i].scale.set(1, 1, 1);
    }
}