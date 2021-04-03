class ModelScene extends InitScene {
    constructor() {
        super();
        this.scene = new THREE.Scene();
        this.renderer = this.initRenderer(window.innerWidth, window.innerHeight, false);
        this.camera = this.initCamera(window.innerWidth, window.innerHeight);
        this.bgMesh = this.setStaticBackground();
        this.bgScene = this.createBgScene(this.bgMesh);
        this.bgCamera = this.createBgCamera();
        this.traverseSceneToCastShadows(this.scene);

        this.isCameraFollowingObject = true;
        this.lastIndexOfFollowedObject = 0;

        this.scaleValueScene = this.speedValue = 0;
        this.mouseDown = false; // Used for drag events
        this.mousePositionX = this.mousePositionY = 0; // Used for drag events
    }

    // Get()
    getScene() { return this.scene }
    getRenderer() { return this.renderer }
    getCamera() { return this.camera }
    getBgMesh() { return this.bgMesh }
    getBgScene() { return this.bgScene }
    getBgCamera() { return this.bgCamera }
    getScaleValue() { return this.scaleValueScene }
    getSpeedValue() { return this.speedValue }
    getIsCameraFollowingObject() { return this.isCameraFollowingObject }
    getLastIndexOfFollowedObject() { return this.lastIndexOfFollowedObject }

    // Set()
    setScaleValue(value) { this.scaleValueScene = value }
    setSpeedValue(value) { this.speedValue = value }
    setIsCameraFollowingObject(boolean) { this.isCameraFollowingObject = boolean }
    setLastIndexOfFollowedObject(value) { this.lastIndexOfFollowedObject = value }

    // Background of scene
    // -------------------------------------------------------------------------
    setStaticBackground() {
        var bgTexture = new THREE.TextureLoader().load('/images/2k-starsMilkyWay.jpg');
        var bgGeometry = new THREE.PlaneGeometry(2, 2, 0);
        var bgMaterial = new THREE.MeshBasicMaterial({ map: bgTexture });
        var bgMesh = new THREE.Mesh(bgGeometry, bgMaterial);
        bgMesh.material.depthTest = false;
        return bgMesh;
    }

    createBgScene() {
        var bgScene = new THREE.Scene();
        bgScene.add(this.getBgMesh());
        return bgScene;
    }

    createBgCamera() {
        var bgCamera = new THREE.Camera();
        (this.getBgScene()).add(bgCamera);
        return bgCamera;
    }

    // Move Scene functions
    // -------------------------------------------------------------------------
    moveSceneOnPressedArrow(scene) {
        return function(e) {
            // Movement in opposite direction - seems more natural
            var moveSceneByValue = 0.01;
            if (e.keyCode == '37') { // Left arrow key
                scene.position.x += moveSceneByValue;
            } else if (e.keyCode == '38') { // Top arrow key
                scene.position.z += moveSceneByValue;
            } else if (e.keyCode == '39') { // Right arrow key
                scene.position.x -= moveSceneByValue;
            } else if (e.keyCode == '40') { // Bottom arrow kes
                scene.position.z -= moveSceneByValue;
            } else if (e.keyCode == "27") { // Escape key
                scene.position.set(0, 0, 0);
            }
        }
    }

    moveSceneToOriginalPosition() {
        (this.getScene()).position.set(0, 0, 0);
    }

    // Drag function for scene: 
    // https://uxdesign.cc/implementing-a-custom-drag-event-function-in-javascript-and-three-js-dc79ee545d85
    mouseMoveEvent(scene) {
        this.sunObject.setLightsToSunPosition();
        return function(event) {
            if (this.mouseDown) {
                var moveToX = event.clientX - this.mousePositionX;
                var moveToY = event.clientY - this.mousePositionY;
                this.mousePositionX = event.clientX;
                this.mousePositionY = event.clientY;

                scene.position.x += moveToX / 10;
                scene.position.z += moveToY / 10;
            }
        }
    }

    mouseDownEvent(event) {
        this.mouseDown = true;
        this.mousePositionX = event.clientX;
        this.mousePositionY = event.clientY;
    }

    mouseUpEvent() {
        this.mouseDown = false
    }

    // Event listener functions
    // -------------------------------------------------------------------------
    addEventListenerFunctions() {
        window.addEventListener('keydown', this.moveSceneOnPressedArrow(this.getScene()), false);
        window.addEventListener('click', this.raycaster.onMouseMove(this.getCamera(), this.getScene(),
            this.raycaster.getRaycaster(), this.raycaster.getMouse()), false);
        window.addEventListener('mousedown', this.mouseDownEvent, false);
        window.addEventListener('mousemove', this.mouseMoveEvent(this.getScene()), false);
        window.addEventListener('mouseup', this.mouseUpEvent, false);
    }

    // Zooming in/out (for planets and orbits) - called in app.js
    // -------------------------------------------------------------------------
    rotateSceneObjects(time) {
        var forceSlider = document.getElementById("rangesliderSpeedInput");
        var forceSliderValue = document.getElementById("rangesliderSpeedValue");
        forceSliderValue.innerHTML = forceSlider.value;
        this.setSpeedValue(forceSliderValue.innerHTML);

        this.planetObject.orbitClass.positionAllMoonOrbits();
        this.planetObject.rotateAllPlanets(time);
        this.moonObject.rotateAllMoons(time);
        this.planetObject.cosmicObject.findClickedPlanet(this.getSpeedValue());
    }

    // Button for camera zoom to selected planet
    // -------------------------------------------------------------------------
    activateCameraToObjectButton() {
        if (this.getIsCameraFollowingObject()) {
            this.setIsCameraFollowingObject(false);
            $('#cosmicObjectButton').prop('disabled', true);
            window.removeEventListener('mousemove', this.mouseMoveEvent(this.getScene()), false);
            document.getElementById("cameraToObjectButton").style.backgroundColor = "lightblue";
        } else if (!(this.getIsCameraFollowingObject())) {
            this.setIsCameraFollowingObject(true);
            $('#cosmicObjectButton').prop('disabled', false);
            window.addEventListener('mousemove', this.mouseMoveEvent(this.getScene()), false);
            document.getElementById("cameraToObjectButton").style.backgroundColor = "#061327";
        }
    }

    findClickedPlanetForCamera() {
        var buttonColor = document.getElementById("cameraToObjectButton").style.backgroundColor;
        if (window.myParam != undefined && buttonColor == "lightblue") {
            var selectedPlanet = window.myParam[0].object;
            var planet = this.planetObject.getPlanetMeshes();
            var index = this.jsonManager.getIndexOfSelectedPlanet(selectedPlanet);

            if (!(this.getIsCameraFollowingObject()) && index != undefined) {
                // temporarily disable z-rotation for planet object = camera will be placed above the planet
                planet[index].setRotationFromAxisAngle(new THREE.Vector3(0, 0, 1), 0);
                planet[index].add(this.getCamera());
                this.camera.position.set(0, 15, 0);
                this.setLastIndexOfFollowedObject(index);
            } else if (this.getIsCameraFollowingObject()) {
                planet[this.getLastIndexOfFollowedObject()].remove(this.getCamera());
                (this.getCamera()).position.set(0, 45, 0);
            }
        }
    }

    // Animate function and initializing classes: called in app.js 
    // -------------------------------------------------------------------------
    animate() {
        this.raycaster.getPhysicalValuesOfClickedObjectFromJSON();
        this.findClickedPlanetForCamera();
        this.renderer.render(this.getBgScene(), this.getBgCamera());
    };

    startRenderer(renderer, scene, camera) {
        renderer.render(scene, camera);
    }

    startRendererOnMouseEvents() {
        // Used when animation is paused - less burden for renderer when objects are not rotating
        window.addEventListener('keydown', this.startRenderer(this.getRenderer(), this.getScene(), this.getCamera()), false);
        window.addEventListener('click', this.startRenderer(this.getRenderer(), this.getScene(), this.getCamera()), false);
        window.addEventListener('mousedown', this.startRenderer(this.getRenderer(), this.getScene(), this.getCamera()), false);
        window.addEventListener('mousemove', this.startRenderer(this.getRenderer(), this.getScene(), this.getCamera()), false);
        window.addEventListener('mouseup', this.startRenderer(this.getRenderer(), this.getScene(), this.getCamera()), false);
    }

    initializeSceneObjects() {
        this.jsonManager = new JSONManager();
        this.initPlanets = new InitPlanets();
        this.planetObject = new Planet(this.getScene());
        this.planetObject.initializePlanets();
        this.moonObject = new Moon(this.getScene(), this.planetObject.orbitClass.getAllOrbits());
        this.moonMeshes = this.moonObject.getMoonMeshes();

        var pointLightScene = this.setPointLightOnScene();
        var pointLightSun = this.setPointLightOnSun();
        this.sunObject = new Sun(this.getScene(), pointLightScene, pointLightSun);
        this.raycaster = new RayCaster();
        this.sidebarManager = new SidebarManager(this.planetObject.getPlanetNamesEN(), this.planetObject.getPlanetNamesCZ(),
            this.planetObject.getPlanetNamesSK(), this.moonObject.getMoonsNamesOnScene(), this.moonObject.getTranslatedMoonName(), this.moonObject.getMoonMeshes(), this.getScene(), this.planetObject.orbitClass.getAllOrbits());

        this.resizeBackground(this.getRenderer(), this.getCamera());
        this.addEventListenerFunctions();
    }
}