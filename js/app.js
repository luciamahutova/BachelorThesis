// Initialize program
var mainScene = new MainScene();
mainScene.initializeSceneObjects();
mainScene.resizeBackground(mainScene.getRenderer(), mainScene.getCamera());

var i = 0;

function animate() {
    mainScene.animate();
    if (document.getElementById("pauseButton").disabled == false) {
        mainScene.zoomAndSpeedRangesliders(mainScene.sidebarManager.getPlayTime() - mainScene.sidebarManager.getPlayPauseTimeDifference() + i);
        i += 50;
    }
    animationFrameOutput = requestAnimationFrame(animate);
}
animate();