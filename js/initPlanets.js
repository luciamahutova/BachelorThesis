class InitPlanets {
    constructor() {
        this.allPlanetDataJSON = [];
        this.allMoonDataJSON = [];

        this.jsonManager = new JSONManager();
        this.addAllPlanetDataJSON();
        this.addAllMoonDataJSON();
    }

    getPlanetData() { return this.allPlanetDataJSON; }
    getMoonData() { return this.allMoonDataJSON; }

    // Functions fo creating space objects
    // -------------------------------------------------------------------------
    createPlanetObject(diameter) {
        return new THREE.SphereBufferGeometry(diameter, 50, 50);
    }

    setNewMesh(imageSrc) {
        var texture = new THREE.TextureLoader().load(imageSrc);
        var meshMaterial = new THREE.MeshPhongMaterial({ map: texture });
        meshMaterial.receiveShadow = true;
        meshMaterial.castShadow = true;
        return meshMaterial;
    }

    createMesh(planetObject, imageSrc) {
        return new THREE.Mesh(planetObject, this.setNewMesh(imageSrc));
    }

    addMeshToScene(scene, planetsMeshes) {
        for (var i = 0; i < planetsMeshes.length; i++) {
            scene.add(planetsMeshes[i]);
        }
    }

    scaleObjectsByRangeslider(scaleValue, objects) {
        for (var i = 0; i < objects.length; i++) {
            objects[i].scale.set(2 * scaleValue, 2 * scaleValue, 2 * scaleValue);
        }
    }

    // Names for planets on Scene: TextGeometry
    // -------------------------------------------------------------------------
    createTextGeometry(planetsMeshes, planetsNamesOnScene, scene, objectNames, fontSize, startsWith) {
        var geometry, textMesh;
        const loader = new THREE.FontLoader();

        loader.load('node_modules/three/examples/fonts/helvetiker_regular.typeface.json', function(font) {
            var material = new THREE.MeshNormalMaterial();
            material.transparent = false;

            for (i = 0; i < planetsMeshes.length; i++) {
                geometry = new THREE.TextGeometry(objectNames[i], {
                    font: font,
                    size: fontSize,
                    height: 0,
                    bevelEnabled: false
                });
                textMesh = new THREE.Mesh(geometry, material);
                textMesh.setRotationFromAxisAngle(
                    new THREE.Vector3(1, 0, 0),
                    (Math.PI / 2 * 3)
                );

                planetsNamesOnScene.push(textMesh);
                planetsMeshes[i].add(textMesh);
                textMesh.name = startsWith + objectNames[i];
                scene.add(textMesh);
            }
        });
    }

    // Read data from JSON and save them
    // -------------------------------------------------------------------------
    addAllPlanetDataJSON = function() {
        this.allPlanetDataJSON.push(this.jsonManager.readPlanetsData());
    }

    addAllMoonDataJSON = function() {
        this.allMoonDataJSON.push(this.jsonManager.readMoonsData());
    }

    // Change of rotation speed
    // -------------------------------------------------------------------------
    calculateRotationSpeed(planetOrder, speedValue, time, planetRotationSpeedAroundSun) {
        if (speedValue == 0) {
            return (planetRotationSpeedAroundSun[planetOrder] * 0.0001 * time);
        } else if (speedValue > 0) {
            return (planetRotationSpeedAroundSun[planetOrder] * 0.0001 * time) * speedValue;
        } else if (speedValue < 0) {
            return (planetRotationSpeedAroundSun[planetOrder] * 0.0001 * time) / Math.abs(speedValue);
        }
    }
}