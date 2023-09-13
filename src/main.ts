import { Animation } from "@babylonjs/core/Animations";
import { ArcRotateCamera, Vector3, HemisphericLight, MeshBuilder, StandardMaterial, GroundMesh, SceneLoader, AbstractMesh} from "@babylonjs/core";
import UpdateableNodeManager from "./BabylonUpdateable/UpdateableNodeManager";
import { TagBehavior } from "./Behaviors/TagBehavior";
import UpdateableNode from "./BabylonUpdateable/UpdateableNode";
import { BehaviorName, objects, Tag, ElementType, ElementMaterial, ElementColor, IN_GAME_SECOND, globalDTMultiplier, engine, scene, canvas} from "./Global";
import CollisionSystem from "./Systems/CollisionSystem";
import { CardHandBehavior} from "./Behaviors/CardHandBehavior";
import GameBehavior from "./Behaviors/GameBehavior";
import StateMachineBehavior from "./Behaviors/StateMachineBehavior";
import { UIOverlayBehavior } from "./Behaviors/UIOverlayBehavior";
import { testingLevel } from "./Data/LevelData";
import { ActionRunner, Blackboard, ConditionRunner, DecisionTree, NonTerminalDecisionTreeNode, TerminalDecisionTreeNode } from "./Behaviors/DecisionTreeBehaviour";
import WaveSpawner from "./Behaviors/WaveSpawnerBehavior";


// initialize babylon scene and engine
export let ground: GroundMesh | undefined;

// Game System Initilization

export const gameSystem = new UpdateableNode("GameSystem", scene);

const stateMachineBehavior = new StateMachineBehavior();
gameSystem.addBehavior(stateMachineBehavior);

const cardHand = new CardHandBehavior();
const gameBehavior = new GameBehavior();
const uiOverlayBehavior = new UIOverlayBehavior();

gameSystem.addBehavior(cardHand);
gameSystem.addBehavior(gameBehavior);
gameSystem.addBehavior(uiOverlayBehavior);

let skeletalMesh: AbstractMesh | null = null;

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
        const CAMERA_HEIGHT_OFFSET = 500;
        camera.position.y += CAMERA_HEIGHT_OFFSET;
        var lightSource: HemisphericLight = new HemisphericLight("light1", new Vector3(1, 1, 0), scene);

        ground = MeshBuilder.CreateGround("ground", {width:100, height:100}, scene);

        Animation.AllowMatricesInterpolation = true;
        SceneLoader.ImportMesh("", "./assets/meshes/", "dummy3.babylon", scene, function (newMeshes, particleSystems, skeletons) {
            skeletalMesh = newMeshes[0];
            const skeleton = skeletons[0];
            
            const walkRange = skeleton.getAnimationRange("YBot_Walk");
            
            const walkAnim = scene.beginWeightedAnimation(skeleton, walkRange.from, walkRange.to, 1, true);
            walkAnim.syncWith(null);
            console.log(walkRange, walkAnim);
        });

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
    

    if (skeletalMesh) {
        skeletalMesh.position.addInPlace(skeletalMesh.forward.scale(1 * dt));
        skeletalMesh.rotate(Vector3.Up(), 5 * dt);
    }
    scene.render();
}



let currentWave = 0;

const CheckSmallWaveIndex: ConditionRunner = (board: Blackboard) => currentWave < 3;
const CheckBigWaveIndex: ConditionRunner = (board: Blackboard) => currentWave >= 3;
const printAction1: ActionRunner = (board: Blackboard) => console.log(1);
const printAction2: ActionRunner = (board: Blackboard) => console.log(2);

const root = new NonTerminalDecisionTreeNode();
const actionNode1 = new TerminalDecisionTreeNode();
actionNode1.action = printAction1;
const actionNode2 = new TerminalDecisionTreeNode();
actionNode2.action = printAction2;

root.children = [actionNode1, actionNode2];
root.childrenCondition = [CheckSmallWaveIndex, CheckBigWaveIndex];

const tree = new DecisionTree();
tree.root = root;
const board: Blackboard = {};
setInterval(() => {
    console.log("current wave",currentWave, "chosen action---");
    tree.evaluate(board)(board);
    currentWave++;
}, 2500);
