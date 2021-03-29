import { OrbitControls } from "https://threejs.org/examples/jsm/controls/OrbitControls.js";
class PlanetScene extends InitScene {
    constructor() {
        super()
        this.scene = new THREE.Scene();
        this.camera = this.initCamera(this.getWidthOfScene(), this.getHeightOfScene());
        this.renderer = this.initRenderer(this.getWidthOfScene(), this.getHeightOfScene(), true);
        this.controls = this.setOrbitConstrols(this.camera, this.renderer);

        this.ambientLight = new THREE.AmbientLight(0x404040, 5);
        this.planetMeshes = [];
        this.planetNames = ["mercury", "venus", "earth", "mars", "jupiter", "saturn", "uranus", "neptune"];
        this.pageName = this.getHtmlPageName();

        this.initInteractivePlanetScene(this.scene, this.renderer, this.camera, this.ambientLight);
        this.showInteractivePlanet(this.pageName)
    }

    // Get()
    getWidthOfScene() { return document.querySelector('#interativeModelScene').offsetWidth }
    getHeightOfScene() { return document.querySelector('#interativeModelScene').offsetHeight }
    getHtmlPageName() { return window.location.pathname.split("/").pop() }
    getPlanetMeshes() { return this.planetMeshes }
    getScene() { return this.scene }
    getCamera() { return this.camera }
    getRenderer() { return this.renderer }
    getPlanetNames() { return this.planetNames }
    getControls() { return this.controls }

    // Settings for scene and planets
    // -------------------------------------------------------------------------
    initInteractivePlanetScene(scene, renderer, camera, ambientLight) {
        var interactiveScene = document.querySelector('#interativeModelScene');
        interactiveScene.appendChild(this.renderer.domElement);
        renderer.setClearColor(0x000000, 0);

        camera.position.set(0, 5, 0);
        scene.add(ambientLight);
        this.createAllPlanets();
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

    createPlanetMesh(imageSrc) {
        var object = new THREE.SphereBufferGeometry(3, 50, 50);
        var texture = new THREE.TextureLoader().load(imageSrc);
        var meshMaterial = new THREE.MeshPhongMaterial({ map: texture });
        var planetMesh = new THREE.Mesh(object, meshMaterial);

        planetMesh.position.set(0, 0, 0);
        planetMesh.rotation.x = THREE.Math.degToRad(-45);
        (this.getPlanetMeshes()).push(planetMesh);
        (this.getScene()).add(planetMesh);
    }

    // Orbits controls
    // -------------------------------------------------------------------------
    setOrbitConstrols(camera, renderer) {
        var controls = new OrbitControls(camera, renderer.domElement);
        controls.target.set(0, 0, 0);
        controls.update();
        controls.enableZoom = false;
        return controls;
    }

    showInteractivePlanet(pagename) {
        for (var i = 0; i < (this.getPlanetMeshes()).length; i++) {
            (this.getScene()).remove((this.getPlanetMeshes())[i]);
        }

        for (var i = 0; i < (this.getPlanetNames()).length; i++) {
            if (pagename.startsWith((this.getPlanetNames())[i])) {
                (this.getScene()).add((this.getPlanetMeshes())[i]);
                break;
            }
        }
    }

    // Animate - controls and renderer
    // -------------------------------------------------------------------------
    animate() {
        (this.getControls()).autoRotate = true;
        (this.getControls()).update();
        (this.getRenderer()).render(this.getScene(), this.getCamera());
    }
}

// Initialize interactive planet 
var planetScene = new PlanetScene();

function animatePlanet() {
    planetScene.animate();
    requestAnimationFrame(animatePlanet);
}
animatePlanet();