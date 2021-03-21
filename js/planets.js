class Planet extends InitPlanets {
    constructor(scene) {
        super();
        this.scene = scene;
        this.planetsMeshes = [];
        this.planetNamesOnSceneEN = [];
        this.planetNamesOnSceneCZ = [];
        this.planetNamesOnSceneSK = [];
        this.planetNames = this.getPlanetNames();
        this.allPlanetDataJSON = super.getPlanetDataJSON();
        this.allMoonDataJSON = super.getMoonDataJSON();

        this.orbitClass;
        this.cosmicObject;
    }

    getPlanetMeshes() { return this.planetsMeshes; }
    getScaleValue() { return this.scaleValueScene; }
    getPlanetNamesEN() { return this.planetNamesOnSceneEN; }
    getPlanetNamesCZ() { return this.planetNamesOnSceneCZ; }
    getPlanetNamesSK() { return this.planetNamesOnSceneSK; }

    // Creating planet objects, meshes and adding them to Scene
    // -------------------------------------------------------------------------
    createPlanets() {
        // 27x smaller scale for Sun; 5-6x smaller scale for Jupiter, Saturn, Uranus, Neptune
        var planetSizes = [0.3829, 0.9499, 1, 0.5320, 10.97 / 6, 9.140 / 6, 3.981 / 5, 3.865 / 5];
        var planetObjects = [];

        for (var i = 0; i < planetSizes.length; i++) {
            planetObjects.push(this.createPlanetObject(planetSizes[i]));
        }
        return planetObjects;
    }

    createPlanetsMesh(scene) {
        var planetObjects = this.createPlanets();
        this.mercuryMesh = this.createMesh(planetObjects[0], '/images/textures/mercuryTexture2k.jpg');
        this.venusMesh = this.createMesh(planetObjects[1], '/images/textures/venusTexture2k.jpg');
        this.earthMesh = this.createMesh(planetObjects[2], '/images/textures/earthTexture2k.jpg');
        this.marsMesh = this.createMesh(planetObjects[3], '/images/textures/marsTexture2k.jpg');
        this.jupiterMesh = this.createMesh(planetObjects[4], '/images/textures/jupiterTexture2k.jpg');
        this.saturnMesh = this.createMesh(planetObjects[5], '/images/textures/saturnTexture2k.jpg');
        this.uranusMesh = this.createMesh(planetObjects[6], '/images/textures/uranusTexture2k.jpg');
        this.neptuneMesh = this.createMesh(planetObjects[7], '/images/textures/neptuneTexture2k.jpg');

        this.planetsMeshes.push(this.mercuryMesh, this.venusMesh, this.earthMesh, this.marsMesh,
            this.jupiterMesh, this.saturnMesh, this.uranusMesh, this.neptuneMesh);
        this.addNamesToPlanetMesh();
        this.addMeshToScene(scene, this.planetsMeshes);
    }

    addNamesToPlanetMesh() {
        for (i = 0; i < this.planetNames.length; i++) {
            (this.planetsMeshes[i]).name = this.planetNames[i];
        }
    }

    // Names for planets on Scene: TextGeometry
    // -------------------------------------------------------------------------
    addNamesToPlanetObject(planetsMeshes, scene) {
        var planetNamesEN = ["Mercury", "Venus", "Earth", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune"];
        var planetNamesCZ = ["Merkur", "Venuse", "Zeme", "Mars", "Jupitr", "Saturn", "Uran", "Neptun"];
        var planetNamesSK = ["Merkur", "Venusa", "Zem", "Mars", "Jupiter", "Saturn", "Uran", "Neptun"];
        this.createTextGeometry(planetsMeshes, this.planetNamesOnSceneEN, scene, planetNamesEN, 1.2, "nameEn");
        this.createTextGeometry(planetsMeshes, this.planetNamesOnSceneCZ, scene, planetNamesCZ, 1.2, "nameCz");
        this.createTextGeometry(planetsMeshes, this.planetNamesOnSceneSK, scene, planetNamesSK, 1.2, "nameSk");
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
        for (var i = 0; i < this.planetsMeshes.length; i++) {
            this.setRotationAngleForSinglePlanet(this.planetsMeshes[i], this.planetNames[i]);
        }
    }

    // Setting planets' and orbits' positions - according to rangeslider scale value
    // -------------------------------------------------------------------------
    setScaleForObjectsAndOrbits(scaleValue) {
        this.scaleObjectsByRangeslider(scaleValue, this.planetsMeshes);
        this.scaleObjectsByRangeslider(scaleValue, this.cosmicObject.getCosmicObject());
        this.orbitClass.scaleOrbitsByRangeslider(scaleValue);
        this.orbitClass.positionAllMoonOrbits();
    }

    // Moving planets on their orbits (ellipses)
    // -------------------------------------------------------------------------
    rotateAllPlanets(scaleValue, time) {
        // Called in f. animate() in modelScene.js - movement needs to by redrawn by renderer
        this.traverseSceneToFindPlanetNames(false, "nameEn");
        this.traverseSceneToFindPlanetNames(false, "nameCz");
        this.traverseSceneToFindPlanetNames(false, "nameSk");

        if (document.getElementById("en").style.fontWeight == "bold") {
            this.traverseSceneToFindPlanetNames(true, "nameEn");
            for (var i = 0; i < this.planetsMeshes.length; i++) {
                this.positionPlanetOnOrbit(this.planetsMeshes[i], this.planetNames[i], this.planetNamesOnSceneEN[i],
                    scaleValue * 2, time);
            }
        } else if (document.getElementById("cz").style.fontWeight == "bold") {
            this.traverseSceneToFindPlanetNames(true, "nameCz");
            for (var i = 0; i < this.planetsMeshes.length; i++) {
                this.positionPlanetOnOrbit(this.planetsMeshes[i], this.planetNames[i], this.planetNamesOnSceneCZ[i],
                    scaleValue * 2, time);
            }
        } else if (document.getElementById("sk").style.fontWeight == "bold") {
            this.traverseSceneToFindPlanetNames(true, "nameSk");
            for (var i = 0; i < this.planetsMeshes.length; i++) {
                this.positionPlanetOnOrbit(this.planetsMeshes[i], this.planetNames[i], this.planetNamesOnSceneSK[i],
                    scaleValue * 2, time);
            }
        }
    }

    // Positions for 1 planet - according to scale from rangeslider
    // -------------------------------------------------------------------------
    positionPlanetOnOrbit(planetMesh, planetName, planetNameOnScene, scaleValue, time) {
        var dataOfCurrentPlanetJSON = this.allPlanetDataJSON[0];
        var orbitalSpeed = 0;

        dataOfCurrentPlanetJSON.then(function(result) {
            orbitalSpeed = result[planetName]["orbitalSpeed"] / 3;
            planetMesh.position.x = result[planetName]["c"] * scaleValue +
                (result[planetName]["a"] * result[planetName]["scaleFactor"] * scaleValue * Math.cos(orbitalSpeed * 0.0001 * time));
            planetMesh.position.z = -1 * (result[planetName]["b"] * result[planetName]["scaleFactor"] * scaleValue *
                Math.sin(orbitalSpeed * 0.0001 * time));

            if (planetNameOnScene != undefined && planetNameOnScene.visible == true) {
                planetNameOnScene.position.x = planetMesh.position.x + result[planetName]["planetSize"] * scaleValue + 1;
                planetNameOnScene.position.z = planetMesh.position.z;
            }
        });
    }

    // Called in scene.js - class MainScene
    // -------------------------------------------------------------------------
    initializePlanets() {
        this.createPlanetsMesh(this.scene);
        this.addNamesToPlanetObject(this.planetsMeshes, this.scene);
        this.setRotationAngleForAllPlanets();

        this.orbitClass = new Orbits(this.scene, this.planetsMeshes);
        this.cosmicObject = new CosmicObject(this.scene, this.getPlanetMeshes());
    }
}