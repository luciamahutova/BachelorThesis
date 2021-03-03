class Moon extends Planet {
    constructor(scene, planetsMeshes, allPlanetDataJSON, orbits) {
        super();
        this.scene = scene;
        this.planetsMeshes = planetsMeshes;
        this.moonsMeshes = [];
        this.orbits = orbits;
        this.moonsNamesOnScene = [];
        this.allPlanetDataJSON = allPlanetDataJSON;
    }

    initializeMoons = function() {
        this.createMoons();
        this.addNamesToMoonObject(this.moonsMeshes, this.moonsNamesOnScene, this.scene);
    }

    getMoonsNamesOnScene = function() { return this.moonsNamesOnScene; }
    getMoonMeshes = function() { return this.moonsMeshes; }
}

Moon.prototype.createMoons = function() {
    var moonSizeAndParent = {
        "Moon": [0.2727, "Earth"],
        "Io": [0.2859, "Jupiter"],
        "Europa": [0.2450, "Jupiter"],
        "Ganymede": [0.4135, "Jupiter"],
        "Callisto": [0.3783, "Jupiter"],
        "Tethys": [0.0834, "Saturn"],
        "Dione": [0.0881, "Saturn"],
        "Rhea": [0.1199, "Saturn"],
        "Titan": [0.4037, "Saturn"],
        "Iapetus": [0.1153, "Saturn"],
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

        this.moonsMeshes.push(moonMesh);
        moonMesh.position.x = 10 + i * 3;
    }
    // RODIČ NENASTAVENÝ, RODIČOM OSTÁVA Scene
    //this.addParentToMoon(moonSizeAndParent, this.planetsMeshes, this.moonsMeshes);
    this.addMeshToScene(this.scene, this.moonsMeshes);
}

Moon.prototype.addParentToMoon = function(moonSizeAndParent, planetsMeshes, moonsMeshes) {
    var moonParent, moonName;
    for (i = 0, j = 0; i < 14;) {
        moonParent = moonSizeAndParent[Object.keys(moonSizeAndParent)[i]][1];
        moonName = Object.keys(moonSizeAndParent)[i];
        if (planetsMeshes[j].name == moonParent) {
            planetsMeshes[j].add(moonsMeshes[i]);
            i++;
        } else { j++; }
    }
}

Moon.prototype.addNamesToMoonObject = function(moonsMeshes, moonsNamesOnScene, scene) {
    var moonNames = ["Moon", "Io", "Europa", "Ganymede", "Callisto", "Tethys", "Dione", "Rhea", "Titan",
        "Iapetus", "Ariel", "Umbriel", "Titania", "Oberon", "Triton"
    ];
    this.createTextGeometry(moonsMeshes, moonsNamesOnScene, scene, moonNames, 0.9);
}


// Positions for the Moon - according to zoom
// -------------------------------------------------------------------------
Moon.prototype.rotateMoonAroundPlanet = function(moonMesh, moonName, orbits, orbitOrder, planetName, scaleValue, speedValue, time) {
    var moonRotationSpeedAroundPlanet = [1.000, 0.802, 0.434, 0.323, 0.228, 0.128, 1.000, 0.802, 0.434, 0.323, 0.228, 0.128,
        1.000, 0.802, 0.434
    ];
    var rotationSpeed = this.calculateRotationSpeed(orbitOrder, speedValue, time, moonRotationSpeedAroundPlanet);
    var scale = scaleValue * 200;


    // scaleValue is used because of zooming in/out by rangeslider
    if (scale > 100) {
        this.positionMoonToOrbit(moonMesh, moonName, orbitOrder, planetName, scaleValue, rotationSpeed, 2);
    } else
    if (scale < 100) {
        this.positionMoonRangesliderZoomOut();
    } else {
        this.positionMoonToOrbit(moonMesh, moonName, orbitOrder, planetName, 1, rotationSpeed, 1);
    }
}

Moon.prototype.rotateAllMoons = function(scaleValue, speedValue, time) {
    var moonMesh;
    var moonNames = ["Moon", "Io", "Europa", "Ganymede", "Callisto", "Tethys", "Dione", "Rhea", "Titan",
        "Iapetus", "Ariel", "Umbriel", "Titania", "Oberon", "Triton"
    ];

    for (var i = 0; i < this.moonsMeshes.length; i++) {
        moonMesh = this.moonsMeshes[i];
        this.rotateMoonAroundPlanet(moonMesh, moonNames[i], this.orbits, i, this.moonsNamesOnScene[i], scaleValue, speedValue, time);
    }
}

Moon.prototype.positionMoonToOrbit = function(moonMesh, moonName, orbitOrder, moonNameOnScene, scaleValue, rotationSpeed, multiply) {
    this.traverseSceneToFindMoons(true, "");
    this.traverseSceneToFindMoons(true, "name");
    var orbitalSpeed = 0;

    var dataOfCurrentPlanetJSON = this.allMoonDataJSON[0];
    dataOfCurrentPlanetJSON.then(function(result) {
        orbitalSpeed = result[moonName]["orbitalSpeed"] / 15; // same in planets.js, too high speed 
        moonMesh.position.x = orbits[orbitOrder + 8].position.x + result[moonName]["c"] + multiply *
            result[moonName]["a"] * result[moonName]["scaleFactor"] * scaleValue * Math.cos(rotationSpeed * orbitalSpeed);
        moonMesh.position.z = orbits[orbitOrder + 8].position.z - multiply *
            result[moonName]["b"] * result[moonName]["scaleFactor"] * scaleValue * Math.sin(rotationSpeed * orbitalSpeed);

        if (moonNameOnScene != undefined && moonNameOnScene.visible == true) {
            moonNameOnScene.position.x = moonMesh.position.x + 1;
            moonNameOnScene.position.z = moonMesh.position.z;
        }
    });
}

Moon.prototype.positionMoonRangesliderZoomOut = function() {
    this.traverseSceneToFindMoons(false, "");
    this.traverseSceneToFindMoons(false, "name");
}

Moon.prototype.traverseSceneToFindMoons = function(showObjectsBoolean, name) {
    // Hide all moons, orbits and name (cannot remove from scene in scene.traverse)
    // Arg.: empty name for moons and orbits, "name" for TextGeometry
    this.scene.traverse(function(children) {
        if (children.name == name + "Moon" || children.name == name + "Io" || children.name == name + "Europa" ||
            children.name == name + "Ganymede" || children.name == name + "Callisto" || children.name == name + "Tethys" ||
            children.name == name + "Dione" || children.name == name + "Rhea" || children.name == name + "Titan" ||
            children.name == name + "Iapetus" || children.name == name + "Ariel" || children.name == name + "Umbriel" ||
            children.name == name + "Titania" || children.name == name + "Oberon" || children.name == name + "Triton") {
            children.visible = showObjectsBoolean;
        }
    });
}

// Scaling the Moon - according to zoom (functions inherited from class Planet)
// -------------------------------------------------------------------------
Moon.prototype.setScaleForMoons = function(scaleValue) {
    var scale = scaleValue * 200;
    if (scale > 100) {
        this.scaleMeshesRangesliderZoomIn(scaleValue, this.moonsMeshes);
    } else if (scale == 100) {
        this.scaleMeshesToOriginalSize(this.moonsMeshes);
    }
}