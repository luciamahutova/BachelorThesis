// Scene
let scene = new THREE.Scene();

// Camera
let camera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 0.1, 1500);
camera.position.z = 10;
//camera.updateProjectionMatrix();
//camera.lookAt(new THREE.Vector3(0, 0, 0));

// Renderer
let renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(devicePixelRatio);
//renderer.physicallyCorrectLights = true;
document.body.appendChild(renderer.domElement);

// Window resizing - background
window.addEventListener('resize', function() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});

// Light
let hemiLight = new THREE.HemisphereLight(0x00aa00, 0x000000, 1);
hemiLight.position.set(500, 500, 0);
scene.add(hemiLight);

// Background texture
let bgTexture = THREE.ImageUtils.loadTexture('/images/2k-starsMilkyWay.jpg');
let bgGeometry = new THREE.PlaneGeometry(2, 2, 0);
let bgMaterial = new THREE.MeshBasicMaterial({ map: bgTexture });
let bgMesh = new THREE.Mesh(bgGeometry, bgMaterial);

// Background scene and camera
var bgScene = new THREE.Scene();
var bgCamera = new THREE.Camera();
bgScene.add(bgCamera);
bgScene.add(bgMesh);

// Creating planets
let mercury = new THREE.SphereGeometry(0.175, 50, 50);
let venus = new THREE.SphereGeometry(0.434, 50, 50);
let earth = new THREE.SphereGeometry(0.457, 50, 50);
let mars = new THREE.SphereGeometry(0.243, 50, 50);
let jupiter = new THREE.SphereGeometry(1.674, 50, 50);
let saturn = new THREE.SphereGeometry(1.395, 50, 50);
let uranus = new THREE.SphereGeometry(0.607, 50, 50);
let neptune = new THREE.SphereGeometry(0.589, 50, 50);

// Mesh for planets
function setNewMesh(imageSrc) {
    let texture = new THREE.TextureLoader().load(imageSrc);
    let meshMaterial = new THREE.MeshBasicMaterial({ map: texture });
    return meshMaterial;
}

// Creating mesh for planets
let mercuryMesh = new THREE.Mesh(mercury, setNewMesh('/images/textures/mercuryTexture2k.jpg'));
let venusMesh = new THREE.Mesh(venus, setNewMesh('/images/textures/venusTexture2k.jpg'));
let earthMesh = new THREE.Mesh(earth, setNewMesh('/images/textures/earthTexture2k.jpg'));
let marsMesh = new THREE.Mesh(mars, setNewMesh('/images/textures/marsTexture2k.jpg'));
let jupiterMesh = new THREE.Mesh(jupiter, setNewMesh('/images/textures/jupiterTexture2k.jpg'));
let saturnMesh = new THREE.Mesh(saturn, setNewMesh('/images/textures/saturnTexture2k.jpg'));
let uranusMesh = new THREE.Mesh(uranus, setNewMesh('/images/textures/uranusTexture2k.jpg'));
let neptuneMesh = new THREE.Mesh(neptune, setNewMesh('/images/textures/neptuneTexture2k.jpg'));
scene.add(mercuryMesh, venusMesh, earthMesh, marsMesh, jupiterMesh, saturnMesh, uranusMesh, neptuneMesh);
// docasne rozmiestnenie
mercuryMesh.position.x = -6;
venusMesh.position.x = -4;
earthMesh.position.x = -2;
marsMesh.position.x = 0;
jupiterMesh.position.x = 2;
saturnMesh.position.x = 4;
uranusMesh.position.x = 6;
neptuneMesh.position.x = 8;
earthMesh.position.z = 2;

// Planets' angle around its axis
mercuryMesh.setRotationFromAxisAngle(new THREE.Vector3(0, 0, 1), (0.03 * Math.PI) / 180);
venusMesh.setRotationFromAxisAngle(new THREE.Vector3(0, 0, 1), (177.4 * Math.PI) / 180);
earthMesh.setRotationFromAxisAngle(new THREE.Vector3(0, 0, 1), (23.4 * Math.PI) / 180);
marsMesh.setRotationFromAxisAngle(new THREE.Vector3(0, 0, 1), (25.2 * Math.PI) / 180);
jupiterMesh.setRotationFromAxisAngle(new THREE.Vector3(0, 0, 1), (3.1 * Math.PI) / 180);
saturnMesh.setRotationFromAxisAngle(new THREE.Vector3(0, 0, 1), (26.7 * Math.PI) / 180);
uranusMesh.setRotationFromAxisAngle(new THREE.Vector3(0, 0, 1), (97.8 * Math.PI) / 180);
neptuneMesh.setRotationFromAxisAngle(new THREE.Vector3(0, 0, 1), (28.3 * Math.PI) / 180);

// Zoom-in and zoom-out
document.addEventListener('wheel', (event) => {
    camera.position.z += (event.deltaY / 1000) * 0.5;
});

// Animation
const animate = function() {
    requestAnimationFrame(animate);

    //earthMesh.rotation.y += 0.01;
    //saturnMesh.rotation.y += 0.01;

    // mercuryMesh.rotation.y += Math.PI / 180;
    // venusMesh.rotation.y += Math.PI / 180;
    //earthMesh.rotation.y += Math.PI / 180;
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