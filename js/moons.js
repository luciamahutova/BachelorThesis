class Moon extends Planet {
    constructor(scene, planetsMeshes) {
        super();
        this.scene = scene;
        this.planetsMeshes = planetsMeshes;
        this.moonsObjects = [];
        this.moonsMeshes = [];
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
        this.createMoonForEarth();
    }
}


// Positions for the Moon - according to zoom
// -------------------------------------------------------------------------
Moon.prototype.rotateMoonAroundPlanet = function(scaleValue) {
    var scale = scaleValue * 200;
    // scaleValue is used because of zooming in/out by rangeslider
    if (scale > 100) {
        this.positionMoonRangesliderZoomIn(scaleValue, this.planetsMeshes);
    } else if (scale < 100) {
        this.positionMoonRangesliderZoomOut();
    } else {
        this.positionMoonToOriginalPosition();
    }
}

// Positions for the Moon - according to scale from rangeslider
Moon.prototype.positionMoonRangesliderZoomIn = function(scaleValue, planetsMeshes) {
    this.moonMesh.visible = true;
    var dataOfCurrentPlanetJSON = this.allDataJSON[2];

    dataOfCurrentPlanetJSON.then(function(result) {
        this.moonMesh.position.x = planetsMeshes[2].position.x + result["a"] * scaleValue * 2;
        this.moonMesh.position.z = planetsMeshes[2].position.z + 1;
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