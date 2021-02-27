class Moon extends Planet {
    constructor(scene, planetsMeshes, allPlanetDataJSON) {
        super();
        this.scene = scene;
        this.planetsMeshes = planetsMeshes;
        this.moonsMeshes = [];
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
        //this.moonsObjects.push(moon);

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
Moon.prototype.rotateMoonAroundPlanet = function(moonMesh, moonName, planetsMeshes, planetOrder, planetName, scaleValue) {
    var scale = scaleValue * 200;
    // scaleValue is used because of zooming in/out by rangeslider
    if (scale > 100) {
        this.positionMoonRangesliderZoomIn();
    } else
    if (scale < 100) {
        this.positionMoonRangesliderZoomOut();
    } else {
        this.positionMoonToOriginalPosition(moonMesh, moonName, planetsMeshes, planetOrder, planetName, scaleValue);
    }
}

Moon.prototype.rotateAllMoons = function(scaleValue, speedValue, time) {
    var moonMesh;
    var planetOrder = [2, 4, 4, 4, 5, 5, 5, 5, 5, 6, 6, 6, 6, 7];
    var planetNamesOrder = ["Earth", "Jupiter", "Jupiter", "Jupiter", "Jupiter", "Saturn", "Saturn",
        "Saturn", "Saturn", "Saturn", "Uranus", "Uranus", "Uranus", "Uranus", "Neptune"
    ];

    for (var i = 0; i < this.moonsMeshes.length; i++) {
        moonMesh = this.moonsMeshes[i];
        this.rotateMoonAroundPlanet(moonMesh, this.moonsNamesOnScene[i], this.planetsMeshes,
            planetOrder[i], planetNamesOrder[i], scaleValue);
    }
}

Moon.prototype.positionMoonRangesliderZoomIn = function() {
    this.traverseSceneToFindMoons(true, "");
    this.traverseSceneToFindMoons(true, "name");

    // var dataOfCurrentPlanetJSON = this.allPlanetDataJSON[0];
    // dataOfCurrentPlanetJSON.then(function(result) {
    //     moonMesh.position.x = planetsMeshes[2].position.x + result["Earth"]["a"] * scaleValue * 2;
    //     moonMesh.position.z = planetsMeshes[2].position.z + 1;
    // });
}

Moon.prototype.positionMoonRangesliderZoomOut = function() {
    this.traverseSceneToFindMoons(false, "");
    this.traverseSceneToFindMoons(false, "name");
}

Moon.prototype.positionMoonToOriginalPosition = function(moonMesh, moonName, planetsMeshes, planetOrder, planetName, scaleValue) {
    this.traverseSceneToFindMoons(true, "");
    this.traverseSceneToFindMoons(true, "name");

    var dataOfCurrentPlanetJSON = this.allPlanetDataJSON[0];
    dataOfCurrentPlanetJSON.then(function(result) {
        moonMesh.position.x = planetsMeshes[planetOrder].position.x + result[planetName]["a"] * scaleValue * 2;
        moonMesh.position.z = planetsMeshes[planetOrder].position.z + 1;

        if (moonName != undefined && moonName.visible == true) {
            moonName.position.x = moonMesh.position.x + 1;
            moonName.position.z = moonMesh.position.z;
        }
    });
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