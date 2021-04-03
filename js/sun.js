class Sun extends InitPlanets {
    constructor(scene, pointLightScene, pointLightSun) {
        super();
        this.scene = scene;
        this.pointLightScene = pointLightScene;
        this.pointLightSun = pointLightSun;
        this.sunMesh = this.createSun();
    }

    // Get()
    getSunMesh() { return this.sunMesh }
    getScene() { return this.scene }
    getPointLightScene() { return this.pointLightScene }
    getPointLightSun() { return this.pointLightSun }

    //Create mesh and set lights
    // -------------------------------------------------------------------------
    createSun() {
        var sun = this.createPlanetObject(3.5); // size
        var sunMesh = this.createMesh(sun, '/images/textures/sunTexture2k.jpg');
        sunMesh.name = "Sun";
        (this.getScene()).add(sunMesh);

        sunMesh.add(this.getPointLightScene());
        sunMesh.add(this.getPointLightSun());

        return sunMesh;
    }

    setLightsToSunPosition() {
        (this.getPointLightScene()).position.set((this.getSunMesh()).position.x, 0, (this.getSunMesh()).position.z);
        (this.getPointLightSun()).position.set((this.getSunMesh()).position.x, 10, (this.getSunMesh()).position.z);
    }
}