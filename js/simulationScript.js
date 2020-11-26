// Values /////////////////////////////////////////////////////
var rotationValuesAroundSun = [1.607, 1.174, 1.000, 0.802, 0.434, 0.323, 0.228, 0.182];
var eulerNumberDistanceFromSun = [2.0790e+3, 3.8849e+3, 5.3709e+3, 8.1834e+3, 2.7951e+4, 5.1464e+4, 1.0328e+5, 1.6168e+5];
var scene, camera, renderer, hemiLight, planetsMesh;
var bgTexture, bgGeometry, bgMaterial, bgMesh, bgScene, bgCamera;

initialize();
resizeBackground();
setLight();
setStaticBackground();
createPlanets();
planetsMesh = createPlanetsMesh();
addMeshToScene(planetsMesh);
setPlanetsRotationAngle();
createEmptyObjects();
createZoomEvent();
//var mesh = createOrbit();



function initialize() {
    // Scene
    scene = new THREE.Scene();

    // Camera
    camera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 0.1, 1500);
    camera.position.set(0, 40, 0);
    //camera.position.set(0, 0, 40);
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: false }); //ZMENA
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(devicePixelRatio);
    renderer.autoClearColor = false; // PRIDANE
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

function addMeshToScene(planetsMesh) {
    for (var i = 0; i < planetsMesh.length; i++) {
        scene.add(planetsMesh[i]);
    }
}

// POKUS 2 - NAKRESLENIE CIARY
// Make highly-transparent plane
var fadeMaterial = new THREE.MeshBasicMaterial({
    color: 0x061327,
    transparent: true,
    opacity: 0.05
});
var fadePlane = new THREE.PlaneBufferGeometry(1, 1);
var fadeMesh = new THREE.Mesh(fadePlane, fadeMaterial);

// Create Object3D to hold camera and transparent plane
var camGroup = new THREE.Object3D();
camGroup.add(fadeMesh);

// Put plane in front of camera
fadeMesh.position.z = -0.1;

// Make plane render before particles
fadeMesh.renderOrder = -1;

// Add camGroup to scene
scene.add(camGroup);


// var lineRenderer = new THREE.WebGLRenderer({ preserveDrawingBuffer: true, antialias: true });
// lineRenderer.autoClearColor = false;
// lineRenderer.setSize(window.innerWidth, window.innerHeight);

document.addEventListener('DOMContentLoaded', function() {
    document.body.appendChild(lineRenderer.domElement);
});

// var geometry = new THREE.BoxGeometry(1, 1, 1);
// var material = new THREE.MeshBasicMaterial({ color: 0x0000ff });
// var cube = new THREE.Mesh(geometry, material);
// scene.add(cube);
var orbitLine = new THREE.SphereBufferGeometry(0.15, 30, 30);
var orbitColor = new THREE.MeshBasicMaterial({ color: 0xffffff });
var planetOrbit = new THREE.Mesh(orbitLine, orbitColor);
emptyObjectRotateJupiter.add(planetOrbit);
scene.add(planetOrbit);

var step = .03;

// Animation
///////////////////////////////////////////////////////////////
function animate() {

    setPlanetsDistanceFromSun(eulerNumberDistanceFromSun);
    setPlanetsRotationSpeedAroundSun(rotationValuesAroundSun);

    // POKUS
    //planetOrbit.position.x += step;
    planetOrbit.position.x = (eulerNumberDistanceFromSun[4] / 1000);
    planetOrbit.position.z = 2;
    planetOrbit.rotation.y += 0.01;

    bgMesh.material.depthTest = false;
    renderer.autoClear = false;
    renderer.render(bgScene, bgCamera);
    renderer.render(scene, camera);
    animFrameOutput = requestAnimationFrame(animate);
};
animate();