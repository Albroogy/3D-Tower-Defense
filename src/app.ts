import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import "@babylonjs/loaders/glTF";
import { Engine, Scene, ArcRotateCamera, Vector3, HemisphericLight, MeshBuilder, StandardMaterial, Matrix, GroundMesh, Ray} from "@babylonjs/core";
import WaveSpawnerBehavior, { SpawnInfo } from "./Behaviors/WaveSpawnerBehavior";
import UpdateableNodeManager from "./UpdateableNodeManager";
import { TagBehavior } from "./Behaviors/TagBehavior";
import UpdateableNode from "./UpdateableNode";
import TowerBehavior from "./Behaviors/TowerBehaviour";
import { BehaviorName, objects, Tag, ElementType, ElementMaterial, ElementColor, KEYS, allPressedKeys, IN_GAME_SECOND, addEventListenerCustom, removeEventListenersOfType, globalDTMultiplier, engine, scene, canvas} from "./Global";
import CollisionSystem from "./Systems/CollisionSystem";
import { Card, CardHandBehavior } from "./Behaviors/CardHandBehavior";
import GameBehavior from "./Behaviors/GameBehavior";
import StateMachineBehavior from "./Behaviors/StateMachineBehavior";
import { generateRandomWave, generateTestingWave } from "./waveData";
import { TimerBehavior } from "./Behaviors/TimerBehavior";
import { UIOverlayBehavior } from "./Behaviors/UIOverlayBehavior";
import { testingLevel } from "./Levels";
import { cards } from "./Cards";

// initialize babylon scene and engine
export let ground: GroundMesh | undefined;

// Game System Initilization

export const gameSystem = new UpdateableNode("GameSystem", scene);

const stateMachineBehavior = new StateMachineBehavior();
gameSystem.addBehavior(stateMachineBehavior);

const cardHand = new CardHandBehavior(cards);
const gameBehavior = new GameBehavior();
const uiOverlayBehavior = new UIOverlayBehavior();

gameSystem.addBehavior(cardHand);
gameSystem.addBehavior(gameBehavior);
gameSystem.addBehavior(uiOverlayBehavior);

class App {
    constructor() {
        for (const element of Object.keys(ElementType)) {
            if (!isNaN(element as any as number)) {
                continue;
            }
            ElementMaterial[ElementType[element]] = new StandardMaterial(`${element}-material`, scene);
            ElementMaterial[ElementType[element]].diffuseColor = ElementColor[ElementType[element]];
            console.log(ElementMaterial);
        }

        var camera: ArcRotateCamera = new ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 4, 10, Vector3.Zero(), scene);
        camera.attachControl(canvas, true);
        camera.position.y += 500;
        var light1: HemisphericLight = new HemisphericLight("light1", new Vector3(1, 1, 0), scene);

        ground = MeshBuilder.CreateGround("ground", {width:100, height:100}, scene);

        // level1();
        testingLevel();

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
        engine.runRenderLoop(updateGameLogic);
    }
}
new App();

// Game loop

export function updateGameLogic() {
    const dt = engine.getDeltaTime() / IN_GAME_SECOND * globalDTMultiplier;
    UpdateableNodeManager.instance.update(dt);
    objects.forEach(object1 => {
        const tag1 = object1.getBehaviorByName(BehaviorName.Tag) as TagBehavior;
        if (!tag1) {
          return;
        }
        const tower = object1 as UpdateableNode;
      
        objects
          .filter(object2 => {
            const tag2 = object2.getBehaviorByName(BehaviorName.Tag) as TagBehavior;
            return tag2 != null && tag2.tags.includes(Tag.Enemy);
          })
          .forEach(object2 => {
            const enemy = object2 as UpdateableNode;
            CollisionSystem.checkObjectsColliding(tower, enemy);
          });
    });
    scene.render();
}