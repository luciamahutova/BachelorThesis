class MainScene {
    constructor() {
        this.scene;
        this.camera;
        this.bgMesh;
        this.bgScene;
        this.bgCamera;
        this.pointLight;
        this.pointLight2;
        this.makeCameraFollowObject = true;
        this.lastIndex = 0;

        this.planetObject;
        this.moonObject;
        this.moonMeshes;
        this.sunObject;
        this.raycaster;
        this.cosmicObject;
        this.sidebarManager;

        this.scaleValueScene = this.speedValuePlanets = 0;
        this.mouseDown = false; // Used for drag events
        this.mousePositionX = this.mousePositionY = 0; // Used for drag events
    }

    getScene() { return this.scene }
    getRenderer() { return this.renderer }
    getCamera() { return this.camera }

    // Initialize renderer, camera, lights
    // -------------------------------------------------------------------------
    initRenderer() {
        this.renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: false });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.autoClearColor = false;
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.BasicShadowMap;
        document.body.appendChild(this.renderer.domElement);
        return this.renderer;
    }

    initCamera() {
        this.camera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 0.1, 1500);
        this.camera.position.set(0, 45, 0);
        this.camera.lookAt(new THREE.Vector3(0, 1, 0));
        return this.camera;
    }

    createBgCamera() {
        this.bgCamera = new THREE.Camera();
        this.bgScene.add(this.bgCamera);
        return this.bgCamera;
    }

    setLights() {
        // Positions of lights are set in class Sun + according the movement of scene
        this.pointLight = new THREE.PointLight(0xffffff, 1.6, window.innerWidth, 2);
        this.pointLight.castShadow = true;
        this.pointLight.shadow.camera.near = 0;
        this.pointLight.shadow.camera.far = window.innerWidth;

        this.pointLight2 = new THREE.PointLight(0xffffff, 2, 30, 2);

        this.scene.traverse(function(children) {
            children.castShadow = true;
            children.receiveShadow = true;
        });
    }

    // Background of Scene
    // -------------------------------------------------------------------------
    setStaticBackground() {
        const bgTexture = new THREE.TextureLoader().load('/images/2k-starsMilkyWay.jpg');
        const bgGeometry = new THREE.PlaneGeometry(2, 2, 0);
        const bgMaterial = new THREE.MeshBasicMaterial({ map: bgTexture });
        this.bgMesh = new THREE.Mesh(bgGeometry, bgMaterial);
        return this.bgMesh;
    }

    createBgScene() {
        this.bgScene = new THREE.Scene();
        this.bgScene.add(this.bgMesh);
        return this.bgScene;
    }

    resizeBackground(renderer, camera) {
        window.addEventListener('resize', function() {
            renderer.setSize(window.innerWidth, window.innerHeight);
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
        });
    }

    // Move Scene functions
    // -------------------------------------------------------------------------
    moveCameraOnPressedArrow(e) {
        // Movement in opposite direction - seems more natural
        var moveCameraeByValue = 10;
        if (e.keyCode == '37') { // Left arrow key
            this.camera.position.x -= moveCameraeByValue;
        } else if (e.keyCode == '38') { // Top arrow key
            this.camera.position.z -= moveCameraeByValue;
        } else if (e.keyCode == '39') { // Right arrow key
            this.camera.position.x += moveCameraeByValue;
        } else if (e.keyCode == '40') { // Bottom arrow kes
            this.camera.position.z += moveCameraeByValue;
        } else if (e.keyCode == "27") { // Escape key
            this.camera.position.set(0, 45, 0);
        }
    }

    moveCameraToOriginalPosition(camera) {
        camera.position.set(0, 45, 0);
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
        this.mouseDown = false;
    }

    // Event listener functions
    // -------------------------------------------------------------------------
    addEventListenerFunctions() {
        window.addEventListener('keydown', this.moveCameraOnPressedArrow, false);
        window.addEventListener('click', this.raycaster.onMouseMove(this.camera, this.scene), false);
        window.addEventListener('mousedown', this.mouseDownEvent, false);
        window.addEventListener('mousemove', this.mouseMoveEvent(this.scene), false);
        window.addEventListener('mouseup', this.mouseUpEvent, false);
    }

    // Zooming in/out (for planets and orbits) - called in app.js
    // -------------------------------------------------------------------------
    zoomAndSpeedRangesliders(time) {
        var zoomSlider = document.getElementById("rangesliderZoomInput");
        var zoomSliderValue = document.getElementById("rangesliderZoomValue");
        var speedSlider = document.getElementById("rangesliderSpeedInput");
        var speedSliderValue = document.getElementById("rangesliderSpeedValue");

        var updateRangesliderValues = () => {
            zoomSliderValue.innerHTML = zoomSlider.value;
            this.scaleValueScene = zoomSliderValue.innerHTML / 200;

            speedSliderValue.innerHTML = speedSlider.value;
            this.speedValuePlanets = speedSliderValue.innerHTML;

            this.planetObject.setScaleForObjectsAndOrbits(this.scaleValueScene);
            this.moonObject.scaleObjectsByRangeslider(this.scaleValueScene, this.moonObject.getMoonMeshes());
            this.sunObject.setScaleForSun(this.scaleValueScene);

            this.planetObject.rotateAllPlanets(this.scaleValueScene, this.speedValuePlanets, time);
            this.moonObject.rotateAllMoons(this.scaleValueScene, this.speedValuePlanets, time);
            this.planetObject.cosmicObject.findClickedPlanet(this.scaleValueScene, this.speedValuePlanets, time);
        }
        zoomSlider.addEventListener('input', updateRangesliderValues);
        updateRangesliderValues();
    }

    // Button for 
    // -------------------------------------------------------------------------
    activateCameraToObjectButton() {
        if (this.makeCameraFollowObject) {
            this.makeCameraFollowObject = false;
            $('.slider').prop('disabled', true);
            $('#cosmicObjectButton').prop('disabled', true);
            window.removeEventListener('mousemove', this.mouseMoveEvent(this.scene), false);
            document.getElementById("cameraToObjectButton").style.backgroundColor = "lightblue";
        } else if (!this.makeCameraFollowObject) {
            this.makeCameraFollowObject = true;
            $('.slider').prop('disabled', false);
            $('#cosmicObjectButton').prop('disabled', false);
            window.addEventListener('mousemove', this.mouseMoveEvent(this.scene), false);
            document.getElementById("cameraToObjectButton").style.backgroundColor = "#061327";
        }
    }

    findClickedPlanetForCamera() {
        if (window.myParam != undefined) {
            var selectedPlanet = window.myParam[0].object;
            var planet = this.planetObject.getPlanetMeshes();
            var index;

            if (selectedPlanet.name == "Mercury") {
                index = 0;
            } else if (selectedPlanet.name == "Venus") {
                index = 1;
            } else if (selectedPlanet.name == "Earth") {
                index = 2;
            } else if (selectedPlanet.name == "Mars") {
                index = 3;
            } else if (selectedPlanet.name == "Jupiter") {
                index = 4;
            } else if (selectedPlanet.name == "Saturn") {
                index = 5;
            } else if (selectedPlanet.name == "Uranus") {
                index = 6;
            } else if (selectedPlanet.name == "Neptune") {
                index = 7;
            }

            if (!this.makeCameraFollowObject && index != undefined) {
                // temporarily disable z-rotation for planet object = camera will be placed above the planet
                planet[index].setRotationFromAxisAngle(new THREE.Vector3(0, 0, 1), 0);
                planet[index].add(this.camera);
                this.camera.position.set(0, 15, 0);
                this.lastIndex = index;
            } else if (this.makeCameraFollowObject) {
                planet[this.lastIndex].remove(this.camera);
                this.camera.position.set(0, 45, 0);
            }
        }
    }


    // Animate function and initializing classes: called in app.js 
    // -------------------------------------------------------------------------
    animate() {
        this.addEventListenerFunctions();
        this.raycaster.animate();
        this.findClickedPlanetForCamera();

        this.bgMesh.material.depthTest = false;
        this.renderer.autoClear = false;
        this.renderer.render(this.bgScene, this.bgCamera);
    };

    startRenderer(renderer, scene, camera) {
        renderer.render(scene, camera);
    }

    startRendererOnMouseEvents() {
        // Used when animation is paused - less burden for renderer when objects are not rotating
        window.addEventListener('keydown', this.startRenderer(this.renderer, this.scene, this.camera), false);
        window.addEventListener('click', this.startRenderer(this.renderer, this.scene, this.camera), false);
        window.addEventListener('mousedown', this.startRenderer(this.renderer, this.scene, this.camera), false);
        window.addEventListener('mousemove', this.startRenderer(this.renderer, this.scene, this.camera), false);
        window.addEventListener('mouseup', this.startRenderer(this.renderer, this.scene, this.camera), false);
    }

    initializeSceneObjects() {
        this.scene = new THREE.Scene();
        this.initRenderer();
        this.camera = this.initCamera();
        this.bgMesh = this.setStaticBackground();
        this.bgScene = this.createBgScene(this.bgMesh);
        this.bgCamera = this.createBgCamera();
        this.setLights();

        this.planetObject = new Planet(this.scene);
        this.planetObject.initializePlanets();
        this.moonObject = new Moon(this.scene, this.planetObject.orbitClass.getAllOrbits());
        this.moonMeshes = this.moonObject.getMoonMeshes();
        this.sunObject = new Sun(this.scene, this.pointLight, this.pointLight2);
        this.raycaster = new RayCaster(this.planetObject.getPlanetData(), this.planetObject.getMoonData());
        this.sidebarManager = new SidebarManager(this.planetObject.getPlanetNamesEN(), this.planetObject.getPlanetNamesCZ(),
            this.planetObject.getPlanetNamesSK(), this.moonObject.getMoonsNamesOnScene(), this.moonObject.getMoonMeshes(),
            this.scene, this.planetObject.orbitClass.getAllOrbits());
    }
}