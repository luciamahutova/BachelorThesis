class Moon extends Planet {
    constructor(scene, planetsMeshes, allPlanetDataJSON) {
        super();
        this.scene = scene;
        this.planetsMeshes = planetsMeshes;
        this.moonsObjects = [];
        this.moonsMeshes = [];
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
    }
}

Moon.prototype.createMoons = function() {
    var moonSizeAndParent = {
        "earthMoon": 0.2727,
        "marsPhobos": 0.3, // 11.267km
        "marsDeimos": 0.3, // 6.2 ± 0.18km
        "jupiterIo": 0.2859,
        "jupiterEuropa": 0.2450,
        "jupiterGanymede": 0.4135,
        "jupiterCallisto": 0.3783,
        "saturnMimas": 0.3, // 198.2 ± 0.4km
        "saturnEnceladus": 0.3, // 252.1 ± 0.2km
        "saturnTethys": 0.0834, // SMALL
        "saturnDione": 0.0881, // SMALL
        "saturnRhea": 0.1199,
        "saturnTitan": 0.4037,
        "saturnIapetus": 0.1153,
        "uranusMiranda": 0.3, // 235.8 ± 0.7km
        "uranusAriel": 0.0909, // SMALL
        "uranusUmbriel": 0.0918, // SMALL
        "uranusTitania": 0.1237,
        "uranusOberon": 0.1195,
        "neptuneTriton": 0.2124
    };

    var moon, moonMesh, property;
    var material = new THREE.MeshBasicMaterial({ color: 0xBABABA });
    for (i = 0; i < Object.keys(moonSizeAndParent).length; i++) {
        property = Object.keys(moonSizeAndParent)[i];
        moon = this.createPlanetObject(moonSizeAndParent[property]);
        this.moonsObjects.push(moon);

        moonMesh = new THREE.Mesh(this.moonsObjects[i], material);
        moonMesh.name = property;
        this.moonsMeshes.push(moonMesh);
        moonMesh.position.x = 10 + i * 3;
    }
    this.addMeshToScene(this.scene, this.moonsMeshes);
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