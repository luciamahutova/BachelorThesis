// This class is for detecting clicked objects in scene
// Basic code is used from: https://threejs.org/docs/index.html#api/en/core/Raycaster

// class RayCaster {
//     constructor() {
//         this.raycaster = new THREE.Raycaster();
//         this.mouse = new THREE.Vector2();
//         this.pickedObject = null;
//         this.pickedObjectSavedColor = 0;
//         this.pickPositionX = this.pickPositionY = 0;

//         //window.addEventListener('mousemove', this.onMouseMove, false);
//         window.addEventListener('mousemove', this.setPickPosition);
//     }

//     onMouseMove = function(event) {
//         this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
//         this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
//         console.log("onMouseMove");
//     }

//     render = function(camera, scene) {
//         // update the picking ray with the camera and mouse position
//         this.raycaster.setFromCamera(this.mouse, camera);

//         // calculate objects intersecting the picking ray
//         const intersects = this.raycaster.intersectObjects(scene.children);

//         for (let i = 0; i < intersects.length; i++) {
//             intersects[i].object.material.color.set(0xff0000);
//         }
//         console.log("render");
//         //renderer.render(scene, camera);
//     }

//     // 
// }

class PickHelper {
    constructor() {
        this.raycaster = new THREE.Raycaster();
        this.pickedObject = null;
        this.pickedObjectSavedColor = 0;
    }
    pick(normalizedPosition, scene, camera, time) {
        // restore the color if there is a picked object
        if (this.pickedObject) {
            //this.pickedObject.material.emissive.setHex(this.pickedObjectSavedColor);
            this.pickedObject = undefined;
        }

        // cast a ray through the frustum
        this.raycaster.setFromCamera(normalizedPosition, camera);
        // get the list of objects the ray intersected
        const intersectedObjects = this.raycaster.intersectObjects(scene.children);
        if (intersectedObjects.length) {
            // pick the first object. It's the closest one
            this.pickedObject = intersectedObjects[0].object;
            console.log("Picked: " + this.pickedObject);
        }
    }
}

PickHelper.prototype.allFunctions = function() {
    const pickPosition = { x: 0, y: 0 };
    const pickHelper = new PickHelper();
    clearPickPosition();

    function render() {
        pickHelper.pick(pickPosition, scene, camera, 1);
        //renderer.render(scene, camera);
        //requestAnimationFrame(render);
    }
    //requestAnimationFrame(render);

    function getCanvasRelativePosition(event) {
        const rect = window.getBoundingClientRect();
        return {
            x: (event.clientX - rect.left) * window.innerWidth / rect.width,
            y: (event.clientY - rect.top) * window.innerHeight / rect.height,
        };
    }

    function setPickPosition(event) {
        const pos = getCanvasRelativePosition(event);
        pickPosition.x = (pos.x / window.innerWidth) * 2 - 1;
        pickPosition.y = (pos.y / window.innerHeight) * -2 + 1; // note we flip Y
    }

    function clearPickPosition() {
        // unlike the mouse which always has a position
        // if the user stops touching the screen we want
        // to stop picking. For now we just pick a value
        // unlikely to pick something
        pickPosition.x = -100000;
        pickPosition.y = -100000;
    }
    window.addEventListener('mousemove', setPickPosition);
    window.addEventListener('mouseout', clearPickPosition);
    window.addEventListener('mouseleave', clearPickPosition);

    window.addEventListener('touchstart', (event) => {
        // prevent the window from scrolling
        event.preventDefault();
        setPickPosition(event.touches[0]);
    }, { passive: false });

    window.addEventListener('touchmove', (event) => {
        setPickPosition(event.touches[0]);
    });

    window.addEventListener('touchend', clearPickPosition);

    render();
}