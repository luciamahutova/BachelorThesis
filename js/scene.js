function MainScene() {
    const scene = initScene();
    const renderer = initRenderer();
    const camera = initCamera();
    const bgMesh = setStaticBackground();
    const bgScene = createBgScene(bgMesh);
    const bgCamera = createBgCamera(bgScene);
    resizeBackground();
    setLights(scene);


    function initScene() {
        const scene = new THREE.Scene();
        return scene;
    }

    function initRenderer() {
        const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: false });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.autoClearColor = false; // PRIDANE
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.BasicShadowMap;
        document.body.appendChild(renderer.domElement);

        return renderer;
    }

    function initCamera() {
        const camera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 0.1, 1500);
        camera.position.set(0, 40, 0);
        camera.lookAt(new THREE.Vector3(0, 1, 0));
        return camera;
    }

    function resizeBackground() {
        window.addEventListener('resize', function() {
            renderer.setSize(window.innerWidth, window.innerHeight);
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
        });
    }

    function setLights(scene) {
        const hemiLight = new THREE.HemisphereLight(0xffffff, 0x061327, 1.3);
        hemiLight.position.set(0, 0, 0);
        scene.add(hemiLight);

        const pointLight = new THREE.PointLight(0xffffff, 0.8, window.innerHeight, 1.5);
        pointLight.position.set(0, 0, 0);
        pointLight.castShadow = true;
        pointLight.shadow.camera.near = 0;
        pointLight.shadow.camera.far = window.innerWidth;
        scene.add(pointLight);
    }

    function setStaticBackground() {
        // Background texture
        const bgTexture = THREE.ImageUtils.loadTexture('/images/2k-starsMilkyWay.jpg');
        //bgTexture = new THREE.TextureLoader.load('/images/2k-starsMilkyWay.jpg');
        const bgGeometry = new THREE.PlaneGeometry(2, 2, 0);
        const bgMaterial = new THREE.MeshBasicMaterial({ map: bgTexture });
        const bgMesh = new THREE.Mesh(bgGeometry, bgMaterial);
        return bgMesh;
    }

    function createBgScene(bgMesh) {
        const bgScene = new THREE.Scene();
        bgScene.add(bgMesh);
        return bgScene;
    }

    function createBgCamera(bgScene) {
        const bgCamera = new THREE.Camera();
        bgScene.add(bgCamera);
        return bgCamera;
    }

    this.animate = function() {
        bgMesh.material.depthTest = false;
        renderer.autoClear = false;
        renderer.render(bgScene, bgCamera);
        renderer.render(scene, camera);
    }

    this.getScene = function() {
        return scene;
    }

}