import { OrbitControls } from "https://threejs.org/examples/jsm/controls/OrbitControls.js";
class PlanetScene extends InitScene {
    constructor() {
        super()
        this.scene = new THREE.Scene();
        this.camera = this.initCamera(this.getWidthOfScene(), this.getHeightOfScene());
        this.renderer = this.initRenderer(this.getWidthOfScene(), this.getHeightOfScene(), true);
        this.controls = this.setOrbitConstrols();

        this.ambientLight = new THREE.AmbientLight(0x404040, 5);
        this.planetMeshes = [];
        this.planetNames = ["mercury", "venus", "earth", "mars", "jupiter", "saturn", "uranus", "neptune"];
        this.pageName = this.getHtmlPageName();

        this.initInteractivePlanetScene();
        this.showInteractivePlanet(this.pageName)
    }

    getWidthOfScene() { return document.querySelector('#interativeModelScene').offsetWidth; }
    getHeightOfScene() { return document.querySelector('#interativeModelScene').offsetHeight; }
    getHtmlPageName() { return window.location.pathname.split("/").pop(); }

    // Settings for scene and planets
    // -------------------------------------------------------------------------
    initInteractivePlanetScene() {
        var interactiveScene = document.querySelector('#interativeModelScene');
        interactiveScene.appendChild(this.renderer.domElement);
        this.renderer.setClearColor(0x000000, 0);

        this.camera.position.set(0, 5, 0);
        this.scene.add(this.ambientLight);

        this.createAllPlanets();
        this.setOrbitConstrols();
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
        this.planetMeshes.push(planetMesh);
        this.scene.add(planetMesh);
    }

    // Orbits controls
    // -------------------------------------------------------------------------
    setOrbitConstrols() {
        var controls = new OrbitControls(this.camera, this.renderer.domElement);
        controls.target.set(0, 0, 0);
        controls.update();
        controls.enableZoom = false;
        return controls;
    }

    showInteractivePlanet(pagename) {
        for (var i = 0; i < this.planetMeshes.length; i++) {
            this.scene.remove(this.planetMeshes[i]);
        }

        for (var i = 0; i < this.planetNames.length; i++) {
            if (pagename.startsWith(this.planetNames[i])) {
                this.scene.add(this.planetMeshes[i]);
                break;
            }
        }
    }

    // Animate - controls and renderer
    // -------------------------------------------------------------------------
    animate() {
        this.controls.autoRotate = true;
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize interactive planet 
var planetScene = new PlanetScene();

function animatePlanet() {
    planetScene.animate();
    requestAnimationFrame(animatePlanet);
}
animatePlanet();