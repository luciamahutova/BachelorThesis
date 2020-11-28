// Values /////////////////////////////////////////////////////
var rotationValuesAroundSun = [1.607, 1.174, 1.000, 0.802, 0.434, 0.323, 0.228, 0.182];
var eulerNumberDistanceFromSun = [2.0790e+3, 3.8849e+3, 5.3709e+3, 8.1834e+3, 2.7951e+4, 5.1464e+4, 1.0328e+5, 1.6168e+5];
var scene, camera, renderer, hemiLight, pointLight, planetsMesh;
var bgTexture, bgGeometry, bgMaterial, bgMesh, bgScene, bgCamera;

initialize();
resizeBackground();
setLight();
setStaticBackground();

// createZoomEvent();
var planetObject = new Planet();
planetObject.createPlanets();
planetsMesh = planetObject.createPlanetsMesh();
addMeshToScene(planetsMesh);
planetObject.setPlanetsRotationAngle();
planetObject.createEmptyObjects();


function initialize() {
    // Scene
    scene = new THREE.Scene();

    // Camera
    camera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 0.1, 1500);
    camera.position.set(0, 40, 0);
    camera.lookAt(new THREE.Vector3(0, 1, 0));

    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: false });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.autoClearColor = false; // PRIDANE
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.BasicShadowMap;
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
    hemiLight = new THREE.HemisphereLight(0xffffff, 0x061327, 1.3);
    hemiLight.position.set(0, 0, 0);
    scene.add(hemiLight);

    pointLight = new THREE.PointLight(0xffffff, 0.8, window.innerHeight, 1.5);
    pointLight.position.set(0, 0, 0);
    pointLight.castShadow = true;
    pointLight.shadow.camera.near = 0;
    pointLight.shadow.camera.far = window.innerWidth;
    scene.add(pointLight);
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

function addMeshToScene(planetsMesh) {
    for (var i = 0; i < planetsMesh.length; i++) {
        scene.add(planetsMesh[i]);
    }
}

// Animation
///////////////////////////////////////////////////////////////
function animate() {
    planetObject.setPlanetsDistanceFromSun(eulerNumberDistanceFromSun);
    planetObject.setPlanetsRotationSpeedAroundSun(rotationValuesAroundSun);

    bgMesh.material.depthTest = false;
    renderer.autoClear = false;
    renderer.render(bgScene, bgCamera);
    renderer.render(scene, camera);
    animFrameOutput = requestAnimationFrame(animate);
};
animate();