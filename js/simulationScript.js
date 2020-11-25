// Values /////////////////////////////////////////////////////
var eulerNumberDistanceFromSun = [2.0790e+3, 3.8849e+3, 5.3709e+3, 8.1834e+3,
    2.7951e+4, 5.1464e+4, 1.0328e+5, 1.6168e+5
];
var rotationValuesAroundSun = [1.607, 1.174, 1.000, 0.802, 0.434, 0.323, 0.228, 0.182];


initialize();
resizeBackground();
setLight();
setStaticBackground();
createPlanets();
setPlanetsRotationAngle();
createEmptyObjects();
//createZoomEvent();


function initialize() {
    // Scene
    scene = new THREE.Scene();

    // Camera
    camera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 0.1, 1500);
    camera.position.set(0, 40, 0);
    camera.lookAt(new THREE.Vector3(0, 1, 0));

    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(devicePixelRatio);
    document.body.appendChild(renderer.domElement);
}

function resizeBackground() {
    window.addEventListener('resize', function() {
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    });
}

function setLight() {
    hemiLight = new THREE.HemisphereLight(0x061327, 0x000000, 1);
    hemiLight.position.set(0, 0, 0);
    scene.add(hemiLight);
}

function setStaticBackground() {
    // Background texture
    bgTexture = THREE.ImageUtils.loadTexture('/images/2k-starsMilkyWay.jpg');
    //bgTexture = new THREE.TextureLoader.load('/images/2k-starsMilkyWay.jpg');
    bgGeometry = new THREE.PlaneGeometry(2, 2, 0);
    bgMaterial = new THREE.MeshBasicMaterial({ map: bgTexture });
    bgMesh = new THREE.Mesh(bgGeometry, bgMaterial);

    // Background scene and camera
    bgScene = new THREE.Scene();
    bgCamera = new THREE.Camera();
    bgScene.add(bgCamera);
    bgScene.add(bgMesh);
}

function createZoomEvent() {
    // Zoom-in and zoom-out
    document.addEventListener('wheel', (event) => {
        camera.position.z += (event.deltaY / 2000) * 0.5;
    });
}


// Animation; Play/Pause animation ////////////////////////////
var isRunning = true;
var animFrameOutput = 0;

const animate = function() {
    animFrameOutput = requestAnimationFrame(animate);
    setPlanetsDistanceFromSun(eulerNumberDistanceFromSun);
    setPlanetsRotationSpeedAroundSun(rotationValuesAroundSun);

    bgMesh.material.depthTest = false;
    renderer.autoClear = false;
    renderer.render(bgScene, bgCamera);
    renderer.render(scene, camera);
};
animate();