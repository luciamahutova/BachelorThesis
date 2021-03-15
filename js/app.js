// Initialize program
let mainScene = new MainScene();
mainScene.initializeSceneObjects();
let renderer = mainScene.getRenderer();
let scene = mainScene.getScene();
let camera = mainScene.getCamera();
mainScene.resizeBackground(renderer, camera);

var i = 0;

function animate() {
    mainScene.animate();
    if (document.getElementById("pauseButton").disabled == false) {
        mainScene.startRenderer(renderer, scene, camera);

        mainScene.zoomAndSpeedRangesliders(mainScene.sidebarManager.getPlayTime() -
            mainScene.sidebarManager.getPlayPauseTimeDifference() + i);
        i += 50;
    } else {
        mainScene.startRendererOnMouseEvents(renderer, scene, camera);
    }

    animationFrameOutput = requestAnimationFrame(animate);
}
animate();