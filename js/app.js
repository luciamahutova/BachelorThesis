// Variables /////////////////////////////////////////////////////
var scene, renderer, camera, isAppRunning, moonsNamesOnScene, moonMeshes, orbits;
var planetNamesEN, planetNamesCZ, planetNamesSK;

var mainScene = new MainScene();
scene = mainScene.getScene();
renderer = mainScene.getRenderer();
camera = mainScene.getCamera();
planetNamesEN = mainScene.planetObject.getPlanetNamesEN();
planetNamesCZ = mainScene.planetObject.getPlanetNamesCZ();
planetNamesSK = mainScene.planetObject.getPlanetNamesSK();
moonsNamesOnScene = mainScene.moonObject.getMoonsNamesOnScene();
moonMeshes = mainScene.moonObject.getMoonMeshes();
orbits = mainScene.planetObject.orbitClass.getAllOrbits();
mainScene.resizeBackground(renderer, camera);


var sidebarManager = new SidebarManager(planetNamesEN, planetNamesCZ, planetNamesSK, moonsNamesOnScene, moonMeshes, scene, orbits);
var i = 0;

function animate() {
    mainScene.animate();
    if (document.getElementById("pauseButton").disabled == false) {
        mainScene.zoomAndSpeedRangesliders(sidebarManager.getPlayTime() - sidebarManager.getPlayPauseTimeDifference() + i);
        i += 50;
    }
    animationFrameOutput = requestAnimationFrame(animate);
}
animate();