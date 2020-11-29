class Planet {
    constructor(scene) {
        this.scene = scene;
    }

    createPlanets = function() {
        // 10x smaller scale for the Sun
        this.sun = new THREE.SphereBufferGeometry(5, 50, 50);
        this.mercury = new THREE.SphereBufferGeometry(0.175, 50, 50);
        this.venus = new THREE.SphereBufferGeometry(0.435, 50, 50);
        this.earth = new THREE.SphereBufferGeometry(0.457, 50, 50);
        this.moon = new THREE.SphereBufferGeometry(0.124, 50, 50);
        this.mars = new THREE.SphereBufferGeometry(0.243, 50, 50);

        // 3x smaller scale (4 planets)
        this.jupiter = new THREE.SphereBufferGeometry(1.673, 50, 50);
        this.saturn = new THREE.SphereBufferGeometry(1.394, 50, 50);
        this.uranus = new THREE.SphereBufferGeometry(0.607, 50, 50);
        this.neptune = new THREE.SphereBufferGeometry(0.589, 50, 50);
    }

    setNewMesh = function(imageSrc) {
        let texture = new THREE.TextureLoader().load(imageSrc);
        this.meshMaterial = new THREE.MeshPhongMaterial({ map: texture });
        this.meshMaterial.receiveShadow = true;
        this.meshMaterial.castShadow = true;
        return this.meshMaterial;
    }

    createPlanetsMesh = function() {
        this.sunMesh = new THREE.Mesh(this.sun, this.setNewMesh('/images/textures/sunTexture2k.jpg'));
        this.mercuryMesh = new THREE.Mesh(this.mercury, this.setNewMesh('/images/textures/mercuryTexture2k.jpg'));
        this.venusMesh = new THREE.Mesh(this.venus, this.setNewMesh('/images/textures/venusTexture2k.jpg'));
        this.earthMesh = new THREE.Mesh(this.earth, this.setNewMesh('/images/textures/earthTexture2k.jpg'));
        this.moonMesh = new THREE.Mesh(this.moon, this.setNewMesh('/images/textures/moonTexture2k.jpg'));
        this.marsMesh = new THREE.Mesh(this.mars, this.setNewMesh('/images/textures/marsTexture2k.jpg'));
        this.jupiterMesh = new THREE.Mesh(this.jupiter, this.setNewMesh('/images/textures/jupiterTexture2k.jpg'));
        this.saturnMesh = new THREE.Mesh(this.saturn, this.setNewMesh('/images/textures/saturnTexture2k.jpg'));
        this.uranusMesh = new THREE.Mesh(this.uranus, this.setNewMesh('/images/textures/uranusTexture2k.jpg'));
        this.neptuneMesh = new THREE.Mesh(this.neptune, this.setNewMesh('/images/textures/neptuneTexture2k.jpg'));
        // scene.add(sunMesh, moonMesh, mercuryMesh, venusMesh, earthMesh, marsMesh, jupiterMesh, saturnMesh, uranusMesh, neptuneMesh);
        return [this.sunMesh, this.moonMesh, this.mercuryMesh, this.venusMesh, this.earthMesh, this.marsMesh,
            this.jupiterMesh, this.saturnMesh, this.uranusMesh, this.neptuneMesh
        ];
    }

    addMeshToScene = function(planetsMesh) {
        for (var i = 0; i < planetsMesh.length; i++) {
            this.scene.add(planetsMesh[i]);
        }
    }

    setPlanetsRotationAngle = function() {
        // Planets' angle around its axis = Z
        this.mercuryMesh.setRotationFromAxisAngle(new THREE.Vector3(0, 0, 1), (0.03 * Math.PI) / 180);
        this.venusMesh.setRotationFromAxisAngle(new THREE.Vector3(0, 0, 1), (177.4 * Math.PI) / 180);
        this.earthMesh.setRotationFromAxisAngle(new THREE.Vector3(0, 0, 1), (23.4 * Math.PI) / 180);
        this.marsMesh.setRotationFromAxisAngle(new THREE.Vector3(0, 0, 1), (25.2 * Math.PI) / 180);
        this.jupiterMesh.setRotationFromAxisAngle(new THREE.Vector3(0, 0, 1), (3.1 * Math.PI) / 180);
        this.saturnMesh.setRotationFromAxisAngle(new THREE.Vector3(0, 0, 1), (26.7 * Math.PI) / 180);
        this.uranusMesh.setRotationFromAxisAngle(new THREE.Vector3(0, 0, 1), (97.8 * Math.PI) / 180);
        this.neptuneMesh.setRotationFromAxisAngle(new THREE.Vector3(0, 0, 1), (28.3 * Math.PI) / 180);
    }

    setMoonDistanceFromEarth = function() {
        // Not proper value = set according to model
        this.moonMesh.position.x = 1;
    }

    // Position for every planet's orbit from the Sun
    setPlanetsDistanceFromSun = function(values) {
        // Changed scale for better view
        this.mercuryMesh.position.x = values[0] / 300;
        this.venusMesh.position.x = values[1] / 300;
        this.earthMesh.position.x = values[2] / 300;
        this.marsMesh.position.x = values[3] / 400;
        this.jupiterMesh.position.x = values[4] / 1000;
        this.saturnMesh.position.x = values[5] / 1500;
        this.uranusMesh.position.x = values[6] / 2500;
        this.neptuneMesh.position.x = values[7] / 3500;
        this.setMoonDistanceFromEarth();
    }

    //Empty objects will control planets' movement around the Sun
    createEmptyObjects = function() {
        this.emptyObjectRotateMercury = new THREE.Object3D();
        this.emptyObjectRotateMercury.add(this.mercuryMesh);

        this.emptyObjectRotateVenus = new THREE.Object3D();
        this.emptyObjectRotateVenus.add(this.venusMesh);

        this.emptyObjectRotateEarth = new THREE.Object3D();
        this.emptyObjectRotateEarth.add(this.earthMesh);

        this.emptyObjectRotateMoon = new THREE.Object3D();
        this.earthMesh.add(this.emptyObjectRotateMoon);
        this.emptyObjectRotateMoon.add(this.moonMesh);

        this.emptyObjectRotateMars = new THREE.Object3D();
        this.emptyObjectRotateMars.add(this.marsMesh);

        this.emptyObjectRotateJupiter = new THREE.Object3D();
        this.emptyObjectRotateJupiter.add(this.jupiterMesh);

        this.emptyObjectRotateSaturn = new THREE.Object3D();
        this.emptyObjectRotateSaturn.add(this.saturnMesh);

        this.emptyObjectRotateUranus = new THREE.Object3D();
        this.emptyObjectRotateUranus.add(this.uranusMesh);

        this.emptyObjectRotateNeptune = new THREE.Object3D();
        this.emptyObjectRotateNeptune.add(this.neptuneMesh);

        this.addEmptyToSun();
    }

    // For rotating planets around the Sun
    addEmptyToSun = function() {
        var emptyObjectsArray = [this.emptyObjectRotateMercury, this.emptyObjectRotateVenus, this.emptyObjectRotateEarth, this.emptyObjectRotateMars, this.emptyObjectRotateJupiter, this.emptyObjectRotateSaturn,
            this.emptyObjectRotateUranus, this.emptyObjectRotateNeptune
        ];

        for (var i = 0; i < emptyObjectsArray.length; i++) {
            this.sunMesh.add(emptyObjectsArray[i]);
        }
    }

    setMoonRotationAroundEarth = function() {
        // Not proper value, needs to change
        this.emptyObjectRotateMoon.rotation.y += 0.001;
    }

    setPlanetsRotationSpeedAroundSun = function(values) {
        this.emptyObjectRotateMercury.rotation.y += values[0] / 100;
        this.emptyObjectRotateVenus.rotation.y += values[1] / 100;
        this.emptyObjectRotateEarth.rotation.y += values[2] / 100;
        this.emptyObjectRotateMars.rotation.y += values[3] / 100;
        this.emptyObjectRotateJupiter.rotation.y += values[4] / 100;
        this.emptyObjectRotateSaturn.rotation.y += values[5] / 100;
        this.emptyObjectRotateUranus.rotation.y += values[6] / 100;
        this.emptyObjectRotateNeptune.rotation.y += values[7] / 100;
        this.setMoonRotationAroundEarth();
    }

}