// Initialize program
let modelScene = new ModelScene();
modelScene.initializeSceneObjects();
let renderer = modelScene.getRenderer();
let scene = modelScene.getScene();
let camera = modelScene.getCamera();

// Solar system model 
// -------------------------------------------------------------------------
var i = 0;

function animate() {
    modelScene.animate();
    if (document.getElementById("pauseButton").disabled == false) {
        modelScene.rotateSceneObjects(modelScene.sidebarManager.getPlayTime() -
            modelScene.sidebarManager.getPlayPauseTimeDifference() + i);
        i += 50;
        modelScene.startRenderer(renderer, scene, camera);
    } else {
        modelScene.startRendererOnMouseEvents(renderer, scene, camera);
    }

    requestAnimationFrame(animate);
}
animate();


// Clear WebGL (depth) - after 1min of run
// -------------------------------------------------------------------------
function clearDepth() {
    renderer.clearDepth(1);
}
setInterval(clearDepth, 60000);


// TEST - JE K NIEČOMU DOBRÉ?
// function clearScene() {
//     scene.traverse(function(children) {
//         if (children instanceof THREE.Mesh || children instanceof THREE.Line) {
//             children.material.dispose();
//             children.geometry.dispose();
//         }
//     });
// }
// setInterval(clearScene, 5000);