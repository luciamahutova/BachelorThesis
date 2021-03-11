class Sun extends Planet {
    constructor(scene, spotLight) {
        super();
        this.scene = scene;
        this.spotLight = spotLight;
        this.initializeSun();
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
        this.scaleSunRangeslider(scaleValue, this.sunMesh, this.spotLight);
    }

    scaleSunRangeslider(scaleValue, object, spotLight) {
        object.scale.set(2 * scaleValue, 2 * scaleValue, 2 * scaleValue);
        spotLight.position.set(0, 10 + scaleValue * 2.3, 0);
    }

    // Initialize the Sun 
    // -------------------------------------------------------------------------
    initializeSun() {
        this.createSun();
        this.setScaleForSun();
    }
}