class PlanetScene extends InitScene {
    constructor() {
        super()
        this.scene = new THREE.Scene();
        this.camera = this.initCamera(this.getWidthOfScene(), this.getHeightOfScene());
        this.renderer = this.initRenderer(this.getWidthOfScene(), this.getHeightOfScene(), true);
        this.pointLight = this.setPointLightOnScene();

        this.createScene();
    }

    createScene() {
        var interactiveScene = document.querySelector('#interativeModelScene');

        const geometry = new THREE.SphereGeometry(2, 20, 20);
        const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
        const sphere = new THREE.Mesh(geometry, material);
        this.scene.add(sphere);
        sphere.position.set(0, 0, 0);

        interactiveScene.appendChild(this.renderer.domElement);
        this.renderer.setClearColor(0xffffff, 10);
        this.renderer.setClearColor(0x000000, 0);
    }

    getWidthOfScene() { return document.querySelector('#interativeModelScene').offsetWidth; }
    getHeightOfScene() { return document.querySelector('#interativeModelScene').offsetHeight; }

    animate() {
        this.renderer.render(this.scene, this.camera);
    }

}

this.interactiveModel = new PlanetScene();

function animate() {
    this.interactiveModel.animate();
    animationFrameOutput = requestAnimationFrame(animate);
}
animate();