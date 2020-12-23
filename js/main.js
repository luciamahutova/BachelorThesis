// Values /////////////////////////////////////////////////////
const rotationValuesAroundSun = [1.607, 1.174, 1.000, 0.802, 0.434, 0.323, 0.228, 0.182];
var scene, renderer, camera, planetsMesh, zoomValue;

var mainScene = new MainScene();
scene = mainScene.getScene();
renderer = mainScene.getRenderer();
camera = mainScene.getCamera();
mainScene.resizeBackground(renderer, camera);

var planetObject = new Planet(scene);
planetObject.initializePlanets();
planetsMesh = planetObject.getPlanetsMeshes();

// POKUS
// var picker = new ObjectPicker();
// picker.addEvent();


function animate() {
    //planetObject.setPlanetsRotationSpeedAroundSun(rotationValuesAroundSun);
    mainScene.animate();
    planetObject.rotateAllPlanets();
    animationFrameOutput = requestAnimationFrame(animate);
}
animate();

moveSceneToOriginalPosition = function(scene) {
    scene.position.set(0, 0, 0);
}
moveSceneToOriginalPosition(scene);