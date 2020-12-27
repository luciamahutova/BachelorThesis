// Variables /////////////////////////////////////////////////////
var scene, renderer, camera, zoomValue;

var mainScene = new MainScene();
scene = mainScene.getScene();
renderer = mainScene.getRenderer();
camera = mainScene.getCamera();
mainScene.resizeBackground(renderer, camera);

var planetObject = new Planet(scene);
planetObject.initializePlanets();

// POKUS
// var picker = new ObjectPicker();
// picker.addEvent();


function animate() {
    mainScene.animate();
    planetObject.rotateAllPlanets();
    animationFrameOutput = requestAnimationFrame(animate);
}
animate();

moveSceneToOriginalPosition = function(scene) {
    scene.position.set(0, 0, 0);
}
moveSceneToOriginalPosition(scene);