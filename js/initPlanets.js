class InitPlanets extends JSONManager {
    constructor() {
        super();
        this.allPlanetDataJSON = super.getPlanetData();
        this.allMoonDataJSON = super.getMoonData();
    }

    getPlanetDataJSON() { return this.allPlanetDataJSON; }
    getMoonDataJSON() { return this.allMoonDataJSON; }

    // Functions fo creating space objects
    // -------------------------------------------------------------------------
    createPlanetObject(diameter) {
        return new THREE.SphereBufferGeometry(diameter, 50, 50);
    }

    setNewMesh(imageSrc) {
        var texture = new THREE.TextureLoader().load(imageSrc);
        var meshMaterial = new THREE.MeshPhongMaterial({ map: texture });
        meshMaterial.receiveShadow = true;
        meshMaterial.castShadow = true;
        return meshMaterial;
    }

    createMesh(planetObject, imageSrc) {
        return new THREE.Mesh(planetObject, this.setNewMesh(imageSrc));
    }

    addMeshToScene(scene, planetsMeshes) {
        for (var i = 0; i < planetsMeshes.length; i++) {
            scene.add(planetsMeshes[i]);
        }
    }

    scaleObjectsByRangeslider(scaleValue, objects) {
        for (var i = 0; i < objects.length; i++) {
            objects[i].scale.set(2 * scaleValue, 2 * scaleValue, 2 * scaleValue);
        }
    }

    // Names for planets on Scene: TextGeometry
    // -------------------------------------------------------------------------
    createTextGeometry(planetsMeshes, planetsNamesOnScene, scene, objectNames, fontSize, startsWith) {
        var geometry, textMesh;
        const loader = new THREE.FontLoader();

        loader.load('node_modules/three/examples/fonts/helvetiker_regular.typeface.json', function(font) {
            var material = new THREE.MeshNormalMaterial();
            material.transparent = false;

            for (i = 0; i < planetsMeshes.length; i++) {
                geometry = new THREE.TextGeometry(objectNames[i], {
                    font: font,
                    size: fontSize,
                    height: 0,
                    bevelEnabled: false
                });
                textMesh = new THREE.Mesh(geometry, material);
                textMesh.setRotationFromAxisAngle(
                    new THREE.Vector3(1, 0, 0),
                    (Math.PI / 2 * 3)
                );

                planetsNamesOnScene.push(textMesh);
                planetsMeshes[i].add(textMesh);
                textMesh.name = startsWith + objectNames[i];
                scene.add(textMesh);
            }
        });
    }
}