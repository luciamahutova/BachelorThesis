class InitScene {
    constructor() {}

    initRenderer(width, height, alphaBoolean) {
        var renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: false, alpha: alphaBoolean });
        renderer.setSize(width, height);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.autoClearColor = false;
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.BasicShadowMap;
        document.body.appendChild(renderer.domElement);
        return renderer;
    }

    initCamera(width, height) {
        var camera = new THREE.PerspectiveCamera(100, width / height, 0.1, 1500);
        camera.position.set(0, 45, 0);
        camera.lookAt(new THREE.Vector3(0, 1, 0));
        return camera;
    }

    resizeBackground(renderer, camera) {
        window.addEventListener('resize', function() {
            renderer.setSize(window.innerWidth, window.innerHeight);
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
        });
    }

    setPointLightOnScene() {
        // Positions of lights are set in class Sun + according the movement of scene
        var pointLight = new THREE.PointLight(0xffffff, 1.6, window.innerWidth, 2);
        pointLight.castShadow = true;
        pointLight.shadow.camera.near = 0;
        pointLight.shadow.camera.far = window.innerWidth;
        return pointLight;
    }

    setPointLightOnSun() {
        return new THREE.PointLight(0xffffff, 2, 30, 2);
    }

    traverseSceneToCastShadows(scene) {
        scene.traverse(function(children) {
            children.castShadow = true;
            children.receiveShadow = true;
        });
    }
}