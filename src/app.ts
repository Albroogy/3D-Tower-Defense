import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import "@babylonjs/loaders/glTF";
import { Engine, Scene, ArcRotateCamera, Vector3, HemisphericLight, Mesh, MeshBuilder, StandardMaterial, Color3, TransformNode } from "@babylonjs/core";
import { AdvancedDynamicTexture, Button, TextBlock, Rectangle } from "@babylonjs/gui";
import { Control } from "@babylonjs/gui/2D/controls/control";
import WaveSpawnerBehavior, { EnemyType } from "./Behavior/WaveSpawnerBehavior";
import UpdateableNodeManager from "./UpdateableNodeManager";
import EnemyBehavior from "./Behavior/EnemyBehavior";
import { TagBehavior } from "./Behavior/TagBehavior";
import UpdateableNode from "./UpdateableNode";
import TowerBehavior from "./Behavior/TowerBehaviour";
import { BehaviorName, objects, Tag, ElementType } from "./Gobal";
import CollisionSystem from "./Systems/CollisionSystem";

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



        //const spawner = new Spawner("sphere", { diameter: 1 }, { x: 20, y: 10, z: 0 }, 1, scene, enemyMaterial); // spawn an enemy every second
        //spawner.start(); // start spawning enemies

        const sphereEnemy = {parameters: { diameter: 1 }, type: EnemyType.SphereEnemy, health: 2, element: ElementType.Metal};
        const sphereEnemy2 = {parameters: { diameter: 1 }, type: EnemyType.SphereEnemy, health: 2, element: ElementType.Air};
        const cubeEnemy = {parameters: {width: 0.5, depth: 0.5, height: 2.5}, type: EnemyType.CubeEnemy, health: 3, element: ElementType.Water};
        const cubeEnemy2 = {parameters: {width: 0.5, depth: 0.5, height: 2.5},  type: EnemyType.CubeEnemy, health: 3, element: ElementType.Fire};

        const waves = [
            [sphereEnemy, sphereEnemy, sphereEnemy, sphereEnemy2, sphereEnemy2],
            [cubeEnemy, cubeEnemy, cubeEnemy],
            [sphereEnemy, sphereEnemy, sphereEnemy, cubeEnemy, cubeEnemy, cubeEnemy],
            [cubeEnemy2, cubeEnemy2, cubeEnemy2, cubeEnemy, cubeEnemy],
            [sphereEnemy, sphereEnemy, sphereEnemy, sphereEnemy, sphereEnemy, sphereEnemy, sphereEnemy, sphereEnemy, sphereEnemy, sphereEnemy],
        ]

        const spawner2 = new UpdateableNode("waveSpawner", scene);
        spawner2.position.x = -20;
        const spawnerBehavior = new WaveSpawnerBehavior();
        spawnerBehavior.waveInfo = waves;
        spawner2.addBehavior(spawnerBehavior);

        const towerMesh = MeshBuilder.CreateBox("towerMesh1", {
            width: 0.5,
            depth: 0.5,
            height: 2.5
        }, scene);

        const tower = new UpdateableNode("tower1", scene);
        tower.position.y = 1.25;
        const towerBehavior = new TowerBehavior(5, 10, ElementType.Fire, towerMesh);
        const tagBehavior = new TagBehavior([Tag.Tower]);
        tower.addBehavior(towerBehavior);
        tower.addBehavior(tagBehavior);

        objects.push(tower);

        const tower2 = new UpdateableNode("tower2", scene);
        tower2.position.y = 1.25;
        tower2.position.z = 5;
        const towerBehavior2 = new TowerBehavior(5, 10, ElementType.Water, towerMesh);
        const tagBehavior2 = new TagBehavior([Tag.Tower]);
        tower2.addBehavior(towerBehavior2);
        tower2.addBehavior(tagBehavior2);

        objects.push(tower2);

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
                if (object1.getBehaviorByName(BehaviorName.Tag) != null) {
                    if (object1.getBehaviorByName(BehaviorName.Tag).tags.includes(Tag.Tower)) {
                        const tower = object1 as UpdateableNode;
                        const towerBehavior = object1.getBehaviorByName(BehaviorName.Tower) as TowerBehavior;
                        if (!towerBehavior.target) {
                            for (const object2 of objects) {
                                if (object2.getBehaviorByName(BehaviorName.Tag) != null) {
                                    if (object2.getBehaviorByName(BehaviorName.Tag).tags.includes(Tag.Enemy)) {
                                        const enemy = object2 as UpdateableNode;
                                        if (Math.abs(tower.position.x - enemy.position.x) <= towerBehavior.towerAttackRadius && Math.abs(tower.position.y - enemy.position.y) <= towerBehavior.towerAttackRadius) {
                                            towerBehavior.changeTarget(enemy);
                                        }
                                     }
                                }
                            }
                        }
                    }
                    if (object1.getBehaviorByName(BehaviorName.Tag).tags.includes(Tag.Projectile)) {
                        const tower = object1 as UpdateableNode;
                        for (const object2 of objects) {
                            if (object2.getBehaviorByName(BehaviorName.Tag) != null) {
                                if (object2.getBehaviorByName(BehaviorName.Tag).tags.includes(Tag.Enemy)) {
                                    const enemy = object2 as UpdateableNode;
                                    CollisionSystem.checkObjectsColliding(tower, enemy);
                                }
                            }
                        }
                    }
                }
            }
            //sphere.position.x += dt / 1000 * 5;
            scene.render();
        });
    }
}
new App();

export type Enemy = {
    parameters: Record<string, any>,
    material: StandardMaterial | null,
    type: EnemyType,
    health: number,
}

// function createEnemy(enemy: Enemy, element: ElementType) {
//     const enemy = {
//       parameters: parameters,
//       material: material,
//       type: type,
//       health: health,
//       element: element
//     };
//     return enemy;
//   }

// create the text block and add it to the GUI
// const gui = AdvancedDynamicTexture.CreateFullscreenUI("UI");
// const enemyCountText = new TextBlock("enemyCountText", "Enemies: 0");
// enemyCountText.color = "white";
// enemyCountText.fontSize = 48;
// enemyCountText.top = "20px";
// enemyCountText.left = "20px";
// gui.addControl(enemyCountText);

// const enemiesInWaveText = new TextBlock("enemiesInWaveText", "Enemies in the Wave: 0");
// enemiesInWaveText.color = "white";
// enemiesInWaveText.fontSize = 48;
// enemiesInWaveText.top = "60px"; 
// enemiesInWaveText.left = "20px";
// gui.addControl(enemiesInWaveText);

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