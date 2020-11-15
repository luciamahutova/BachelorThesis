// Scene
let scene = new THREE.Scene();

// Camera
let camera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 0.1, 1500);
camera.position.x = 2;
camera.position.z = 10;

// Renderer
let renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(devicePixelRatio);
document.body.appendChild(renderer.domElement);

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
let mercury = new THREE.SphereGeometry(0.5, 50, 50);
let venus = new THREE.SphereGeometry(0.5, 50, 50);
let earth = new THREE.SphereGeometry(0.5, 50, 50);
let mars = new THREE.SphereGeometry(0.5, 50, 50);
let jupiter = new THREE.SphereGeometry(0.5, 50, 50);
let saturn = new THREE.SphereGeometry(0.5, 50, 50);
let uranus = new THREE.SphereGeometry(0.5, 50, 50);
let neptune = new THREE.SphereGeometry(0.5, 50, 50);
let mercuryMesh, venusMesh, earthMesh, marsMesh, jupiterMesh, saturnMesh, uranusMesh, neptuneMesh = '';

// Mesh for planets
function setNewMesh(imageSrc) {
    let texture = new THREE.TextureLoader().load(imageSrc);
    let meshMaterial = new THREE.MeshBasicMaterial({ map: texture });
    return meshMaterial;
}

// const mercuryTexture = new THREE.TextureLoader().load('/images/textures/mercuryTexture2k.jpg');
// const mercuryMaterial = new THREE.MeshBasicMaterial({ map: mercuryTexture });
// let sphereMesh = new THREE.Mesh(mercury, mercuryMaterial);

var planetObjects = new Array(mercury, venus, earth, mars, jupiter, saturn, uranus, neptune);
var planetMeshes = new Array(mercuryMesh, venusMesh, earthMesh, marsMesh, jupiterMesh, saturnMesh, uranusMesh, neptuneMesh);
var planetTextures = new Array('/images/textures/mercuryTexture2k.jpg', '/images/textures/venusTexture2k.jpg',
    '/images/textures/earthTexture2k.jpg', '/images/textures/marsTexture2k.jpg',
    '/images/textures/jupiterTexture2k.jpg', '/images/textures/saturnTexture2k.jpg',
    '/images/textures/uranusTexture2k.jpg', '/images/textures/neptuneTexture2k.jpg'
);
for (i = 0; i < planetMeshes.length; i++) {
    // sphereMesh = new THREE.Mesh(planetObjects[i], setNewMesh(planetTextures[i]));
    // sphereMesh.position.x = (Math.random() - 0.5) * 10;
    // scene.add(sphereMesh);
    planetMeshes[i] = new THREE.Mesh(planetObjects[i], setNewMesh(planetTextures[i]));
    planetMeshes[i].position.x = (Math.random() - 0.5) * 10;
    scene.add(planetMeshes[i]);
}

//CUDZI KOD - resize pre okno = DEFORMUJE OBJEKTY, ZATIAL NEPOUZITE
// window.addEventListener('resize', () => {
//     renderer.setSize = window.innerWidth, window.innerHeight;
//     camera.aspect = window.innerWidth / window.innerHeight;
//     camera.updateProjectionMatrix();
// })

// Animation
const animate = function() {
    requestAnimationFrame(animate);

    // sphereMesh.rotation.x += 0.01;
    // sphereMesh.rotation.y += 0.01;

    bgMesh.material.depthTest = false;
    renderer.autoClear = false;
    renderer.render(bgScene, bgCamera);
    renderer.render(scene, camera);
};
animate();