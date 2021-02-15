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

        // Planet info: Weight, diameter, perimeter, current rotation, orbital velocity around Sun, distance from Sun
        var mercuryValues = ["0.330 × 10^24 kg", "4 879 km", "15 329 km", "?", "47.4 km/s", "57.9 × 10^6 km"];
        var venusValues = ["4.87 × 10^24 kg", "12 104 km", "38 025 km", "?", "35.0 km/s", "108.2 × 10^6 km"];
        var earthValues = ["5.97 × 10^24 kg", "12 756 km", "40 075 km", "?", "29.8 km/s", "149.6 × 10^6 km"];
        var marsValues = ["0.642 × 10^24 kg", "6 792 km", "21 344 km", "?", "24.1 km/s", "227.9 × 10^6 km"];
        var jupiterValues = ["1898 × 10^24 kg", "142 984 km", "439 264 km", "?", "13.1 km/s", "778.6 × 10^6 km"];
        var saturnValues = ["568 × 10^24 kg", "120 536 km", "378 675 km", "?", "9.7 km/s", "1433.5 × 10^6 km"];
        var uranusValues = ["86.8 × 10^24 kg", "51 118 km", "160 590 km", "?", "6.8 km/s", "2872.5 × 10^6 km"];
        var neptuneValues = ["102 × 10^24 kg", "49 528 km", "155 600 km", "?", "5.4 km/s", "4495.1 × 10^6 km"];

        if (intersects.length > 0) {
            if (intersects[0].object.name == "Mercury") {
                document.getElementById("planetWeightInput").value = mercuryValues[0];
                document.getElementById("diameterInput").value = mercuryValues[1];
                document.getElementById("perimeterInput").value = mercuryValues[2];
                document.getElementById("currentRotationInput").value = mercuryValues[3];
                document.getElementById("orbitAroundSunInput").value = mercuryValues[4];
                document.getElementById("distanceFromSunInput").value = mercuryValues[5];
            } else if (intersects[0].object.name == "Venus") {
                document.getElementById("planetWeightInput").value = venusValues[0];
                document.getElementById("diameterInput").value = venusValues[1];
                document.getElementById("perimeterInput").value = venusValues[2];
                document.getElementById("currentRotationInput").value = venusValues[3];
                document.getElementById("orbitAroundSunInput").value = venusValues[4];
                document.getElementById("distanceFromSunInput").value = venusValues[5];
            } else if (intersects[0].object.name == "Earth") {
                document.getElementById("planetWeightInput").value = earthValues[0];
                document.getElementById("diameterInput").value = earthValues[1];
                document.getElementById("perimeterInput").value = earthValues[2];
                document.getElementById("currentRotationInput").value = earthValues[3];
                document.getElementById("orbitAroundSunInput").value = earthValues[4];
                document.getElementById("distanceFromSunInput").value = earthValues[5];
            } else if (intersects[0].object.name == "Mars") {
                document.getElementById("planetWeightInput").value = marsValues[0];
                document.getElementById("diameterInput").value = marsValues[1];
                document.getElementById("perimeterInput").value = marsValues[2];
                document.getElementById("currentRotationInput").value = marsValues[3];
                document.getElementById("orbitAroundSunInput").value = marsValues[4];
                document.getElementById("distanceFromSunInput").value = marsValues[5];
            } else if (intersects[0].object.name == "Jupiter") {
                document.getElementById("planetWeightInput").value = jupiterValues[0];
                document.getElementById("diameterInput").value = jupiterValues[1];
                document.getElementById("perimeterInput").value = jupiterValues[2];
                document.getElementById("currentRotationInput").value = jupiterValues[3];
                document.getElementById("orbitAroundSunInput").value = jupiterValues[4];
                document.getElementById("distanceFromSunInput").value = jupiterValues[5];
            } else if (intersects[0].object.name == "Saturn") {
                document.getElementById("planetWeightInput").value = saturnValues[0];
                document.getElementById("diameterInput").value = saturnValues[1];
                document.getElementById("perimeterInput").value = saturnValues[2];
                document.getElementById("currentRotationInput").value = saturnValues[3];
                document.getElementById("orbitAroundSunInput").value = saturnValues[4];
                document.getElementById("distanceFromSunInput").value = saturnValues[5];
            } else if (intersects[0].object.name == "Uranus") {
                document.getElementById("planetWeightInput").value = uranusValues[0];
                document.getElementById("diameterInput").value = uranusValues[1];
                document.getElementById("perimeterInput").value = uranusValues[2];
                document.getElementById("currentRotationInput").value = uranusValues[3];
                document.getElementById("orbitAroundSunInput").value = uranusValues[4];
                document.getElementById("distanceFromSunInput").value = uranusValues[5];
            } else if (intersects[0].object.name == "Neptune") {
                document.getElementById("planetWeightInput").value = neptuneValues[0];
                document.getElementById("diameterInput").value = neptuneValues[1];
                document.getElementById("perimeterInput").value = neptuneValues[2];
                document.getElementById("currentRotationInput").value = neptuneValues[3];
                document.getElementById("orbitAroundSunInput").value = neptuneValues[4];
                document.getElementById("distanceFromSunInput").value = neptuneValues[5];
            }
        }

    }
}