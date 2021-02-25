// Variables /////////////////////////////////////////////////////
var scene, renderer, camera, isAppRunning, planetsNamesOnScene, moonsNamesOnScene, moonMeshes, orbits;

var mainScene = new MainScene();
scene = mainScene.getScene();
renderer = mainScene.getRenderer();
camera = mainScene.getCamera();
planetsNamesOnScene = mainScene.planetObject.getPlanetsNamesOnScene();
moonsNamesOnScene = mainScene.moonObject.getMoonsNamesOnScene();
moonMeshes = mainScene.moonObject.getMoonMeshes();
orbits = mainScene.planetObject.orbitClass.getAllOrbits();
mainScene.resizeBackground(renderer, camera);


var sidebarManager = new SidebarManager(planetsNamesOnScene, moonsNamesOnScene, moonMeshes, scene, orbits);
var i = 0;

function animate() {
    mainScene.animate(sidebarManager.getPlayTime() - sidebarManager.getPlayPauseTimeDifference() + i);
    i += 50;
    animationFrameOutput = requestAnimationFrame(animate);
}
animate();
mainScene.moveSceneToOriginalPosition(scene);