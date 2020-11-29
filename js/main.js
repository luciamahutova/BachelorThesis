// Values /////////////////////////////////////////////////////
const rotationValuesAroundSun = [1.607, 1.174, 1.000, 0.802, 0.434, 0.323, 0.228, 0.182];
const eulerNumberDistanceFromSun = [2.0790e+3, 3.8849e+3, 5.3709e+3, 8.1834e+3, 2.7951e+4, 5.1464e+4, 1.0328e+5, 1.6168e+5];
var scene, renderer, camera, planetsMesh;

var mainScene = new MainScene();
mainScene.initialize();

scene = mainScene.getScene();
renderer = mainScene.getRenderer();
camera = mainScene.getCamera();
mainScene.resizeBackground(renderer, camera);

var planetObject = new Planet(scene);
planetObject.initializePlanets();


function animate() {
    planetObject.setPlanetsDistanceFromSun(eulerNumberDistanceFromSun);
    planetObject.setPlanetsRotationSpeedAroundSun(rotationValuesAroundSun);

    mainScene.animate();
    animFrameOutput = requestAnimationFrame(animate);
}
animate();