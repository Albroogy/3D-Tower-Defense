import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import "@babylonjs/loaders/glTF";
import { Engine, Scene, ArcRotateCamera, Vector3, HemisphericLight, Mesh, MeshBuilder, StandardMaterial, Color3 } from "@babylonjs/core";

/*
    This class has a position and generates every frame some enemies moving towards the center of the world
*/
class Spawner
{
    ///...
}

class App {
    constructor() {
        // create the canvas html element and attach it to the webpage
        var canvas = document.createElement("canvas");
        canvas.style.width = "100%";
        canvas.style.height = "100%";
        canvas.id = "gameCanvas";
        document.body.appendChild(canvas);

        // initialize babylon scene and engine
        var engine = new Engine(canvas, true);
        var scene = new Scene(engine);

        var camera: ArcRotateCamera = new ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 4, 10, Vector3.Zero(), scene);
        camera.attachControl(canvas, true);
        camera.position.y += 500;
        var light1: HemisphericLight = new HemisphericLight("light1", new Vector3(1, 1, 0), scene);
        var sphere: Mesh = MeshBuilder.CreateSphere("sphere", { diameter: 1 }, scene);


        const ground = MeshBuilder.CreateGround("ground", {width:100, height:100}, scene);

        const towerMaterial = new StandardMaterial("towerMaterial", scene);
        towerMaterial.diffuseColor = new Color3(1, 0, 0);

        
        const enemyMaterial = new StandardMaterial("towerMaterial", scene);
        enemyMaterial.diffuseColor = new Color3(0, 1, 1);
        sphere.material = enemyMaterial;

        const tower = MeshBuilder.CreateBox("tower1", {
            width: 0.5,
            depth: 0.5,
            height: 2.5
        }, scene);
        tower.position.y = 1.25;
        tower.material = towerMaterial;

        // hide/show the Inspector
        window.addEventListener("keydown", (ev) => {
            // Shift+Ctrl+Alt+I
            if (ev.key === 'i') {
                if (scene.debugLayer.isVisible()) {
                    scene.debugLayer.hide();
                } else {
                    scene.debugLayer.show();
                }
            }
        });

        // run the main render loop
        engine.runRenderLoop(() => {
            const dt = engine.getDeltaTime();
            //sphere.position.x += dt / 1000 * 5;
            
            scene.render();
        });
    }
}
new App();