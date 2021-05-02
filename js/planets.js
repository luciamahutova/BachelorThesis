class Planet extends InitPlanetObject {
    constructor(scene) {
        super();
        this.scene = scene;
        this.planetsMeshes = [];
        this.planetNamesOnSceneEN = [];
        this.planetNamesOnSceneCZ = [];
        this.planetNamesOnSceneSK = [];

        this.orbitClass;
        this.cosmicObject;
    }

    // Get()
    getPlanetMeshes() { return this.planetsMeshes }
    getScaleValue() { return this.scaleValueScene }
    getPlanetNamesEN() { return this.planetNamesOnSceneEN }
    getPlanetNamesCZ() { return this.planetNamesOnSceneCZ }
    getPlanetNamesSK() { return this.planetNamesOnSceneSK }
    getScene() { return this.scene }


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
        var mercuryMesh = this.createMesh(planetObjects[0], '/images/textures/mercuryTexture2k.jpg');
        var venusMesh = this.createMesh(planetObjects[1], '/images/textures/venusTexture2k.jpg');
        var earthMesh = this.createMesh(planetObjects[2], '/images/textures/earthTexture2k.jpg');
        var marsMesh = this.createMesh(planetObjects[3], '/images/textures/marsTexture2k.jpg');
        var jupiterMesh = this.createMesh(planetObjects[4], '/images/textures/jupiterTexture2k.jpg');
        var saturnMesh = this.createMesh(planetObjects[5], '/images/textures/saturnTexture2k.jpg');
        var uranusMesh = this.createMesh(planetObjects[6], '/images/textures/uranusTexture2k.jpg');
        var neptuneMesh = this.createMesh(planetObjects[7], '/images/textures/neptuneTexture2k.jpg');

        this.planetsMeshes.push(mercuryMesh, venusMesh, earthMesh, marsMesh, jupiterMesh, saturnMesh, uranusMesh, neptuneMesh);
        this.addNamesToPlanetMesh();
        this.addMeshToScene(scene, this.getPlanetMeshes());
    }

    addNamesToPlanetMesh() {
        for (i = 0; i < (this.getPlanetNames()).length; i++) {
            ((this.getPlanetMeshes())[i]).name = (this.getPlanetNames())[i];
        }
    }

    // Names for planets on Scene: TextGeometry
    // -------------------------------------------------------------------------
    addNamesToPlanetObject(planetsMeshes, scene) {
        var planetNamesEN = ["Mercury", "Venus", "Earth", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune"];
        var planetNamesCZ = ["Merkur", "Venuse", "Zeme", "Mars", "Jupiter", "Saturn", "Uran", "Neptun"];
        var planetNamesSK = ["Merkur", "Venusa", "Zem", "Mars", "Jupiter", "Saturn", "Uran", "Neptun"];
        this.createTextGeometry(planetsMeshes, this.getPlanetNamesEN(), scene, planetNamesEN, 1.2, "nameEn");
        this.createTextGeometry(planetsMeshes, this.getPlanetNamesCZ(), scene, planetNamesCZ, 1.2, "nameCz");
        this.createTextGeometry(planetsMeshes, this.getPlanetNamesSK(), scene, planetNamesSK, 1.2, "nameSk");
    }

    // Setting rotation angle for planets on Z-axis 
    // -------------------------------------------------------------------------
    setRotationAngleForSinglePlanet(planetMesh, planetName) {
        var dataOfCurrentPlanetJSON = (this.getPlanetDataJSON())[0];

        dataOfCurrentPlanetJSON.then(function(result) {
            planetMesh.setRotationFromAxisAngle(
                new THREE.Vector3(0, 0, 1),
                (result[planetName]["tiltAxisZ"] * Math.PI) / 180
            );
        });
    }

    setRotationAngleForAllPlanets() {
        for (var i = 0; i < (this.getPlanetMeshes()).length; i++) {
            this.setRotationAngleForSinglePlanet((this.getPlanetMeshes())[i], (this.getPlanetNames())[i]);
        }
    }

    // Moving planets on their orbits (ellipses)
    // -------------------------------------------------------------------------
    rotateAllPlanets(time) {
        // Called in f. animate() in modelScene.js - movement needs to by redrawn by renderer
        var planetMeshes = this.getPlanetMeshes();

        if (document.getElementById("en").style.fontWeight == "bold") {
            for (var i = 0; i < planetMeshes.length; i++) {
                this.positionPlanetOnOrbit(planetMeshes[i], (this.getPlanetNames())[i], (this.getPlanetNamesEN())[i], time);
            }

            this.traverseSceneToFindPlanetNames(true, "nameEn", this.getScene());
            this.traverseSceneToFindPlanetNames(false, "nameCz", this.getScene());
            this.traverseSceneToFindPlanetNames(false, "nameSk", this.getScene());
        } else if (document.getElementById("cz").style.fontWeight == "bold") {
            for (var i = 0; i < planetMeshes.length; i++) {
                this.positionPlanetOnOrbit(planetMeshes[i], (this.getPlanetNames())[i], (this.getPlanetNamesCZ())[i], time);
            }

            this.traverseSceneToFindPlanetNames(true, "nameCz", this.getScene());
            this.traverseSceneToFindPlanetNames(false, "nameEn", this.getScene());
            this.traverseSceneToFindPlanetNames(false, "nameSk", this.getScene());
        } else if (document.getElementById("sk").style.fontWeight == "bold") {
            for (var i = 0; i < planetMeshes.length; i++) {
                this.positionPlanetOnOrbit(planetMeshes[i], (this.getPlanetNames())[i], (this.getPlanetNamesSK())[i], time);
            }

            this.traverseSceneToFindPlanetNames(true, "nameSk", this.getScene());
            this.traverseSceneToFindPlanetNames(false, "nameEn", this.getScene());
            this.traverseSceneToFindPlanetNames(false, "nameCz", this.getScene());
        }
    }

    // Positions for 1 planet - according to scale from rangeslider
    // -------------------------------------------------------------------------
    positionPlanetOnOrbit(planetMesh, planetName, planetNameOnScene, time) {
        var dataOfCurrentPlanetJSON = (this.getPlanetDataJSON())[0];
        var orbitalSpeed = 0;

        dataOfCurrentPlanetJSON.then(function(result) {
            orbitalSpeed = result[planetName]["orbitalSpeed"] / 3;
            planetMesh.position.x = result[planetName]["c"] + 0.00001 +
                (result[planetName]["a"] * result[planetName]["scaleFactor"] * Math.cos(orbitalSpeed * 0.0001 * time));
            planetMesh.position.z = -1 * (result[planetName]["b"] * result[planetName]["scaleFactor"] *
                Math.sin(orbitalSpeed * 0.0001 * time)) + 0.00001;

            if (planetNameOnScene !== undefined) {
                planetNameOnScene.position.x = planetMesh.position.x + result[planetName]["planetSize"] + 1;
                planetNameOnScene.position.z = planetMesh.position.z;
            }
        });
    }

    // Called in scene.js - class MainScene
    // -------------------------------------------------------------------------
    initializePlanets() {
        this.createPlanetsMesh(this.getScene());
        this.addNamesToPlanetObject(this.getPlanetMeshes(), this.getScene());
        this.setRotationAngleForAllPlanets();

        this.orbitClass = new Orbits(this.getScene(), this.getPlanetMeshes());
        this.cosmicObject = new CosmicObject(this.getScene(), this.getPlanetMeshes());
    }
}