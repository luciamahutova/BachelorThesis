var scene, camera, renderer, hemiLight;
var bgTexture, bgGeometry, bgMaterial, bgMesh, bgScene, bgCamera;
var sun, mercury, venus, earth, mars, jupiter, saturn, uranus, neptune;
var sunMesh, mercuryMesh, venusMesh, earthMesh, marsMesh, jupiterMesh, saturnMesh, uranusMesh, neptuneMesh;
var emptyObjectRotateMercury, emptyObjectRotateVenus, emptyObjectRotateEarth, emptyObjectRotateMars, emptyObjectRotateJupiter, emptyObjectRotateSaturn, emptyObjectRotateUranus, emptyObjectRotateNeptune;

// Values
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
//createZoomEvent();
createEmptyObjects();

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
    hemiLight = new THREE.HemisphereLight(0x00aa00, 0x000000, 1);
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

function createPlanets() {
    // 10x smaller scale for the Sun
    sun = new THREE.SphereBufferGeometry(5, 50, 50);
    mercury = new THREE.SphereBufferGeometry(0.175, 50, 50);
    venus = new THREE.SphereBufferGeometry(0.435, 50, 50);
    earth = new THREE.SphereBufferGeometry(0.457, 50, 50);
    mars = new THREE.SphereBufferGeometry(0.243, 50, 50);

    // 3x smaller scale (4 planets)
    jupiter = new THREE.SphereBufferGeometry(1.673, 50, 50);
    saturn = new THREE.SphereBufferGeometry(1.394, 50, 50);
    uranus = new THREE.SphereBufferGeometry(0.607, 50, 50);
    neptune = new THREE.SphereBufferGeometry(0.589, 50, 50);

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
    // Planets' angle around its axis = Z
    mercuryMesh.setRotationFromAxisAngle(new THREE.Vector3(0, 0, 1), (0.03 * Math.PI) / 180);
    venusMesh.setRotationFromAxisAngle(new THREE.Vector3(0, 0, 1), (177.4 * Math.PI) / 180);
    earthMesh.setRotationFromAxisAngle(new THREE.Vector3(0, 0, 1), (23.4 * Math.PI) / 180);
    marsMesh.setRotationFromAxisAngle(new THREE.Vector3(0, 0, 1), (25.2 * Math.PI) / 180);
    jupiterMesh.setRotationFromAxisAngle(new THREE.Vector3(0, 0, 1), (3.1 * Math.PI) / 180);
    saturnMesh.setRotationFromAxisAngle(new THREE.Vector3(0, 0, 1), (26.7 * Math.PI) / 180);
    uranusMesh.setRotationFromAxisAngle(new THREE.Vector3(0, 0, 1), (97.8 * Math.PI) / 180);
    neptuneMesh.setRotationFromAxisAngle(new THREE.Vector3(0, 0, 1), (28.3 * Math.PI) / 180);
}

// Position for every planet's orbit from the Sun
function setPlanetsPositionFromSun(eulerNumberDistanceFromSun) {
    // Changed scale for better view
    mercuryMesh.position.x = eulerNumberDistanceFromSun[0] / 300;
    venusMesh.position.x = eulerNumberDistanceFromSun[1] / 300;
    earthMesh.position.x = eulerNumberDistanceFromSun[2] / 300;
    marsMesh.position.x = eulerNumberDistanceFromSun[3] / 400;
    jupiterMesh.position.x = eulerNumberDistanceFromSun[4] / 1000;
    saturnMesh.position.x = eulerNumberDistanceFromSun[5] / 1500;
    uranusMesh.position.x = eulerNumberDistanceFromSun[6] / 2500;
    neptuneMesh.position.x = eulerNumberDistanceFromSun[7] / 3500;
}

//Empty objects will control planets' movement around the Sun
function createEmptyObjects() {
    emptyObjectRotateMercury = new THREE.Object3D();
    emptyObjectRotateMercury.add(mercuryMesh);

    emptyObjectRotateVenus = new THREE.Object3D();
    emptyObjectRotateVenus.add(venusMesh);

    emptyObjectRotateEarth = new THREE.Object3D();
    emptyObjectRotateEarth.add(earthMesh);

    emptyObjectRotateMars = new THREE.Object3D();
    emptyObjectRotateMars.add(marsMesh);

    emptyObjectRotateJupiter = new THREE.Object3D();
    emptyObjectRotateJupiter.add(jupiterMesh);

    emptyObjectRotateSaturn = new THREE.Object3D();
    emptyObjectRotateSaturn.add(saturnMesh);

    emptyObjectRotateUranus = new THREE.Object3D();
    emptyObjectRotateUranus.add(uranusMesh);

    emptyObjectRotateNeptune = new THREE.Object3D();
    emptyObjectRotateNeptune.add(neptuneMesh);

    addEmptyToSun();
}

// For rotating planets around the Sun
function addEmptyToSun() {
    var emptyObjectsArray = [emptyObjectRotateMercury, emptyObjectRotateVenus, emptyObjectRotateEarth, emptyObjectRotateMars, emptyObjectRotateJupiter, emptyObjectRotateSaturn, emptyObjectRotateUranus, emptyObjectRotateNeptune];

    for (i = 0; i < emptyObjectsArray.length; i++) {
        sunMesh.add(emptyObjectsArray[i]);
    }
}

function setPlanetsRotationSpeedAroundSun(values) {
    emptyObjectRotateMercury.rotation.y += values[0] / 100;
    emptyObjectRotateVenus.rotation.y += values[1] / 100;
    emptyObjectRotateEarth.rotation.y += values[2] / 100;
    emptyObjectRotateMars.rotation.y += values[3] / 100;
    emptyObjectRotateJupiter.rotation.y += values[4] / 100;
    emptyObjectRotateSaturn.rotation.y += values[5] / 100;
    emptyObjectRotateUranus.rotation.y += values[6] / 100;
    emptyObjectRotateNeptune.rotation.y += values[7] / 100;
}

function createZoomEvent() {
    // Zoom-in and zoom-out
    document.addEventListener('wheel', (event) => {
        camera.position.z += (event.deltaY / 2000) * 0.5;
    });
}

// Animation
const animate = function() {
    requestAnimationFrame(animate);
    // mercuryMesh.rotation.y += Math.PI / 180;

    setPlanetsPositionFromSun(eulerNumberDistanceFromSun);
    setPlanetsRotationSpeedAroundSun(rotationValuesAroundSun);
    bgMesh.material.depthTest = false;
    renderer.autoClear = false;
    renderer.render(bgScene, bgCamera);
    renderer.render(scene, camera);
};
animate();