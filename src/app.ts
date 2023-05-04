import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import "@babylonjs/loaders/glTF";
import { Engine, Scene, ArcRotateCamera, Vector3, HemisphericLight, Mesh, MeshBuilder, StandardMaterial, Color3, TransformNode } from "@babylonjs/core";
import { AdvancedDynamicTexture, Button, TextBlock, Rectangle } from "@babylonjs/gui";
import { Control } from "@babylonjs/gui/2D/controls/control";
import WaveSpawnerBehavior, { EnemyType } from "./WaveSpawnerBehavior";
import UpdateableNodeManager from "./UpdateableNodeManager";

/*
    This class has a position and generates every frame some enemies moving towards the center of the world
*/

const objects = [];

class Spawner {
    private _timerId: any;
  
    constructor(private _name: string, private _parameters: Record<string, any>, private _location: { x: number, y: number, z: number }, private _interval: number, private _scene: Scene, private _material: StandardMaterial | null = null) {
    }
  
    start(): void {
        this._timerId = setInterval(() => {
        const object: Mesh = MeshBuilder.CreateSphere("sphere", this._parameters, this._scene);
        if (this._material) {
            object.material = this._material;
        }
        object.position.x = this._location.x
        object.position.y = this._location.y
        object.position.y = this._location.z
        //const sphereEnemy = new Enemy(this._name, object, 0.1);
        //objects.push(sphereEnemy);
        // Spawn the enemy at the spawner's location
        }, this._interval * 1000);
    }
  
    stop(): void {
        clearInterval(this._timerId);
    }
}

class Tower {
    private _timerId: any;

    public target: null | TransformNode = null;
    constructor(private _name: string, public object: Mesh, private _attackSpeed: number, private _towerAttackRadius: number) {
    }
    get towerAttackRadius(){
        return this._towerAttackRadius;
    }

    attackTarget(): void { 
        this._timerId = setInterval(() => {
            const rockMaterial = new StandardMaterial("rockMaterial", this.object._scene);
            rockMaterial.diffuseColor = new Color3(1, 0, 1); 
            
            const rockMesh = MeshBuilder.CreateBox("rock", {
                width: 0.1,
                depth: 0.25,
                height: 0.25
            }, this.object._scene);
            rockMesh.material = rockMaterial;
            
            const targetPosition = this.target.position;
            const direction = targetPosition.subtract(this.object.position).normalize();
            console.log(direction);
            const rock = new Projectile("rock", rockMesh, 20, 10, direction);
            objects.push(rock);
            }, 1000 - this._attackSpeed * 100);
    }

    changeTarget(target: TransformNode) {
        clearInterval(this._timerId);
        this.target = target;
        this.attackTarget()
    }
}

class Projectile {
    constructor(private _name: string, public object: Mesh, private _speed: number, private _damage: number, private _direction: Vector3) {
    }

    move(dt: number): void {
        this.object.position.x += this._direction.x * this._speed * dt;
        this.object.position.z += this._direction.z * this._speed * dt;
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

        const enemyMaterial = new StandardMaterial("enemyMaterial", scene);
        enemyMaterial.diffuseColor = new Color3(0, 1, 1);

        //const spawner = new Spawner("sphere", { diameter: 1 }, { x: 20, y: 10, z: 0 }, 1, scene, enemyMaterial); // spawn an enemy every second
        //spawner.start(); // start spawning enemies

        const sphereEnemy = {parameters: { diameter: 1 }, material: enemyMaterial, type: EnemyType.SphereEnemy};
        const cubeEnemy = {parameters: {width: 0.5, depth: 0.5, height: 2.5}, material: enemyMaterial, type: EnemyType.CubeEnemy};

        const waves = [
            [sphereEnemy, sphereEnemy, sphereEnemy, sphereEnemy, sphereEnemy],
            [cubeEnemy, cubeEnemy, cubeEnemy],
            [sphereEnemy, sphereEnemy, sphereEnemy, cubeEnemy, cubeEnemy, cubeEnemy],
            [cubeEnemy, cubeEnemy, cubeEnemy, cubeEnemy, cubeEnemy],
            [sphereEnemy, sphereEnemy, sphereEnemy, sphereEnemy, sphereEnemy, sphereEnemy, sphereEnemy, sphereEnemy, sphereEnemy, sphereEnemy],
        ]

        const spawner2 = new TransformNode("waveSpawner", scene);
        spawner2.position.x = -20;
        const spawnerBehavior = new WaveSpawnerBehavior();
        spawnerBehavior.enemies = waves[0];
        spawner2.addBehavior(spawnerBehavior);

        const towerMaterial = new StandardMaterial("towerMaterial", scene);
        towerMaterial.diffuseColor = new Color3(1, 0, 0); 
        
        const tower = MeshBuilder.CreateBox("tower1", {
            width: 0.5,
            depth: 0.5,
            height: 2.5
        }, scene);
        tower.position.y = 1.25;
        tower.material = towerMaterial;

        const towerObject = new Tower("tower", tower, 5, 10);

        objects.push(towerObject);

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
            const dt = engine.getDeltaTime() / 1000;
            UpdateableNodeManager.instance.update(dt);
            for (const object1 of objects) {
                if (object1 instanceof Tower) {
                    const tower = object1 as Tower;
                    if (object1.target == null) {
                        for (const object2 of objects) {
                            //if (object2 instanceof Enemy) {
                            //    const enemy = object2 as Enemy;
                            //    if (Math.abs(tower.object.position.x - enemy.object.position.x) <= tower.towerAttackRadius && Math.abs(tower.object.position.y - enemy.object.position.y) <= tower.towerAttackRadius) {
                            //        tower.changeTarget(enemy);
                            //    }
                            //}
                        }
                    }
                }
                //else if (object1 instanceof Enemy){
                //    //object1.runTowardsCenter();
                //}
                else if (object1 instanceof Projectile) {
                    object1.move(dt);
                }
            }
            //sphere.position.x += dt / 1000 * 5;
            scene.render();
        });
    }
}
new App();

// create the text block and add it to the GUI
const gui = AdvancedDynamicTexture.CreateFullscreenUI("UI");
const enemyCountText = new TextBlock("enemyCountText", "Enemies: 0");
enemyCountText.color = "white";
enemyCountText.fontSize = 48;
enemyCountText.top = "20px";
enemyCountText.left = "20px";
gui.addControl(enemyCountText);

const enemiesInWaveText = new TextBlock("enemiesInWaveText", "Enemies in the Wave: 0");
enemiesInWaveText.color = "white";
enemiesInWaveText.fontSize = 48;
enemiesInWaveText.top = "60px"; 
enemiesInWaveText.left = "20px";
gui.addControl(enemiesInWaveText);

// const createCardUI = (title: string, content: string, buttonText: string, buttonAction: () => void) => {
//     // Create the GUI texture
//     const guiTexture = AdvancedDynamicTexture.CreateFullscreenUI("UI");
  
//     // Create the card rectangle
//     const card = new Rectangle();
//     card.width = 0.1;
//     card.height = 0.4;
//     card.cornerRadius = 10;
//     card.color = "white";
//     card.thickness = 3;
//     card.background = "linear-gradient(to bottom, #bbbbbb, #ffffff)";
//     card.paddingBottom = "15px";
//     card.paddingTop = "10px";
//     guiTexture.addControl(card);
  
//     // Create the title text block
//     const titleBlock = new TextBlock();
//     titleBlock.text = title;
//     titleBlock.fontSize = "24px";
//     titleBlock.color = "black";
//     titleBlock.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
//     titleBlock.top = 10;
//     card.addControl(titleBlock);
  
//     // Create the content text block
//     const contentBlock = new TextBlock();
//     contentBlock.text = content;
//     contentBlock.fontSize = "18px";
//     contentBlock.color = "black";
//     contentBlock.textWrapping = true;
//     contentBlock.top = 50;
//     contentBlock.left = 5;
//     contentBlock.width = 0.9;
//     card.addControl(contentBlock);
  
//     // Create the button
//     const button = Button.CreateSimpleButton("button", buttonText);
//     button.width = 0.6;
//     button.height = "40px";
//     button.color = "white";
//     button.background = "linear-gradient(to bottom, #60b347, #1a601a)";
//     button.cornerRadius = 5;
//     button.thickness = 0;
//     button.onPointerClickObservable.add(buttonAction);
//     button.top = 230;
//     button.left = (card.widthInPixels - button.widthInPixels) / 2;
//     card.addControl(button);
//   };
  
//   createCardUI(
//     "Goblin Raider",
//     "Attack: 2\nHealth: 1\nAbility: None",
//     "Add to Deck",
//     () => {
//       console.log("pressed");
//     }
//   );