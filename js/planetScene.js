class PlanetScene extends InitScene {
    constructor() {
        super()
        this.scene = new THREE.Scene();
        this.camera = this.initCamera(this.getWidthOfScene(), this.getHeightOfScene());
        this.renderer = this.initRenderer(this.getWidthOfScene(), this.getHeightOfScene(), true);
        this.pointLight = this.setPointLightOnScene();

        this.createScene();
        this.createAllPlanets();
        this.setOrbitConstrols();
    }

    createScene() {
        var interactiveScene = document.querySelector('#interativeModelScene');
        this.pointLight.position.set(0, 10, 0);
        this.scene.add(this.pointLight);
        this.camera.position.set(0, 5, 0);

        interactiveScene.appendChild(this.renderer.domElement);
        this.renderer.setClearColor(0xffffff, 10);
        this.renderer.setClearColor(0x000000, 0);
    }

    setOrbitConstrols() {
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.target.set(0, 0, 0);
        this.controls.update();
        this.controls.addEventListener('change', render);
    }

    createPlanetMesh(imageSrc) {
        var object = new THREE.SphereBufferGeometry(3, 50, 50);
        var texture = new THREE.TextureLoader().load(imageSrc);
        var meshMaterial = new THREE.MeshPhongMaterial({ map: texture });
        this.planetMesh = new THREE.Mesh(object, meshMaterial);

        this.planetMesh.position.set(0, 0, 0);
        this.planetMesh.rotation.x = THREE.Math.degToRad(-45);
        this.scene.add(this.planetMesh);
    }

    createAllPlanets() {
        this.createPlanetMesh('/images/textures/mercuryTexture2k.jpg');
        this.createPlanetMesh('/images/textures/venusTexture2k.jpg');
        this.createPlanetMesh('/images/textures/earthTexture2k.jpg');
        this.createPlanetMesh('/images/textures/marsTexture2k.jpg');
        this.createPlanetMesh('/images/textures/jupiterTexture2k.jpg');
        this.createPlanetMesh('/images/textures/saturnTexture2k.jpg');
        this.createPlanetMesh('/images/textures/uranusTexture2k.jpg');
        this.createPlanetMesh('/images/textures/neptuneTexture2k.jpg');
    }

    getWidthOfScene() { return document.querySelector('#interativeModelScene').offsetWidth; }
    getHeightOfScene() { return document.querySelector('#interativeModelScene').offsetHeight; }

    render() {
        this.renderer.render(this.scene, this.camera);
    }

    animate() {
        this.controls.autoRotate = true;
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }
}

this.interactiveModel = new PlanetScene();

function animate() {
    this.interactiveModel.animate();
    animationFrameOutput = requestAnimationFrame(animate);
}
animate();