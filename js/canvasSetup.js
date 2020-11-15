//ZATIAL NEPOUZITE
class CanvasSetup {
    setScene() {
        let scene = new THREE.Scene();
        return scene;
    }

    setCameraPosition(posX, posY, posZ, cameraView, cameraNear, cameraFar) {
        let camera = new THREE.PerspectiveCamera(cameraView, window.innerWidth / window.innerHeight, cameraNear, cameraFar);
        camera.position.x = posX;
        camera.position.y = posY;
        camera.position.z = posZ;
        return camera;
    }

    setRenderer(bgColor) {
        let renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(bgColor);
        document.body.appendChild(renderer.domElement);
        return renderer;
    }

    setLight(posX, posY, posZ, color, intensity, distance) {
        let sunLight = new THREE.PointLight(color, intensity, distance);
        sunLight.position.set(posX, posY, posZ);
        scene.add(sunLight);
        return sunLight;
    }
}