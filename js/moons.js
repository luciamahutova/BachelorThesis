class Moon extends InitPlanets {
    constructor(scene, orbits) {
        super();
        this.scene = scene;
        this.orbits = orbits;
        this.allPlanetDataJSON = this.getPlanetData();
        this.moonMeshes = [];
        this.moonNamesOnScene = [];
        this.moonNames = this.getMoonNames();
        this.initializeMoons();
    }

    getMoonsNamesOnScene() { return this.moonNamesOnScene; }
    getMoonMeshes() { return this.moonMeshes; }

    createMoons() {
        var moonSizeAndParent = {
            "Moon": [0.2727, "Earth"],
            "Io": [0.2859, "Jupiter"],
            "Europa": [0.2450, "Jupiter"],
            "Ganymede": [0.4135, "Jupiter"],
            "Callisto": [0.3783, "Jupiter"],
            "Rhea": [0.1199, "Saturn"],
            "Titan": [0.4037, "Saturn"],
            "Ariel": [0.0909, "Uranus"],
            "Umbriel": [0.0918, "Uranus"],
            "Titania": [0.1237, "Uranus"],
            "Oberon": [0.1195, "Uranus"],
            "Triton": [0.2124, "Neptune"]
        };

        var moon, moonMesh, property, size;
        var material;
        for (i = 0; i < Object.keys(moonSizeAndParent).length; i++) {
            material = new THREE.MeshPhongMaterial({ color: 0xBABABA });
            property = Object.keys(moonSizeAndParent)[i];
            size = moonSizeAndParent[Object.keys(moonSizeAndParent)[i]][0];
            moon = this.createPlanetObject(size);

            moonMesh = new THREE.Mesh(moon, material);
            moonMesh.name = property;

            this.moonMeshes.push(moonMesh);
            moonMesh.position.x = 10 + i * 3;
        }
        this.addMeshToScene(this.scene, this.moonMeshes);
    }

    // Positions for moons - according to zoom
    // -------------------------------------------------------------------------
    rotateMoonAroundPlanet(moonMesh, moonNameJSON, orbitOrder, planetName, scaleValue, time) {
        if ((scaleValue * 200) < 70) {
            this.positionMoonZoomOut();
        } else {;
            this.positionMoonToOrbit(moonMesh, moonNameJSON, this.orbits, orbitOrder, planetName, scaleValue, time);
        }
    }

    rotateAllMoons(scaleValue, time) {
        for (var i = 0; i < this.moonMeshes.length; i++) {
            this.rotateMoonAroundPlanet(this.moonMeshes[i], this.moonNames[i], i, this.moonNamesOnScene[i], scaleValue, time);
        }
    }

    positionMoonToOrbit(moonMesh, moonNameJSON, orbits, orbitOrder, moonNameOnScene, scaleValue, time) {
        this.traverseSceneToFindMoons(true, "");
        this.traverseSceneToFindMoons(true, "name");
        var orbitalSpeed = 0;

        var dataOfCurrentPlanetJSON = this.allMoonDataJSON[0];
        dataOfCurrentPlanetJSON.then(function(result) {
            orbitalSpeed = result[moonNameJSON]["orbitalSpeed"] / 5; // speed is too high
            moonMesh.position.x = orbits[orbitOrder + 8].position.x + 2 * result[moonNameJSON]["a"] *
                result[moonNameJSON]["scaleFactor"] * scaleValue * Math.cos(orbitalSpeed * 0.0001 * time);
            moonMesh.position.z = orbits[orbitOrder + 8].position.z - 2 * result[moonNameJSON]["b"] *
                result[moonNameJSON]["scaleFactor"] * scaleValue * Math.sin(orbitalSpeed * 0.0001 * time);

            if (moonNameOnScene != undefined && moonNameOnScene.visible == true) {
                moonNameOnScene.position.x = moonMesh.position.x + 1;
                moonNameOnScene.position.z = moonMesh.position.z;
            }
        });
    }

    positionMoonZoomOut() {
        this.traverseSceneToFindMoons(false, "");
        this.traverseSceneToFindMoons(false, "name");
    }

    traverseSceneToFindMoons(showObjectsBoolean, name) {
        // Hide all moons, orbits and name (cannot remove from scene in f. scene.traverse)
        // Arg.: empty name for moons and orbits, "name" for TextGeometry
        this.scene.traverse(function(children) {
            if (children.name == name + "Moon" || children.name == name + "Io" || children.name == name + "Europa" ||
                children.name == name + "Ganymede" || children.name == name + "Callisto" || children.name == name + "Rhea" ||
                children.name == name + "Titan" || children.name == name + "Ariel" || children.name == name + "Umbriel" ||
                children.name == name + "Titania" || children.name == name + "Oberon" || children.name == name + "Triton") {
                children.visible = showObjectsBoolean;
            }
        });
    }

    // Initialize 
    // -------------------------------------------------------------------------
    initializeMoons() {
        this.createMoons();
        this.createTextGeometry(this.moonMeshes, this.moonNamesOnScene, this.scene, this.moonNames, 0.9, "name");
    }
}