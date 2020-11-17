var scene, camera, renderer, hemiLight;
var bgTexture, bgGeometry, bgMaterial, bgMesh, bgScene, bgCamera;
var sun, mercury, venus, earth, mars, jupiter, saturn, uranus, neptune;
var sunMesh, mercuryMesh, venusMesh, earthMesh, marsMesh, jupiterMesh, saturnMesh, uranusMesh, neptuneMesh;

initialize();
resizeBackground();
setLight();
setStaticBackground();
createPlanets();
setPlanetsRotationAngle();
createZoomEvent();

function initialize() {
    // Scene
    scene = new THREE.Scene();

    // Camera
    camera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 0.1, 1500);
    camera.position.z = 10;

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
    hemiLight = new THREE.HemisphereLight(0x00aa00, 0x000000, 1);
    hemiLight.position.set(0, 0, 0);
    scene.add(hemiLight);
}

function setStaticBackground() {
    // Background texture
    bgTexture = THREE.ImageUtils.loadTexture('/images/2k-starsMilkyWay.jpg');
    bgGeometry = new THREE.PlaneGeometry(2, 2, 0);
    bgMaterial = new THREE.MeshBasicMaterial({ map: bgTexture });
    bgMesh = new THREE.Mesh(bgGeometry, bgMaterial);

    // Background scene and camera
    bgScene = new THREE.Scene();
    bgCamera = new THREE.Camera();
    bgScene.add(bgCamera);
    bgScene.add(bgMesh);
}

function createPlanets() {
    sun = new THREE.SphereGeometry(5, 50, 50);
    mercury = new THREE.SphereGeometry(0.175, 50, 50);
    venus = new THREE.SphereGeometry(0.434, 50, 50);
    earth = new THREE.SphereGeometry(0.457, 50, 50);
    mars = new THREE.SphereGeometry(0.243, 50, 50);
    jupiter = new THREE.SphereGeometry(1.674, 50, 50);
    saturn = new THREE.SphereGeometry(1.395, 50, 50);
    uranus = new THREE.SphereGeometry(0.607, 50, 50);
    neptune = new THREE.SphereGeometry(0.589, 50, 50);

    createPlanetsMesh();
}

// Mesh for planets
function setNewMesh(imageSrc) {
    let texture = new THREE.TextureLoader().load(imageSrc);
    let meshMaterial = new THREE.MeshBasicMaterial({ map: texture });
    return meshMaterial;
}

function createPlanetsMesh() {
    sunMesh = new THREE.Mesh(sun, setNewMesh('/images/textures/sunTexture2k.jpg'));
    mercuryMesh = new THREE.Mesh(mercury, setNewMesh('/images/textures/mercuryTexture2k.jpg'));
    venusMesh = new THREE.Mesh(venus, setNewMesh('/images/textures/venusTexture2k.jpg'));
    earthMesh = new THREE.Mesh(earth, setNewMesh('/images/textures/earthTexture2k.jpg'));
    marsMesh = new THREE.Mesh(mars, setNewMesh('/images/textures/marsTexture2k.jpg'));
    jupiterMesh = new THREE.Mesh(jupiter, setNewMesh('/images/textures/jupiterTexture2k.jpg'));
    saturnMesh = new THREE.Mesh(saturn, setNewMesh('/images/textures/saturnTexture2k.jpg'));
    uranusMesh = new THREE.Mesh(uranus, setNewMesh('/images/textures/uranusTexture2k.jpg'));
    neptuneMesh = new THREE.Mesh(neptune, setNewMesh('/images/textures/neptuneTexture2k.jpg'));
    scene.add(sunMesh, mercuryMesh, venusMesh, earthMesh, marsMesh, jupiterMesh, saturnMesh, uranusMesh, neptuneMesh);
}

function setPlanetsRotationAngle() {
    // Planets' angle around its axis
    mercuryMesh.setRotationFromAxisAngle(new THREE.Vector3(0, 0, 1), (0.03 * Math.PI) / 180);
    venusMesh.setRotationFromAxisAngle(new THREE.Vector3(0, 0, 1), (177.4 * Math.PI) / 180);
    earthMesh.setRotationFromAxisAngle(new THREE.Vector3(0, 0, 1), (23.4 * Math.PI) / 180);
    marsMesh.setRotationFromAxisAngle(new THREE.Vector3(0, 0, 1), (25.2 * Math.PI) / 180);
    jupiterMesh.setRotationFromAxisAngle(new THREE.Vector3(0, 0, 1), (3.1 * Math.PI) / 180);
    saturnMesh.setRotationFromAxisAngle(new THREE.Vector3(0, 0, 1), (26.7 * Math.PI) / 180);
    uranusMesh.setRotationFromAxisAngle(new THREE.Vector3(0, 0, 1), (97.8 * Math.PI) / 180);
    neptuneMesh.setRotationFromAxisAngle(new THREE.Vector3(0, 0, 1), (28.3 * Math.PI) / 180);

    //saturnMesh.rotateOnWorldAxis(new THREE.Vector3(0, 0, 1), (26.7 * Math.PI) / 180);
}

function createZoomEvent() {
    // Zoom-in and zoom-out
    document.addEventListener('wheel', (event) => {
        camera.position.z += (event.deltaY / 2000) * 0.5;
    });
}

// function centerTheSun() {
//     sunMesh.position.x = 0;
//     sunMesh.position.y = 0;
//     sunMesh.position.z = 0;
// }

// docasne rozmiestnenie
sunMesh.position.x = -6;
sunMesh.position.z = -10;
mercuryMesh.position.x = -6;
venusMesh.position.x = -4;
earthMesh.position.x = -2;
marsMesh.position.x = 0;
jupiterMesh.position.x = 2;
saturnMesh.position.x = 4;
uranusMesh.position.x = 6;
neptuneMesh.position.x = 8;
earthMesh.position.z = 2;

// Animation
const animate = function() {
    requestAnimationFrame(animate);

    // mercuryMesh.rotation.y += 0.016;
    // venusMesh.rotation.y += 0.012;
    // earthMesh.rotation.y += 0.01;
    // marsMesh.rotation.y += 0.008;
    // jupiterMesh.rotation.y += 0.004;
    //saturnMesh.rotation.y += 0.003;
    // uranusMesh.rotation.y += 0.002;
    // neptuneMesh.rotation.y += 0.002;

    // mercuryMesh.rotation.y += Math.PI / 180;
    // venusMesh.rotation.y += Math.PI / 180;
    // earthMesh.rotation.y += Math.PI / 180;
    // marsMesh.rotation.y += Math.PI / 180;
    // jupiterMesh.rotation.y += Math.PI / 180;
    // saturnMesh.rotation.y += Math.PI / 180;
    // uranusMesh.rotation.y += Math.PI / 180;
    // neptuneMesh.rotation.y += Math.PI / 180;

    bgMesh.material.depthTest = false;
    renderer.autoClear = false;
    renderer.render(bgScene, bgCamera);
    renderer.render(scene, camera);
};
animate();