class Planet extends InitPlanets {
    constructor(scene) {
        super();
        this.scene = scene;
        this.planetsObjects = [];
        this.planetsMeshes = [];
        this.planetsNamesOnSceneEN = [];
        this.planetsNamesOnSceneCZ = [];
        this.planetsNamesOnSceneSK = [];
        this.planetSizes = [];
        this.planetNames = ["Mercury", "Venus", "Earth", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune"];
        this.allPlanetDataJSON = super.getPlanetDataJSON();
        this.allMoonDataJSON = super.getMoonDataJSON();

        this.orbitClass;
        this.cosmicObject;
    }

    getPlanetMeshes() { return this.planetsMeshes; }
    getScaleValue() { return this.scaleValueScene; }
    getPlanetNamesEN() { return this.planetsNamesOnSceneEN; }
    getPlanetNamesCZ() { return this.planetsNamesOnSceneCZ; }
    getPlanetNamesSK() { return this.planetsNamesOnSceneSK; }

    // Creating planet objects, meshes and adding them to Scene
    // -------------------------------------------------------------------------
    createPlanets() {
        // 27x smaller scale for Sun; 5-6x smaller scale for Jupiter, Saturn, Uranus, Neptune
        var planetSizes = [0.3829, 0.9499, 1, 0.5320, 10.97 / 6, 9.140 / 6, 3.981 / 5, 3.865 / 5];
        for (var i = 0; i < planetSizes.length; i++) {
            this.planetsObjects.push(this.createPlanetObject(planetSizes[i]));
        }
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
        this.createTextGeometry(planetsMeshes, this.planetsNamesOnSceneEN, scene, planetNamesEN, 1.2, "nameEn");
        this.createTextGeometry(planetsMeshes, this.planetsNamesOnSceneCZ, scene, planetNamesCZ, 1.2, "nameCz");
        this.createTextGeometry(planetsMeshes, this.planetsNamesOnSceneSK, scene, planetNamesSK, 1.2, "nameSk");
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
        // Called in f. animate() (scene.js) - movement needs to by redrawn by renderer
        this.traverseSceneToFindPlanetNames(false, "nameEn");
        this.traverseSceneToFindPlanetNames(false, "nameCz");
        this.traverseSceneToFindPlanetNames(false, "nameSk");

        if (document.getElementById("en").style.fontWeight == "bold") {
            for (var i = 0; i < this.planetsMeshes.length; i++) {
                this.traverseSceneToFindPlanetNames(true, "nameEn");
                this.positionPlanetOnOrbit(this.planetsMeshes[i], this.planetNames[i], this.planetsNamesOnSceneEN[i],
                    scaleValue * 2, time);
            }
        } else if (document.getElementById("cz").style.fontWeight == "bold") {
            for (var i = 0; i < this.planetsMeshes.length; i++) {
                this.traverseSceneToFindPlanetNames(true, "nameCz");
                this.positionPlanetOnOrbit(this.planetsMeshes[i], this.planetNames[i], this.planetsNamesOnSceneCZ[i],
                    scaleValue * 2, time);
            }
        } else if (document.getElementById("sk").style.fontWeight == "bold") {
            for (var i = 0; i < this.planetsMeshes.length; i++) {
                this.traverseSceneToFindPlanetNames(true, "nameSk");
                this.positionPlanetOnOrbit(this.planetsMeshes[i], this.planetNames[i], this.planetsNamesOnSceneSK[i],
                    scaleValue * 2, time);
            }
        }
    }

    traverseSceneToFindPlanetNames(showBoolean, stringName) {
        this.scene.traverse(function(children) {
            if (children.name.startsWith(stringName)) {
                children.visible = showBoolean;
            }
        });
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
        this.createPlanetsMesh(this.scene, this.planetsObjects);
        this.addNamesToPlanetObject(this.planetsMeshes, this.scene);
        this.setRotationAngleForAllPlanets();

        this.orbitClass = new Orbits(this.scene, this.planetsMeshes, this.allPlanetDataJSON, this.allMoonDataJSON);
        this.cosmicObject = new CosmicObject(this.scene, this.getPlanetMeshes());
    }
}