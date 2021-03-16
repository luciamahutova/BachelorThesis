class Sun extends Planet {
    constructor(scene, pointLight, pointLight2) {
        super();
        this.scene = scene;
        this.sunMesh;
        this.pointLight = pointLight;
        this.pointLight2 = pointLight2;
        this.createSun();
    }

    getSunMesh() { return this.sunMesh }

    createSun() {
        this.sun = this.createPlanetObject(3.5); // size
        this.sunMesh = this.createMesh(this.sun, '/images/textures/sunTexture2k.jpg');
        this.sunMesh.name = "Sun";
        this.scene.add(this.sunMesh);

        this.sunMesh.add(this.pointLight);
        this.sunMesh.add(this.pointLight2);
    }

    setLightsToSunPosition() {
        this.pointLight.position.set(this.sunMesh.position.x, 0, this.sunMesh.position.z);
        this.pointLight2.position.set(this.sunMesh.position.x, 10, this.sunMesh.position.z);
    }

    // Scaling the Sun (and light in the middle of the scene) - according to zoom
    // -------------------------------------------------------------------------
    setScaleForSun(scaleValue) {
        this.scaleSunRangeslider(scaleValue, this.sunMesh, this.spotLight);
    }

    scaleSunRangeslider(scaleValue, object, spotLight) {
        object.scale.set(2 * scaleValue, 2 * scaleValue, 2 * scaleValue);
        //spotLight.position.set(0, 10 + scaleValue * 2.3, 0);
    }
}