class Sun extends Planet {
    constructor(scene) {
        super();
        this.scene = scene;
        this.scaleValueScene = 0;
    }

    createSun = function() {
        this.sun = this.createPlanetObject(4);
        this.sunMesh = this.createMesh(this.sun, '/images/textures/sunTexture2k.jpg');
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
    object.scale.set(1.5 * scaleValue, 1.5 * scaleValue, 1.5 * scaleValue);
}

Sun.prototype.scaleMeshesRangesliderNegativeValue = function(scaleValue, objects) {
    object.scale.set(0.5 / (-1 * scaleValue), 0.5 / (-1 * scaleValue), 0.5 / (-1 * scaleValue));
}