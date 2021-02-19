class MainScene {
    constructor() {
        this.scene = new THREE.Scene();
        this.initRenderer();
        this.initCamera();
        this.bgMesh = this.setStaticBackground();
        this.bgScene = this.createBgScene(this.bgMesh);
        this.bgCamera = this.createBgCamera();
        this.setLights();

        this.planetObject = new Planet(this.scene);
        this.planetObject.initializePlanets();
        this.moonObject = new Moon(this.scene, this.planetObject.getPlanetMeshes(), this.planetObject.getPlanetData());
        this.moonObject.initializeMoons();
        this.sunObject = new Sun(this.scene);
        this.sunObject.initializeSun();
        this.raycaster = new RayCaster(this.camera);

        this.scaleValueScene = 0; // Used in f.: zoomRangeslider()
        this.speedValuePlanets = 0; // Used in f.: speedRangeslider()
        this.mouseDown = false; // Used for drag events
        this.mousePositionX = this.mousePositionY = 0; // Used for drag events
    }

    initRenderer = function() {
        this.renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: false });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.autoClearColor = false;
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.BasicShadowMap;
        document.body.appendChild(this.renderer.domElement);
        return this.renderer;
    }

    initCamera = function() {
        this.camera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 0.1, 1500);
        this.camera.position.set(0, 40, 0);
        this.camera.lookAt(new THREE.Vector3(0, 1, 0));
        return this.camera;
    }

    setLights = function() {
        const hemiLight = new THREE.HemisphereLight(0xffffff, 0x061327, 1.3);
        hemiLight.position.set(0, 0, 0);
        this.scene.add(hemiLight);

        const pointLight = new THREE.PointLight(0xffffff, 0.8, window.innerHeight, 1.5);
        pointLight.position.set(0, 10, 0);
        pointLight.castShadow = true;
        pointLight.shadow.camera.near = 0;
        pointLight.shadow.camera.far = window.innerWidth;
        this.scene.add(pointLight);
    }

    setStaticBackground = function() {
        const bgTexture = new THREE.TextureLoader().load('/images/2k-starsMilkyWay.jpg');
        const bgGeometry = new THREE.PlaneGeometry(2, 2, 0);
        const bgMaterial = new THREE.MeshBasicMaterial({ map: bgTexture });
        this.bgMesh = new THREE.Mesh(bgGeometry, bgMaterial);
        return this.bgMesh;
    }

    createBgScene = function() {
        this.bgScene = new THREE.Scene();
        this.bgScene.add(this.bgMesh);
        return this.bgScene;
    }

    createBgCamera = function() {
        this.bgCamera = new THREE.Camera();
        this.bgScene.add(this.bgCamera);
        return this.bgCamera;
    }

    getScene = function() { return this.scene }
    getRenderer = function() { return this.renderer }
    getCamera = function() { return this.camera }

    resizeBackground = function(renderer, camera) {
        window.addEventListener('resize', function() {
            renderer.setSize(window.innerWidth, window.innerHeight);
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
        });
    }

    // Movement of the scene by keyboard (4 arrows and Esc) + center the scene back
    moveSceneOnPressedArrow = function(e) {
        // Movement in opposite direction - seems more natural
        var moveSceneByValue = 10;
        if (e.keyCode == '37') { // Left arrow key
            this.scene.position.x += moveSceneByValue;
        } else if (e.keyCode == '38') { // Top arrow key
            this.scene.position.z += moveSceneByValue;
        } else if (e.keyCode == '39') { // Right arrow key
            this.scene.position.x -= moveSceneByValue;
        } else if (e.keyCode == '40') { // Bottom arrow kes
            this.scene.position.z -= moveSceneByValue;
        } else if (e.keyCode == "27") { // Escape key
            this.scene.position.set(0, 0, 0);
        }
    }

    moveSceneToOriginalPosition = function(scene) {
        scene.position.set(0, 0, 0);
    }

    // Drag function for scene: https://uxdesign.cc/implementing-a-custom-drag-event-function-in-javascript-and-three-js-dc79ee545d85
    mouseMoveEvent = function(event) {
        if (this.mouseDown) {
            var moveToX = event.clientX - this.mousePositionX;
            var moveToY = event.clientY - this.mousePositionY;
            this.mousePositionX = event.clientX;
            this.mousePositionY = event.clientY;

            // Move the scene
            this.scene.position.x += moveToX / 10;
            this.scene.position.z += moveToY / 10;
        }
    }

    mouseDownEvent = function(event) {
        this.mouseDown = true;
        this.mousePositionX = event.clientX;
        this.mousePositionY = event.clientY;
    }

    mouseUpEvent = function() {
        this.mouseDown = false;
    }

    // Event listener functions
    addEventListenerFunctions = function() {
        window.addEventListener('keydown', this.moveSceneOnPressedArrow);
        window.addEventListener('click', this.raycaster.onMouseMove);
        window.addEventListener('mousedown', this.mouseDownEvent);
        window.addEventListener('mousemove', this.mouseMoveEvent);
        window.addEventListener('mouseup', this.mouseUpEvent);
    }

    // Animate function: called in app.js 
    animate = function(time) {
        this.addEventListenerFunctions();
        this.raycaster.getPlanetPhysicalValuesFromJSON(this.planetObject.getPlanetData());

        this.zoomAndSpeedRangesliders(time);
        this.moonObject.rotateMoonAroundPlanet(this.scaleValueScene);

        this.bgMesh.material.depthTest = false;
        this.renderer.autoClear = false;
        this.renderer.render(this.bgScene, this.bgCamera);
        this.renderer.render(this.scene, this.camera);
    };
}

// Zooming in/out (for planets and orbits) + movement of the scene
// -------------------------------------------------------------------------
MainScene.prototype.zoomAndSpeedRangesliders = function(time) {
    var zoomSlider = document.getElementById("rangesliderZoomInput");
    var zoomSliderValue = document.getElementById("rangesliderZoomValue");
    var speedSlider = document.getElementById("rangesliderSpeedInput");
    var speedSliderValue = document.getElementById("rangesliderSpeedValue");

    var updateRangesliderValues = () => {
        zoomSliderValue.innerHTML = zoomSlider.value;
        this.scaleValueScene = zoomSliderValue.innerHTML / 200;

        speedSliderValue.innerHTML = speedSlider.value;
        this.speedValuePlanets = speedSliderValue.innerHTML;

        this.planetObject.setScaleForPlanetsAndOrbits(this.scaleValueScene, this.planetObject.getPlanetMeshes());
        this.moonObject.setScaleForMoons(this.scaleValueScene);
        this.sunObject.setScaleForSun(this.scaleValueScene);

        this.planetObject.rotateAllPlanets(this.scaleValueScene, this.speedValuePlanets, time);
    }
    zoomSlider.addEventListener('input', updateRangesliderValues);
    updateRangesliderValues();
}