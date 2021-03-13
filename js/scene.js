class MainScene {
    constructor() {
        this.scene;
        this.camera;
        this.bgMesh;
        this.bgScene;
        this.bgCamera;
        this.spotLight;
        this.makeCameraFollowObject = true;

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
        const pointLight = new THREE.PointLight(0xffffff, 1.6, window.innerWidth / 2, 2);
        pointLight.position.set(0, 0, 0);
        pointLight.castShadow = true;
        pointLight.shadow.camera.near = 0;
        pointLight.shadow.camera.far = window.innerWidth;
        this.scene.add(pointLight);

        this.spotLight = new THREE.SpotLight(0xffffff);
        this.spotLight.position.set(0, 10, 0);
        this.spotLight.castShadow = true;
        this.spotLight.shadow.mapSize.width = 30;
        this.spotLight.shadow.mapSize.height = 30;
        this.spotLight.shadow.camera.near = 10;
        this.spotLight.shadow.camera.far = 30;
        //spotLight.shadow.camera.fov = 20;
        this.scene.add(this.spotLight);

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
    mouseMoveEvent(camera) {
        return function(event) {
            if (this.mouseDown) {
                var moveToX = event.clientX - this.mousePositionX;
                var moveToY = event.clientY - this.mousePositionY;
                this.mousePositionX = event.clientX;
                this.mousePositionY = event.clientY;

                camera.position.x -= moveToX / 10;
                camera.position.z -= moveToY / 10;
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
        window.addEventListener('mousemove', this.mouseMoveEvent(this.camera), false);
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
            this.planetObject.cosmicObject.setScaleForCosmicObject(this.scaleValueScene);

            this.planetObject.rotateAllPlanets(this.scaleValueScene, this.speedValuePlanets, time);
            this.moonObject.rotateAllMoons(this.scaleValueScene, this.speedValuePlanets, time);
            this.planetObject.cosmicObject.findClickedPlanet(this.scaleValueScene, this.speedValuePlanets, time);
        }
        zoomSlider.addEventListener('input', updateRangesliderValues);
        updateRangesliderValues();
    }

    // POKUS - zameranie na konkrétnu planétu
    // setUpPositionOfCamera() {
    //     var planet = this.planetObject.getPlanetMeshes();
    //     var clickedPlanet, index;
    //     if (window.myParam != undefined) {
    //         clickedPlanet = window.myParam[0].object.name;

    //         if (clickedPlanet == "Mercury") {
    //             index = 0;
    //         } else if (clickedPlanet == "Venus") {
    //             index = 1;
    //         } else if (clickedPlanet == "Earth") {
    //             index = 2;
    //         } else if (clickedPlanet == "Mars") {
    //             index = 3;
    //         } else if (clickedPlanet == "Jupiter") {
    //             index = 4;
    //         } else if (clickedPlanet == "Saturn") {
    //             index = 5;
    //         } else if (clickedPlanet == "Uranus") {
    //             index = 6;
    //         } else if (clickedPlanet == "Neptune") {
    //             index = 7;
    //         }

    //         if (this.makeCameraFollowObject) {
    //             planet[index].add(this.camera);
    //             this.camera.position.set(0, 15, 0);
    //             this.makeCameraFollowObject = false;
    //             $('.slider').prop('disabled', true);
    //         } else {
    //             planet[index].remove(this.camera);
    //             this.camera.position.set(0, 45, 0);
    //             this.makeCameraFollowObject = true;
    //             $('.slider').prop('disabled', false);
    //         }
    //     }
    // }



    // Animate function and initializing classes: called in app.js 
    // -------------------------------------------------------------------------
    animate() {
        this.addEventListenerFunctions();
        this.raycaster.animate(this.planetObject.getPlanetData(), this.planetObject.getMoonData());

        this.bgMesh.material.depthTest = false;
        this.renderer.autoClear = false;
        this.renderer.render(this.bgScene, this.bgCamera);
        this.renderer.render(this.scene, this.camera);
    };

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
        this.sunObject = new Sun(this.scene, this.spotLight);
        this.raycaster = new RayCaster();
        this.sidebarManager = new SidebarManager(this.planetObject.getPlanetNamesEN(), this.planetObject.getPlanetNamesCZ(),
            this.planetObject.getPlanetNamesSK(), this.moonObject.getMoonsNamesOnScene(), this.moonObject.getMoonMeshes(),
            this.scene, this.planetObject.orbitClass.getAllOrbits());
    }
}