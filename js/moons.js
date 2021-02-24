class Moon extends Planet {
    constructor(scene, planetsMeshes, allPlanetDataJSON) {
        super();
        this.scene = scene;
        this.planetsMeshes = planetsMeshes;
        this.moonsObjects = [];
        this.moonsMeshes = [];
        this.moonsNamesOnScene = [];
        this.allPlanetDataJSON = allPlanetDataJSON;
    }

    createMoonForEarth = function() {
        // PRE VIAC MESIACOV = UPRAVIT DO FUNCKII, LEN DOCASNE ROZLOZENIE
        this.moon = this.createPlanetObject(0.124);
        this.moonsObjects.push(this.moon);

        this.moonMesh = this.createMesh(this.moonsObjects[0], '/images/textures/moonTexture2k.jpg');
        this.moonsMeshes.push(this.moonMesh);

        this.planetsMeshes[2].add(this.moonMesh); // Earth is parent of the Moon - for correct rotation
        this.scene.add(this.moonMesh);
    }

    initializeMoons = function() {
        this.createMoonForEarth(); //ODOBRAT PO PRIRADENI RODICOV, POVRCHOV A FUNKCIONALITY PRE OSTATNE MESIACE
        this.createMoons();
        this.addNamesToMoonObject(this.moonsMeshes, this.moonsNamesOnScene, this.scene);
    }

    getMoonsNamesOnScene = function() { return this.moonsNamesOnScene; }
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
    var material = new THREE.MeshBasicMaterial({ color: 0xBABABA });
    for (i = 0; i < Object.keys(moonSizeAndParent).length; i++) {
        property = Object.keys(moonSizeAndParent)[i];
        size = moonSizeAndParent[Object.keys(moonSizeAndParent)[i]][0];
        moon = this.createPlanetObject(size);
        this.moonsObjects.push(moon);

        moonMesh = new THREE.Mesh(this.moonsObjects[i], material);
        moonMesh.name = property;

        this.moonsMeshes.push(moonMesh);
        moonMesh.position.x = 10 + i * 2;
    }
    // RODIČ NENASTAVENÝ, RODIČOM OSTÁVA Scene
    //this.addParentToMoon(moonSizeAndParent, this.planetsMeshes, this.moonsMeshes);
    this.addMeshToScene(this.scene, this.moonsMeshes);
}

Moon.prototype.addParentToMoon = function(moonSizeAndParent, planetsMeshes, moonsMeshes) {
    var moonParent, moonName;
    for (i = 0, j = 0; i < 15;) {
        moonParent = moonSizeAndParent[Object.keys(moonSizeAndParent)[i]][1];
        moonName = Object.keys(moonSizeAndParent)[i];
        if (planetsMeshes[j].name == moonParent) {
            planetsMeshes[j].add(moonsMeshes[i]);
            i++;
        } else { j++; }
    }
}

Moon.prototype.addNamesToMoonObject = function(moonsMeshes, moonsNamesOnScene, scene) {
    var moonNames = ["Moon", "Moon", "Io", "Europa", "Ganymede", "Callisto", "Tethys", "Dione", "Rhea", "Titan",
        "Iapetus", "Ariel", "Umbriel", "Titania", "Oberon", "Triton"
    ];
    this.createTextGeometry(moonsMeshes, moonsNamesOnScene, scene, moonNames);
}


// Positions for the Moon - according to zoom
// -------------------------------------------------------------------------
Moon.prototype.rotateMoonAroundPlanet = function(scaleValue) {
    var scale = scaleValue * 200;
    // scaleValue is used because of zooming in/out by rangeslider
    if (scale > 100) {
        this.positionMoonRangesliderZoomIn(scaleValue, this.planetsMeshes, this.moonsMeshes[0]);
    } else if (scale < 100) {
        this.positionMoonRangesliderZoomOut();
    } else {
        this.positionMoonToOriginalPosition();
    }
}

// Positions for the Moon - according to scale from rangeslider
Moon.prototype.positionMoonRangesliderZoomIn = function(scaleValue, planetsMeshes, moonMesh) {
    this.moonMesh.visible = true;
    var dataOfCurrentPlanetJSON = this.allPlanetDataJSON[0];

    dataOfCurrentPlanetJSON.then(function(result) {
        moonMesh.position.x = planetsMeshes[2].position.x + result["Earth"]["a"] * scaleValue * 2;
        moonMesh.position.z = planetsMeshes[2].position.z + 1;
    });
}

Moon.prototype.positionMoonRangesliderZoomOut = function() {
    // Hidden Moon when model is too small
    this.moonMesh.visible = false;
}

Moon.prototype.positionMoonToOriginalPosition = function() {
    // Set original Moon position -> my value according to model
    this.moonMesh.visible = true;
    this.moonMesh.position.x = this.planetsMeshes[2].position.x + 1;
    this.moonMesh.position.z = this.planetsMeshes[2].position.z + 0.5;
}

// Scaling the Moon - according to zoom (functions ingerited from class Planet)
// -------------------------------------------------------------------------
Moon.prototype.setScaleForMoons = function(scaleValue) {
    var scale = scaleValue * 200;
    if (scale > 100) {
        this.scaleMeshesRangesliderZoomIn(scaleValue, this.moonsMeshes);
    } else if (scale == 100) {
        this.scaleMeshesToOriginalSize(this.moonsMeshes);
    }
}