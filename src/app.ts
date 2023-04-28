import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import "@babylonjs/loaders/glTF";
import { Engine, Scene, ArcRotateCamera, Vector3, HemisphericLight, Mesh, MeshBuilder, StandardMaterial, Color3, Space } from "@babylonjs/core";

/*
    This class has a position and generates every frame some enemies moving towards the center of the world
*/

const objects = [];

class Spawner {
    private _timerId: any;
  
    constructor(private _name: string, private _parameters: Record<string, any>, private _location: { x: number, y: number }, private _interval: number, private _scene: Scene, private _material: StandardMaterial | null = null) {
    }
  
    start(): void {
        this._timerId = setInterval(() => {
        const object: Mesh = MeshBuilder.CreateSphere("sphere", this._parameters, this._scene);
        if (this._material) {
            object.material = this._material;
        }
        object.position.x = this._location.x;
        object.position.y = this._location.y;
        const sphereEnemy = new Enemy(this._name, object, 0.1);
        objects.push(sphereEnemy);
        // Spawn the enemy at the spawner's location
        }, this._interval * 1000);
    }
  
    stop(): void {
        clearInterval(this._timerId);
    }
}

class Enemy {
    constructor(private _name: string, private _object: Mesh, private _speed: number) {
    }

    runTowardsCenter(): void {
        const targetPosition = new Vector3(0, 0, 0);
        this._object.lookAt(targetPosition);
        const direction = targetPosition.subtract(this._object.position).normalize();
        this._object.position.x += direction.x * this._speed;
        this._object.position.y += direction.y * this._speed;
    }
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

        const ground = MeshBuilder.CreateGround("ground", {width:100, height:100}, scene);

        const towerMaterial = new StandardMaterial("towerMaterial", scene);
        towerMaterial.diffuseColor = new Color3(1, 0, 0); 
        
        const enemyMaterial = new StandardMaterial("enemyMaterial", scene);
        enemyMaterial.diffuseColor = new Color3(0, 1, 1);

        const spawner = new Spawner("sphere", { diameter: 1 }, { x: 20, y: 0 }, 1, scene, enemyMaterial); // spawn an enemy every 2 seconds
        spawner.start(); // start spawning enemies

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
            for (const object of objects) {
                object.runTowardsCenter();
            }
            //sphere.position.x += dt / 1000 * 5;
            
            scene.render();
        });
    }
}
new App();