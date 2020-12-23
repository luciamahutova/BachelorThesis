class Orbits {
    constructor(scene, planetData, planetsMeshes) {
        this.scene = scene;
        this.orbits = [];
        this.planetData = planetData;
        this.planetsMeshes = planetsMeshes;
    }
}


// Creating orbits for planets
// -------------------------------------------------------------------------
Orbits.prototype.createOrbitShape = function() {
    var curve, geometry, material, ellipse;

    for (var i = 0; i < this.planetData.length; i++) {
        curve = this.createCurveForOrbit(i);
        geometry = new THREE.BufferGeometry().setFromPoints(curve.getPoints(500));
        material = new THREE.LineBasicMaterial({ color: 0xffffff });
        ellipse = new THREE.Line(geometry, material);
        ellipse.rotation.x = THREE.Math.degToRad(90);
        this.orbits.push(ellipse);
        this.scene.add(ellipse);
    }
}

Orbits.prototype.createCurveForOrbit = function(i, scaleValue) {
    var curve;
    if (scaleValue > 0) {
        curve = new THREE.EllipseCurve(
            this.planetData[i]["c"], 0, // aX, aY (X/Y center of the ellipse)
            this.planetData[i]["a"] * this.planetData[i]["scaleFactor"], //xRadius 
            this.planetData[i]["b"] * this.planetData[i]["scaleFactor"], //yRadius 
            0, 2 * Math.PI, // aStartAngle, aEndAngle (angle of the curve in radians starting from the positive X axis)
            false, 0 // aClockwise, aRotation
        );
    } else if (scaleValue < 0) {
        curve = new THREE.EllipseCurve(
            this.planetData[i]["c"], 0,
            (this.planetData[i]["a"] * this.planetData[i]["scaleFactor"]) / scaleValue / 2, // planetData[i]["zoom"]
            (this.planetData[i]["b"] * this.planetData[i]["scaleFactor"]) / scaleValue / 2,
            0, 2 * Math.PI,
            false, 0
        );
    } else {
        curve = new THREE.EllipseCurve(
            this.planetData[i]["c"], 0,
            this.planetData[i]["a"] * this.planetData[i]["scaleFactor"],
            this.planetData[i]["b"] * this.planetData[i]["scaleFactor"],
            0, 2 * Math.PI,
            false, 0
        );
    }
    return curve;
}

// Scaling orbits according to zoom value from rangeslider
// -------------------------------------------------------------------------
Orbits.prototype.setScaleForOrbits = function(scaleValue) {
    if (scaleValue > 0) {
        this.scaleOrbitsRangesliderPositiveValue(scaleValue);
    } else if (scaleValue < 0) {
        scaleValue *= -1;
        this.scaleOrbitsRangesliderNegativeValue(scaleValue);
    } else {
        this.scaleOrbitsToOriginalSize();
    }
}

Orbits.prototype.scaleOrbitsRangesliderPositiveValue = function(scaleValue) {
    for (var i = 0; i < this.orbits.length; i++) {
        this.orbits[i].scale.set(2 * scaleValue, 2 * scaleValue, 2 * scaleValue);
    }
}

Orbits.prototype.scaleOrbitsRangesliderNegativeValue = function(scaleValue) {
    for (var i = 0; i < this.orbits.length; i++) {
        this.orbits[i].scale.set(0.5 / (-1 * scaleValue), 0.5 / (-1 * scaleValue), 0.5 / (-1 * scaleValue));
    }
}

Orbits.prototype.scaleOrbitsToOriginalSize = function() {
    for (var i = 0; i < this.orbits.length; i++) {
        this.orbits[i].scale.set(1, 1, 1);
    }
}