// Values /////////////////////////////////////////////////////
var rotationValuesAroundSun = [1.607, 1.174, 1.000, 0.802, 0.434, 0.323, 0.228, 0.182];
var eulerNumberDistanceFromSun = [2.0790e+3, 3.8849e+3, 5.3709e+3, 8.1834e+3, 2.7951e+4, 5.1464e+4, 1.0328e+5, 1.6168e+5];
var scene, camera, renderer, hemiLight, pointLight, planetsMesh;
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
// createZoomEvent();


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


// POKUS = MIZNUCA CIARA
var fadeMaterial = new THREE.MeshBasicMaterial({
    color: 0x000000,
    transparent: true,
    opacity: 0.01
});
var fadePlane = new THREE.PlaneBufferGeometry(0.15, 0.15, 0);
var fadeMesh = new THREE.Mesh(fadePlane, fadeMaterial);
var emptyObjectFadePlane = new THREE.Object3D();
emptyObjectFadePlane.add(fadeMesh);
sunMesh.add(emptyObjectFadePlane);
// var camera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 0.1, 1500);
fadeMesh.position.z = -0.1; // Put plane in front of camera
fadeMesh.renderOrder = -1; // Make plane render before particles

// GULICKA PRE VYTVORENIE CIARY, ZATIAL NEKRESLI PRI POHYBE
var orbitLine = new THREE.SphereBufferGeometry(0.15, 30, 30);
var orbitColor = new THREE.MeshBasicMaterial({ color: 0xffffff });
var planetOrbit = new THREE.Mesh(orbitLine, orbitColor);
emptyObjectRotateJupiter.add(planetOrbit);


/////////////////////////////////////////////////////////////////////
var MAX_POINTS = 500;
var positionsY = new Array(500);
var orbitLine = new THREE.SphereBufferGeometry(0.5, 30, 30);
var orbitColor = new THREE.MeshBasicMaterial({ color: 0xffff00 });
var dot = new THREE.Mesh(orbitLine, orbitColor);
var obj = new THREE.Object3D();

function updatePositionsJupiter() {
    var currentPosY = formNum = 0;

    for (var i = 0, l = MAX_POINTS; i < l; i++) {
        var currentPosY = emptyObjectRotateJupiter.rotation.y;
        var formNum = (Math.round(currentPosY * 100) / 100).toFixed(4);

        // if (positionsY.includes(formNum) === false) {
        //     //planetOrbit.rotation.y += rotationValuesAroundSun[4] / 100;
        //     console.log("formed: " + formNum);
        //     console.log("posY: " + positionsY[i]);
        // }
        positionsY[i] = formNum;
    }
}

function drawDot() {
    obj.add(dot);
    sunMesh.add(obj);
    for (i = 0; i < positionsY.length; i++) {
        obj.rotation.y = positionsY[i];
        dot.position.x = eulerNumberDistanceFromSun[4] / 1000;
        dot.position.z = 3;
    }
}

// Animation
///////////////////////////////////////////////////////////////
function animate() {
    setPlanetsDistanceFromSun(eulerNumberDistanceFromSun);
    setPlanetsRotationSpeedAroundSun(rotationValuesAroundSun);

    // POKUS
    planetOrbit.position.x = eulerNumberDistanceFromSun[4] / 1000;
    planetOrbit.position.z = 2;
    planetOrbit.rotation.y += rotationValuesAroundSun[4] / 100;
    updatePositionsJupiter();
    drawDot();

    bgMesh.material.depthTest = false;
    renderer.autoClear = false;
    renderer.render(bgScene, bgCamera);
    renderer.render(scene, camera);
    animFrameOutput = requestAnimationFrame(animate);
};
animate();