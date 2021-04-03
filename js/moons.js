class Moon extends InitPlanets {
    constructor(scene, orbits) {
        super();
        this.scene = scene;
        this.orbits = orbits;
        this.moonMeshes = [];
        this.moonNamesOnScene = [];
        this.translatedMoonName = [];
        this.initializeMoons();
    }

    // Get()
    getMoonsNamesOnScene() { return this.moonNamesOnScene }
    getMoonMeshes() { return this.moonMeshes }
    getScene() { return this.scene }
    getOrbits() { return this.orbits }
    getTranslatedMoonName() { return this.translatedMoonName }


    // Create moon objects
    // -------------------------------------------------------------------------
    createMoons() {
        var moonSizeAndParent = {
            "Moon": [0.2727, "Earth"],
            "Io": [0.2859, "Jupiter"],
            "Europa": [0.2450, "Jupiter"],
            "Ganymede": [0.4135, "Jupiter"],
            "Callisto": [0.3783, "Jupiter"],
            "Rhea": [0.1199, "Saturn"],
            "Titan": [0.4037, "Saturn"],
            "Ariel": [0.0909, "Uranus"],
            "Umbriel": [0.0918, "Uranus"],
            "Titania": [0.1237, "Uranus"],
            "Oberon": [0.1195, "Uranus"],
            "Triton": [0.2124, "Neptune"]
        };

        var moon, moonMesh, property, size;
        var material;
        for (i = 0; i < Object.keys(moonSizeAndParent).length; i++) {
            material = new THREE.MeshPhongMaterial({ color: 0xBABABA });
            property = Object.keys(moonSizeAndParent)[i];
            size = moonSizeAndParent[Object.keys(moonSizeAndParent)[i]][0];
            moon = this.createPlanetObject(size);

            moonMesh = new THREE.Mesh(moon, material);
            moonMesh.name = property;
            (this.getMoonMeshes()).push(moonMesh);
        }
        this.addMeshToScene(this.getScene(), this.getMoonMeshes());
    }

    // Positions for moons - according to zoom
    // -------------------------------------------------------------------------
    rotateAllMoons(time) {
        this.setVisibilityOfTranslatedMoonName();

        for (var i = 0; i < (this.getMoonMeshes()).length; i++) {
            this.positionMoonToOrbit((this.getMoonMeshes())[i], (this.getMoonNames())[i], this.getOrbits(), i,
                (this.getMoonsNamesOnScene())[i], this.getTranslatedMoonName(), time);
        }
    }

    positionMoonToOrbit(moonMesh, moonNameJSON, orbits, orbitOrder, moonNameOnScene, translatedMoonNames, time) {
        var orbitalSpeed = 0;
        var dataOfCurrentMoonJSON = (this.getMoonDataJSON())[0];

        dataOfCurrentMoonJSON.then(function(result) {
            orbitalSpeed = result[moonNameJSON]["orbitalSpeed"] / 5; // speed is too high
            moonMesh.position.x = orbits[orbitOrder + 8].position.x + result[moonNameJSON]["a"] *
                result[moonNameJSON]["scaleFactor"] * Math.cos(orbitalSpeed * 0.0001 * time);
            moonMesh.position.z = orbits[orbitOrder + 8].position.z - 1 * result[moonNameJSON]["b"] *
                result[moonNameJSON]["scaleFactor"] * Math.sin(orbitalSpeed * 0.0001 * time);

            if (moonNameOnScene != undefined) {
                moonNameOnScene.position.x = moonMesh.position.x + 1;
                moonNameOnScene.position.z = moonMesh.position.z;

                if (moonNameJSON == "Moon") {
                    translatedMoonNames[0].position.x = moonMesh.position.x + 1;
                    translatedMoonNames[1].position.x = moonMesh.position.x + 1;
                    translatedMoonNames[0].position.z = moonMesh.position.z;
                    translatedMoonNames[1].position.z = moonMesh.position.z;
                }
            }
        });
    }

    // Traverse scene + set visibility of one translated name for Moon
    // -------------------------------------------------------------------------
    setVisibilityOfTranslatedMoonName() {
        this.traverseSceneToFindPlanetNames(false, "nameMoon", this.getScene());
        this.traverseSceneToFindPlanetNames(false, "nameMesic", this.getScene());
        this.traverseSceneToFindPlanetNames(false, "nameMesiac", this.getScene());

        if (document.getElementById("en").style.fontWeight == "bold") {
            this.traverseSceneToFindPlanetNames(true, "nameMoon", this.getScene());
        } else if (document.getElementById("cz").style.fontWeight == "bold") {
            this.traverseSceneToFindPlanetNames(true, "nameMesic", this.getScene());
        } else if (document.getElementById("sk").style.fontWeight == "bold") {
            this.traverseSceneToFindPlanetNames(true, "nameMesiac", this.getScene());
        }
    }

    // Initialize 
    // -------------------------------------------------------------------------
    initializeMoons() {
        this.createMoons();
        this.createTextGeometry(this.getMoonMeshes(), this.getMoonsNamesOnScene(), this.getScene(), this.getMoonNames(), 0.9, "name");
        this.createTextGeometry([this.moonMeshes[0], this.moonMeshes[0]], this.getTranslatedMoonName(),
            this.getScene(), ["Mesic", "Mesiac"], 0.9, "name");
    }
}