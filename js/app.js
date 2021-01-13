// Variables /////////////////////////////////////////////////////
var scene, renderer, camera, isAppRunning;

var mainScene = new MainScene();
scene = mainScene.getScene();
renderer = mainScene.getRenderer();
camera = mainScene.getCamera();
mainScene.resizeBackground(renderer, camera);

var sidebarManager = new SidebarManager();



function animate() {
    mainScene.animate();
    animationFrameOutput = requestAnimationFrame(animate);
}
animate();
mainScene.moveSceneToOriginalPosition(scene);