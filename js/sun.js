class Sun extends Planet {
    constructor(scene) {
        super();
        this.scene = scene;
    }

    createSun() {
        this.sun = this.createPlanetObject(3.5); // size
        this.sunMesh = this.createMesh(this.sun, '/images/textures/sunTexture2k.jpg');
        this.sunMesh.name = "Sun";
        this.scene.add(this.sunMesh);
    }

    // Scaling the Sun - according to zoom
    // -------------------------------------------------------------------------
    setScaleForSun(scaleValue) {
        if (scaleValue > 0) {
            this.scaleMeshesRangesliderPositiveValue(scaleValue, this.sunMesh);
        } else if (scaleValue < 0) {
            scaleValue *= -1;
            this.scaleMeshesRangesliderNegativeValue(scaleValue, this.sunMesh);
        } else {
            this.scaleMeshesToOriginalSize(this.sunMesh);
        }
    }

    scaleMeshesRangesliderPositiveValue(scaleValue, object) {
        // object.scale.set(1.5 * scaleValue, 1.5 * scaleValue, 1.5 * scaleValue);
        object.scale.set(2 * scaleValue, 2 * scaleValue, 2 * scaleValue);
    }

    scaleMeshesRangesliderNegativeValue(scaleValue, object) {
        object.scale.set(0.5 / (-1 * scaleValue), 0.5 / (-1 * scaleValue), 0.5 / (-1 * scaleValue));
    }

    scaleMeshesToOriginalSize(object) {
        object.scale.set(1, 1, 1);
    }

    // Initialize the Sun 
    // -------------------------------------------------------------------------
    initializeSun() {
        this.createSun();
        this.setScaleForSun();
    }
}