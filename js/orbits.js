class Orbits extends JSONManager {
    constructor(scene, planetMeshes) {
        super();
        this.scene = scene;
        this.orbits = [];
        this.allPlanetDataJSON = super.getPlanetData();
        this.allMoonDataJSON = super.getMoonData();
        this.planetMeshes = planetMeshes;
        this.allCurves = [];
        this.planetOrder = [2, 4, 4, 4, 4, 5, 5, 6, 6, 6, 6, 7];
        this.moonNames = ["Moon", "Io", "Europa", "Ganymede", "Callisto", "Rhea", "Titan",
            "Ariel", "Umbriel", "Titania", "Oberon", "Triton"
        ];
        this.createOrbitShape();
    }

    getAllOrbits() { return this.orbits; }

    // Creating orbits for planets and moons
    // -------------------------------------------------------------------------
    createOrbitShape() {
        var planets = ["Mercury", "Venus", "Earth", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune"];

        for (i = 0; i < planets.length; i++) {
            this.createCurveForOrbit(planets[i], this.orbits, this.scene, this.allPlanetDataJSON[0]);
        }
        for (i = 0; i < this.moonNames.length; i++) {
            this.createCurveForOrbit(this.moonNames[i], this.orbits, this.scene, this.allMoonDataJSON[0]);
        }
    }

    createCurveForOrbit(objectName, orbits, scene, dataJSON) {
        var curve, geometry, material, ellipse;
        var dataOfCurrentOrbitJSON = dataJSON;

        dataOfCurrentOrbitJSON.then(function(result) {
            curve = new THREE.EllipseCurve( // values for ellipse curve
                result[objectName]["c"], 0, // aX, aY (X/Y center of the ellipse)
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

    // Position moon orbits
    // -------------------------------------------------------------------------
    positionSingleMoonOrbit(moonOrbit, planetsMeshes, planetOrder, moonName) {
        var dataOfCurrentOrbitJSON = this.allMoonDataJSON[0];
        dataOfCurrentOrbitJSON.then(function(result) {
            moonOrbit.position.x = planetsMeshes[planetOrder].position.x + result[moonName]["c"];
            moonOrbit.position.z = planetsMeshes[planetOrder].position.z
        });
    }

    positionAllMoonOrbits() {
        for (var i = 8, j = 0; i < this.orbits.length; i++, j++) {
            this.positionSingleMoonOrbit(this.orbits[i], this.planetMeshes, this.planetOrder[j], this.moonNames[j]);
        }
    }

    // Scaling orbits according to zoom value from rangeslider
    // -------------------------------------------------------------------------
    scaleOrbitsByRangeslider(scaleValue) {
        for (var i = 0; i < this.orbits.length; i++) {
            this.orbits[i].scale.set(2 * scaleValue, 2 * scaleValue, 2 * scaleValue);
        }
    }
}