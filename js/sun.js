class Sun extends InitPlanets {
    constructor(scene, pointLightScene, pointLightSun) {
        super();
        this.scene = scene;
        this.pointLightScene = pointLightScene;
        this.pointLightSun = pointLightSun;
        this.sunMesh = this.createSun();
    }

    getSunMesh() { return this.sunMesh }

    createSun() {
        var sun = this.createPlanetObject(3.5); // size
        var sunMesh = this.createMesh(sun, '/images/textures/sunTexture2k.jpg');
        sunMesh.name = "Sun";
        this.scene.add(sunMesh);

        sunMesh.add(this.pointLightScene);
        sunMesh.add(this.pointLightSun);

        return sunMesh;
    }

    setLightsToSunPosition() {
        this.pointLightScene.position.set(this.sunMesh.position.x, 0, this.sunMesh.position.z);
        this.pointLightSun.position.set(this.sunMesh.position.x, 10, this.sunMesh.position.z);
    }

    // Scaling the Sun (and light in the middle of the scene) - according to zoom
    // -------------------------------------------------------------------------
    setScaleForSun(scaleValue) {
        this.sunMesh.scale.set(2 * scaleValue, 2 * scaleValue, 2 * scaleValue);
    }
}