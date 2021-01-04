class Moon extends Planet {
    constructor(scene, planetsMeshes) {
        super();
        this.scene = scene;
        this.planetsMeshes = planetsMeshes;
        this.moonsObjects = [];
        this.moonsMeshes = [];

        this.scaleValueScene = 0;
    }

    createMoonForEarth = function() {
        // UPRAVIT DO FUNCKII, LEN POKUS O ZOBRAZENIE = FUNGUJE
        this.moon = this.createPlanetObject(0.124);
        this.moonsObjects.push(this.moon);

        this.moonMesh = this.createMesh(this.moonsObjects[0], '/images/textures/moonTexture2k.jpg');
        this.moonsMeshes.push(this.moonMesh);

        this.planetsMeshes[3].add(this.moonMesh); // Earth is parent of the Moon - for correct rotation
        this.scene.add(this.moonMesh);
    }

    initializeMoons = function() {
        this.createMoonForEarth();
        this.zoomRangeslider();
    }
}


// Positions for the Moon - according to zoom
// -------------------------------------------------------------------------
Moon.prototype.rotateMoonAroundPlanet = function(scaleValue) {
    // scaleValue is used because of zooming in/out by rangeslider
    if (scaleValue > 0) {
        this.positionMoonOnRangesliderPositiveValue(scaleValue);
    } else if (scaleValue < 0) {
        this.positionMoonOnRangesliderNegativeValue();
    } else {
        this.positionMoonToOriginalPosition();
    }
}

// Positions for the Moon - according to scale from rangeslider
Moon.prototype.positionMoonOnRangesliderPositiveValue = function(scaleValue) {
    this.moonMesh.visible = true;
    this.moonMesh.position.x = this.planetsMeshes[3].position.x + 1.0027 * scaleValue * 2;
    // this.planetData[2]["a"] = 1.0027 ... for Earth
    this.moonMesh.position.z = this.planetsMeshes[3].position.z + 1;
}

Moon.prototype.positionMoonOnRangesliderNegativeValue = function() {
    // Hidden Moon when model is too small
    this.moonMesh.visible = false;
}

Moon.prototype.positionMoonToOriginalPosition = function() {
    // Set original Moon position -> my value according to model
    this.moonMesh.visible = true;
    this.moonMesh.position.x = this.planetsMeshes[3].position.x + 1;
    this.moonMesh.position.z = this.planetsMeshes[3].position.z + 0.5;
}

// Scaling the Moon - according to zoom
// -------------------------------------------------------------------------
Moon.prototype.setScaleForMoons = function(scaleValue) {
    if (scaleValue > 0) {
        this.scaleMeshesRangesliderPositiveValue(scaleValue, this.moonsMeshes);
    } else if (scaleValue == 0) {
        this.scaleMeshesToOriginalSize(this.moonsMeshes);
    }
}

Moon.prototype.scaleMeshesRangesliderPositiveValue = function(scaleValue, objects) {
    for (var i = 1; i < objects.length; i++) {
        objects[i].scale.set(2 * scaleValue, 2 * scaleValue, 2 * scaleValue);
    }
}

// LEN POMOCKA - SCALE PRE ZVACSENIE MESIACOV - ZMAZAT
// Zooming in/out (for moons) + movement of the scene
// -------------------------------------------------------------------------
Moon.prototype.zoomRangeslider = function() {
    var slider = document.getElementById("rangesliderZoomInput");
    var sliderValue = document.getElementById("rangesliderZoomValue");

    var updateZoomValue = () => {
        sliderValue.innerHTML = slider.value;
        for (var i = 0; i < this.moonsMeshes.length; i++) {
            this.scaleValueScene = sliderValue.innerHTML;
        }
        this.setScaleForMoons(this.scaleValueScene);
    }
    slider.addEventListener('input', updateZoomValue);
    updateZoomValue();
}