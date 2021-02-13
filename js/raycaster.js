// This class is for detecting clicked objects in scene
// Basic code is used from: https://threejs.org/docs/index.html#api/en/core/Raycaster

class RayCaster {
    constructor(camera) {
        this.camera = camera;
    }

    onMouseMove = function(event) {
        var mouse = new THREE.Vector2(0, 0);
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        // console.log("X: " + mouse.x);
        // console.log("Y: " + mouse.y);

        var raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, this.camera);

        var intersects = raycaster.intersectObjects(scene.children);
        for (let i = 0; i < intersects.length; i++) {
            intersects[i].object.material.color.set(0xff0000);
            document.getElementById("sidebarPlanetInfo").style.left = "40px";
        }
    }
}