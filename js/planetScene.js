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
    getWidthOfScene() { return document.querySelector('.interactivePlanetScene').offsetWidth }
    getHeightOfScene() { return document.querySelector('.interactivePlanetScene').offsetHeight }
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
        var interactiveScene = document.querySelector('.interactivePlanetScene');
        interactiveScene.appendChild(this.renderer.domElement);
        renderer.setClearColor(0xffffff, 0);

        camera.position.set(3, 1.5, 3);
        scene.background = new THREE.Color(0xff0000);
        scene.add(ambientLight);
        this.createAllPlanets();
    }

    createAllPlanets() {
        this.createPlanetMesh('/images/textures/mercuryTexture2k.jpg'); // Mercury
        this.createPlanetMesh('/images/textures/venusTexture2k.jpg'); // Venus
        this.createPlanetMesh('/images/textures/earthTexture2k.jpg'); // Earth
        this.createPlanetMesh('/images/textures/marsTexture2k.jpg'); // Mars
        this.createPlanetMesh('/images/textures/jupiterTexture2k.jpg'); // Jupiter
        this.createPlanetMesh('/images/textures/saturnTexture2k.jpg'); // Saturn
        this.createPlanetMesh('/images/textures/uranusTexture2k.jpg'); // Uranus
        this.createPlanetMesh('/images/textures/neptuneTexture2k.jpg'); // Neptune
    }

    createPlanetMesh(imageSrc) {
        var object = new THREE.SphereBufferGeometry(3, 100, 100);
        var texture = new THREE.TextureLoader().load(imageSrc);
        var meshMaterial = new THREE.MeshPhongMaterial({ map: texture });
        var planetMesh = new THREE.Mesh(object, meshMaterial);

        planetMesh.position.set(0, 0, 0);
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
        controls.maxPolarAngle = Math.PI / 6;
        controls.minPolarAngle = Math.PI / 6;
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