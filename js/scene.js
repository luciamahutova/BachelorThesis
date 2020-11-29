class MainScene {
    initScene = function() {
        this.scene = new THREE.Scene();
        return this.scene;
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
        pointLight.position.set(0, 0, 0);
        pointLight.castShadow = true;
        pointLight.shadow.camera.near = 0;
        pointLight.shadow.camera.far = window.innerWidth;
        this.scene.add(pointLight);
    }

    setStaticBackground = function() {
        const bgTexture = THREE.ImageUtils.loadTexture('/images/2k-starsMilkyWay.jpg');
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

    // Called outside the class //////////////////////////////////////
    initialize = function() {
        this.scene = this.initScene();
        this.renderer = this.initRenderer();
        this.camera = this.initCamera();
        this.bgMesh = this.setStaticBackground();
        this.bgScene = this.createBgScene(this.bgMesh);
        this.bgCamera = this.createBgCamera();
        this.setLights();
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

    animate = function() {
        this.bgMesh.material.depthTest = false;
        this.renderer.autoClear = false;
        this.renderer.render(this.bgScene, this.bgCamera);
        this.renderer.render(this.scene, this.camera);
    };

}