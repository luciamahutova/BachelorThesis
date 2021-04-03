class Orbits extends JSONManager {
    constructor(scene, planetMeshes) {
        super();
        this.scene = scene;
        this.orbits = [];
        this.planetMeshes = planetMeshes;
        this.allCurves = [];
        this.planetOrder = [2, 4, 4, 4, 4, 5, 5, 6, 6, 6, 6, 7];
        this.createOrbitShape();
    }

    // Get()
    getAllOrbits() { return this.orbits }
    getScene() { return this.scene }
    getPlanetMeshes() { return this.planetMeshes }
    getPlanerOrder() { return this.planetOrder }

    // Creating orbits for planets and moons
    // -------------------------------------------------------------------------
    createOrbitShape() {
        for (i = 0; i < (this.getPlanetNames()).length; i++) {
            this.createCurveForOrbit((this.getPlanetNames())[i], this.getAllOrbits(), this.getScene(), this.getPlanetData()[0]);
        }
        for (i = 0; i < (this.getMoonNames()).length; i++) {
            this.createCurveForOrbit((this.getMoonNames())[i], this.getAllOrbits(), this.getScene(), (this.getMoonData())[0]);
        }
    }

    createCurveForOrbit(objectName, orbits, scene, dataJSON) {
        var curve, promiseValue;
        var dataOfCurrentOrbitJSON = dataJSON;

        (async() => {
            promiseValue = dataOfCurrentOrbitJSON.then(function(result) {
                curve = new THREE.EllipseCurve( // values for ellipse curve
                    result[objectName]["c"], 0, // aX, aY (X/Y center of the ellipse)
                    result[objectName]["a"] * result[objectName]["scaleFactor"], //xRadius 
                    result[objectName]["b"] * result[objectName]["scaleFactor"], //yRadius 
                    0, 2 * Math.PI, // aStartAngle, aEndAngle (angle of the curve in radians starting from the positive X axis)
                    false, 0 // aClockwise, aRotation
                );
            });
            await promiseValue;

            var ellipse = this.setParamsForOrbitCurve(objectName, orbits, curve);
            scene.add(ellipse);
        })();
    }

    setParamsForOrbitCurve(objectName, orbits, curve) {
        var geometry, material, ellipse;
        geometry = new THREE.BufferGeometry().setFromPoints(curve.getPoints(500));
        material = new THREE.LineBasicMaterial({ color: 0xffffff });
        ellipse = new THREE.Line(geometry, material);
        ellipse.rotation.x = THREE.Math.degToRad(90);
        ellipse.name = objectName;
        orbits.push(ellipse);
        return ellipse;
    }

    // Position moon orbits
    // -------------------------------------------------------------------------
    positionSingleMoonOrbit(moonOrbit, planetsMeshes, planetOrder, moonName) {
        var dataOfCurrentOrbitJSON = (this.getMoonData())[0];
        dataOfCurrentOrbitJSON.then(function(result) {
            moonOrbit.position.x = planetsMeshes[planetOrder].position.x + result[moonName]["c"];
            moonOrbit.position.z = planetsMeshes[planetOrder].position.z
        });
    }

    positionAllMoonOrbits() {
        var orbits = this.getAllOrbits();
        var planetMeshes = this.getPlanetMeshes();
        var moonNames = this.getMoonNames();
        for (var i = 8, j = 0; i < (this.getAllOrbits()).length; i++, j++) {
            this.positionSingleMoonOrbit(orbits[i], planetMeshes, (this.getPlanerOrder())[j], moonNames[j]);
        }
    }
}