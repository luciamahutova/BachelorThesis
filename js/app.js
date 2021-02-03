// Variables /////////////////////////////////////////////////////
var scene, renderer, camera, isAppRunning, planetsNamesOnScene;

var mainScene = new MainScene();
scene = mainScene.getScene();
renderer = mainScene.getRenderer();
camera = mainScene.getCamera();
planetsNamesOnScene = mainScene.getPlanetsNamesOnScene();
mainScene.resizeBackground(renderer, camera);

var sidebarManager = new SidebarManager(planetsNamesOnScene, scene);


function animate() {
    mainScene.animate();
    animationFrameOutput = requestAnimationFrame(animate);
}
animate();
mainScene.moveSceneToOriginalPosition(scene);