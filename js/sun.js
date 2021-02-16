class Sun extends Planet {
    constructor(scene) {
        super();
        this.scene = scene;
    }

    createSun = function() {
        this.sun = this.createPlanetObject(4); // size
        this.sunMesh = this.createMesh(this.sun, '/images/textures/sunTexture2k.jpg');
        this.sunMesh.name = "Sun";
        this.scene.add(this.sunMesh);
    }

    initializeSun = function() {
        this.createSun();
        this.setScaleForSun();
    }
}

// Scaling the Sun - according to zoom
// -------------------------------------------------------------------------
Sun.prototype.setScaleForSun = function(scaleValue) {
    if (scaleValue > 0) {
        this.scaleMeshesRangesliderPositiveValue(scaleValue, this.sunMesh);
    } else if (scaleValue < 0) {
        scaleValue *= -1;
        this.scaleMeshesRangesliderNegativeValue(scaleValue, this.sunMesh);
    } else {
        this.scaleMeshesToOriginalSize(this.sunMesh);
    }
}

Sun.prototype.scaleMeshesRangesliderPositiveValue = function(scaleValue, object) {
    // object.scale.set(1.5 * scaleValue, 1.5 * scaleValue, 1.5 * scaleValue);
    object.scale.set(2 * scaleValue, 2 * scaleValue, 2 * scaleValue);
}

Sun.prototype.scaleMeshesRangesliderNegativeValue = function(scaleValue, object) {
    object.scale.set(0.5 / (-1 * scaleValue), 0.5 / (-1 * scaleValue), 0.5 / (-1 * scaleValue));
}

Sun.prototype.scaleMeshesToOriginalSize = function(object) {
    object.scale.set(1, 1, 1);
}