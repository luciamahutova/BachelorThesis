class ObjectPicker {
    constructor() {
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
    }

    onMouseMove = function(e) {
        var vectorMouse = new THREE.Vector3( //vector from camera to mouse
            -(window.innerWidth / 2 - e.clientX) * 2 / window.innerWidth,
            (window.innerHeight / 2 - e.clientY) * 2 / window.innerHeight, -1 / Math.tan(22.5 * Math.PI / 180)); //22.5 is half of camera frustum angle 45 degree
        vectorMouse.applyQuaternion(camera.quaternion);
        vectorMouse.normalize();

        var vectorObject = new THREE.Vector3(); //vector from camera to object
        vectorObject.set(object.x - camera.position.x,
            object.y - camera.position.y,
            object.z - camera.position.z);
        vectorObject.normalize();
        if (vectorMouse.angleTo(vectorObject) * 180 / Math.PI < 1) {
            //mouse's position is near object's position
            alert("clicked");
        }
    }

    addEvent = function() {
        window.addEventListener('mousemove', this.onMouseMove, false);
    }
}