class Planet {
    constructor(scene) {
        this.scene = scene;
        this.planetsObjects = [];
        this.planetsMeshes = [];
        this.planetsNamesOnScene = [];
        this.allPlanetDataJSON = [];
        this.allMoonDataJSON = [];
        this.planetSizes = [];
        this.betha = 0;
        this.timestamp = 0;

        this.jsonManager = new JSONManager();
        this.addAllPlanetDataJSON();
        this.addAllMoonDataJSON();

        this.orbitClass = new Orbits(scene, this.allPlanetDataJSON, this.allMoonDataJSON, this.planetsMeshes);
    }

    getPlanetMeshes() { return this.planetsMeshes; }
    getScaleValue() { return this.scaleValueScene; }
    getPlanetData() { return this.allPlanetDataJSON; }
    getMoonData() { return this.allMoonDataJSON; }
    getPlanetsNamesOnScene() { return this.planetsNamesOnScene; }
    getTimestamp() { return this.timestamp; }

    // Creating planet objects, meshes and adding them to Scene
    // -------------------------------------------------------------------------
    createPlanetObject(diameter) {
        return new THREE.SphereBufferGeometry(diameter, 50, 50);
    }

    createPlanets() {
        // 27x smaller scale for Sun; 5-6x smaller scale for Jupiter, Saturn, Uranus, Neptune
        var planetSizes = [0.3829, 0.9499, 1, 0.5320, 10.97 / 6, 9.140 / 6, 3.981 / 5, 3.865 / 5];
        for (var i = 0; i < planetSizes.length; i++) {
            this.planetsObjects.push(this.createPlanetObject(planetSizes[i]));
        }
    }

    setNewMesh(imageSrc) {
        let texture = new THREE.TextureLoader().load(imageSrc);
        this.meshMaterial = new THREE.MeshPhongMaterial({ map: texture });
        this.meshMaterial.receiveShadow = true;
        this.meshMaterial.castShadow = true;
        return this.meshMaterial;
    }

    createMesh(planetObject, imageSrc) {
        return new THREE.Mesh(planetObject, this.setNewMesh(imageSrc));
    }

    createPlanetsMesh(scene, planetsObjects) {
        this.createPlanets();
        this.mercuryMesh = this.createMesh(planetsObjects[0], '/images/textures/mercuryTexture2k.jpg');
        this.venusMesh = this.createMesh(planetsObjects[1], '/images/textures/venusTexture2k.jpg');
        this.earthMesh = this.createMesh(planetsObjects[2], '/images/textures/earthTexture2k.jpg');
        this.marsMesh = this.createMesh(planetsObjects[3], '/images/textures/marsTexture2k.jpg');
        this.jupiterMesh = this.createMesh(planetsObjects[4], '/images/textures/jupiterTexture2k.jpg');
        this.saturnMesh = this.createMesh(planetsObjects[5], '/images/textures/saturnTexture2k.jpg');
        this.uranusMesh = this.createMesh(planetsObjects[6], '/images/textures/uranusTexture2k.jpg');
        this.neptuneMesh = this.createMesh(planetsObjects[7], '/images/textures/neptuneTexture2k.jpg');

        this.planetsMeshes.push(this.mercuryMesh, this.venusMesh, this.earthMesh, this.marsMesh,
            this.jupiterMesh, this.saturnMesh, this.uranusMesh, this.neptuneMesh);
        this.addNamesToPlanetMeshes();
        this.addMeshToScene(scene, this.planetsMeshes);
    }

    addNamesToPlanetMeshes() {
        var planetNames = ["Mercury", "Venus", "Earth", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune"];

        for (i = 0; i < planetNames.length; i++) {
            (this.planetsMeshes[i]).name = planetNames[i];
        }
    }

    addMeshToScene(scene, planetsMeshes) {
        for (var i = 0; i < planetsMeshes.length; i++) {
            scene.add(planetsMeshes[i]);
        }
    }

    // Names for planets on Scene: TextGeometry
    // -------------------------------------------------------------------------
    createTextGeometry(planetsMeshes, planetsNamesOnScene, scene, objectNames, fontSize) {
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
                textMesh.name = "name" + objectNames[i];
                scene.add(textMesh);
            }
        });
    }

    addNamesToPlanetObject(planetsMeshes, planetsNamesOnScene, scene) {
        var planetNames = ["Mercury", "Venus", "Earth", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune"];
        this.createTextGeometry(planetsMeshes, planetsNamesOnScene, scene, planetNames, 1.2);

    }

    // Setting rotation angle for planets on Z-axis 
    // -------------------------------------------------------------------------
    setRotationAngleForSinglePlanet(planetMesh, planetName) {
        var dataOfCurrentPlanetJSON = this.allPlanetDataJSON[0];

        dataOfCurrentPlanetJSON.then(function(result) {
            planetMesh.setRotationFromAxisAngle(
                new THREE.Vector3(0, 0, 1),
                (result[planetName]["tiltAxisZ"] * Math.PI) / 180
            );
        });
    }

    setRotationAngleForAllPlanets() {
        var planetNames = ["Mercury", "Venus", "Earth", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune"];
        for (var i = 0; i < this.planetsMeshes.length; i++) {
            this.setRotationAngleForSinglePlanet(this.planetsMeshes[i], planetNames[i]);
        }
    }

    // Read data from JSON and save them
    // -------------------------------------------------------------------------
    addAllPlanetDataJSON = function() {
        this.allPlanetDataJSON.push(this.jsonManager.readPlanetsData());
    }

    addAllMoonDataJSON = function() {
        this.allMoonDataJSON.push(this.jsonManager.readMoonsData());
    }

    // Setting planets' and orbits' positions - according to rangeslider scale value
    // -------------------------------------------------------------------------
    setScaleForPlanetsAndOrbits(scaleValue, planetsMeshes) {
        this.scaleObjectMeshesByRangeslider(scaleValue, planetsMeshes);
        this.orbitClass.scaleOrbitsByRangeslider(scaleValue);
        this.orbitClass.positionAllMoonOrbits();
    }

    scaleObjectMeshesByRangeslider(scaleValue, objects) {
        for (var i = 0; i < objects.length; i++) {
            objects[i].scale.set(2 * scaleValue, 2 * scaleValue, 2 * scaleValue);
        }
    }

    // Moving planets on their orbits (ellipses)
    // -------------------------------------------------------------------------
    calculateRotationSpeed(planetOrder, speedValue, time, planetRotationSpeedAroundSun) {
        //window.setTimeout(this.timeOutForSpeedCalculation(speedValue), 10000);
        if (speedValue == 0) {
            this.timestamp = (planetRotationSpeedAroundSun[planetOrder] * 0.0001 * time);
        } else if (speedValue > 0) {
            this.timestamp = (planetRotationSpeedAroundSun[planetOrder] * 0.0001 * time) * speedValue;
        } else if (speedValue < 0) {
            this.timestamp = (planetRotationSpeedAroundSun[planetOrder] * 0.0001 * time) / Math.abs(speedValue);
        }
        return this.timestamp;
    }

    rotatePlanetOnOrbit(planetMesh, planetOrder, planetName, planetNameOnScene, scaleValue, speedValue, time) {
        var planetRotationSpeedAroundSun = [1.607, 1.174, 1.000, 0.802, 0.434, 0.323, 0.228, 0.128];
        var rotationSpeed = this.calculateRotationSpeed(planetOrder, speedValue, time, planetRotationSpeedAroundSun);

        if (planetMesh.position.z != 0 || planetMesh.position.z != NaN) {
            this.betha = Math.cos(planetMesh.position.x / planetMesh.position.z);
        }
        this.positionPlanetOnOrbit(planetMesh, planetName, planetNameOnScene, scaleValue * 2, rotationSpeed);
    }

    // Called in f. animate() (scene.js) - movement needs to by redrawn by renderer
    rotateAllPlanets(scaleValue, speedValue, time) {
        var planetMesh;
        var planetNames = ["Mercury", "Venus", "Earth", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune"];

        for (var i = 0; i < this.planetsMeshes.length; i++) {
            planetMesh = this.planetsMeshes[i];
            this.rotatePlanetOnOrbit(planetMesh, i, planetNames[i], this.planetsNamesOnScene[i], scaleValue, speedValue, time);
        }
    }

    // Positions for 1 planet - according to scale from rangeslider
    // -------------------------------------------------------------------------
    positionPlanetOnOrbit(planetMesh, planetName, planetNameOnScene, scaleValue, timestamp) {
        var dataOfCurrentPlanetJSON = this.allPlanetDataJSON[0];
        var orbitalSpeed = 0;

        dataOfCurrentPlanetJSON.then(function(result) {
            orbitalSpeed = result[planetName]["rotationSpeed"] / 15; // orbital speed was too high
            planetMesh.position.x = result[planetName]["c"] * scaleValue +
                (result[planetName]["a"] * result[planetName]["scaleFactor"] * scaleValue * Math.cos(timestamp * orbitalSpeed));
            planetMesh.position.z = -1 * (result[planetName]["b"] * result[planetName]["scaleFactor"] * scaleValue *
                Math.sin(timestamp * orbitalSpeed));

            if (planetNameOnScene != undefined && planetNameOnScene.visible == true) {
                planetNameOnScene.position.x = planetMesh.position.x + result[planetName]["planetSize"] * scaleValue + 1;
                planetNameOnScene.position.z = planetMesh.position.z;
            }
        });
    }

    // Called in scene.js - class MainScene
    // -------------------------------------------------------------------------
    initializePlanets() {
        this.createPlanetsMesh(this.scene, this.planetsObjects);
        this.orbitClass.createOrbitShape();
        this.addNamesToPlanetObject(this.planetsMeshes, this.planetsNamesOnScene, this.scene);
        this.setRotationAngleForAllPlanets();
    }
}