// Variables /////////////////////////////////////////////////////
var scene, renderer, camera, zoomValue;

var mainScene = new MainScene();
scene = mainScene.getScene();
renderer = mainScene.getRenderer();
camera = mainScene.getCamera();
mainScene.resizeBackground(renderer, camera);


function animate() {
    mainScene.animate();
    animationFrameOutput = requestAnimationFrame(animate);
}
animate();

moveSceneToOriginalPosition = function(scene) {
    scene.position.set(0, 0, 0);
}
moveSceneToOriginalPosition(scene);