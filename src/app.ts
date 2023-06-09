import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import "@babylonjs/loaders/glTF";
import { Engine, Scene, ArcRotateCamera, Vector3, HemisphericLight, MeshBuilder, StandardMaterial, Matrix, GroundMesh, Ray} from "@babylonjs/core";
import WaveSpawnerBehavior, { SpawnInfo } from "./Behaviors/WaveSpawnerBehavior";
import UpdateableNodeManager from "./UpdateableNodeManager";
import { TagBehavior } from "./Behaviors/TagBehavior";
import UpdateableNode from "./UpdateableNode";
import TowerBehavior from "./Behaviors/TowerBehaviour";
import { BehaviorName, objects, Tag, ElementType, ElementMaterial, ElementColor, KEYS, allPressedKeys, IN_GAME_SECOND, addEventListenerCustom, removeEventListenersOfType} from "./Gobal";
import CollisionSystem from "./Systems/CollisionSystem";
import { Card, CardHandBehavior } from "./Behaviors/CardHandBehavior";
import GameBehavior from "./Behaviors/GameBehavior";
import StateMachineBehavior from "./Behaviors/StateMachineBehavior";
import { generateRandomWave, generateTestingWave } from "./waveData";
import { TimerBehavior } from "./Behaviors/TimerBehavior";
import { UIOverlayBehavior } from "./Behaviors/UIOverlayBehavior";

// create the canvas html element and attach it to the webpage
export const canvas = document.createElement("canvas");
canvas.style.width = "100%";
canvas.style.height = "100%";
canvas.id = "gameCanvas";
document.body.appendChild(canvas);

export const engine = new Engine(canvas, true);
export const scene = new Scene(engine);

// Key Information
window.addEventListener("keydown", function (event) {
    allPressedKeys[event.keyCode] = true;

    if (event.keyCode === KEYS.P) {
        if (globalDTMultiplier == 0) {
            globalDTMultiplier = 1;
        } else {
            globalDTMultiplier = 0;
        }
    }

    if (event.keyCode === KEYS.Plus) {
        globalDTMultiplier *= 2;
    }

    if (event.keyCode === KEYS.Minus) {
        globalDTMultiplier /= 2;
    }

    if (event.keyCode === KEYS.ZERO) {
        globalDTMultiplier = 1;
    }

});
window.addEventListener("keyup", function (event) {
    allPressedKeys[event.keyCode] = false;
});

// initialize babylon scene and engine
export let ground: GroundMesh | undefined;

let globalDTMultiplier = 1;

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

let elementType: ElementType | null = null;
const fireCard = new Card(
    "Fire Tower",
    "Damage: 2\nHealth: 3\nAbility: None",
    "Does fire damage",
    (eventData) => {
        elementType = ElementType.Fire;
    },
    canvas.width/2 - 150, // positionX
    canvas.height/2 - 150, // positionY
    200, // width in pixels
    300 // height in pixels
);

const waterCard = new Card(
    "Water Tower",
    "Damage: 2\nHealth: 3\nAbility: None",
    "Does water damage",
    (eventData) => {
        elementType = ElementType.Water;
    },
    canvas.width/2 - 400, // positionX
    canvas.height/2 - 150, // positionY
    200, // width in pixels
    300 // height in pixels
);

const earthCard = new Card(
    "Earth Tower",
    "Damage: 2\nHealth: 3\nAbility: None",
    "Does earth damage",
    (eventData) => {
        elementType = ElementType.Earth;
    },
    canvas.width/2 - 650, // positionX
    canvas.height/2 - 150, // positionY
    200, // width in pixels
    300 // height in pixels
);

const airCard = new Card(
    "Air Tower",
    "Damage: 2\nHealth: 3\nAbility: None",
    "Does air damage",
    (eventData) => {
        elementType = ElementType.Air;
    },
    canvas.width/2 - 900, // positionX
    canvas.height/2 - 150, // positionY
    200, // width in pixels
    300 // height in pixels
);

const cards = [fireCard, waterCard, earthCard, airCard];

const gameSystem = new UpdateableNode("GameSystem", scene);

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

const onPointerUp = (eventData: PointerEvent) => {
    if (elementType == null) {
        // Nothing to do, no card has been selected
        return;
    }

    // Get the mouse position relative to the canvas
    let r: Ray = Ray.CreateNew(scene.pointerX, scene.pointerY,
        engine.getRenderWidth(),
        engine.getRenderHeight(),
        Matrix.Identity(),
        scene.getViewMatrix(),
        scene.getProjectionMatrix()
    );
    const pickingInfo = r.intersectsMesh(ground);
    const finalPos = pickingInfo.pickedPoint;
    if (!finalPos) {
        return;
    }
    finalPos.y = 1.25;
    const tower = new UpdateableNode("TowerNode", scene);
    tower.position = finalPos;
    
    const timerBehavior = new TimerBehavior();
    const towerBehavior = new TowerBehavior(2.5, 100, elementType);
    const tagBehavior = new TagBehavior([Tag.Tower]);

    tower.addBehavior(timerBehavior);
    tower.addBehavior(towerBehavior);
    tower.addBehavior(tagBehavior);

    objects.push(tower);

    elementType = null;
};

// TODO: MOVE TO A UI FILE AND IN A REASONABLE FUNCTION
addEventListenerCustom("pointerup", onPointerUp);

function level1() {
    const waves: Array<Array<SpawnInfo>> = [
    ]

    let waveSize = 3;

    for (let i = 0; i < 100; i++) {
        const wave = generateRandomWave(waveSize, i);

        waves.push(wave);

        waveSize += 1;
    }

    console.log(waves)

    const spawner = new UpdateableNode("WaveSpawner", scene);
    spawner.position.x = -20;
    const spawnerBehavior = new WaveSpawnerBehavior();
    spawnerBehavior.waveInfo = waves;
    const spawnerTimerBehavior = new TimerBehavior();
    spawner.addBehavior(spawnerTimerBehavior);
    spawner.addBehavior(spawnerBehavior);
    spawner.parent = gameSystem;

    const tower = new UpdateableNode("tower1", scene);
    tower.position.y = 1.25;
    tower.position.x = -10;
    tower.position.z = 10;
    const towerBehavior = new TowerBehavior(2.5, 100, ElementType.Fire);
    const timerBehavior = new TimerBehavior();
    const tagBehavior = new TagBehavior([Tag.Tower]);
    tower.addBehavior(timerBehavior);
    tower.addBehavior(towerBehavior);
    tower.addBehavior(tagBehavior);


    const tower2 = new UpdateableNode("tower2", scene);
    tower2.position.y = 1.25;
    tower2.position.x = 10;
    tower2.position.z = 10;
    const towerBehavior2 = new TowerBehavior(2.5, 100, ElementType.Water);
    const timerBehavior2 = new TimerBehavior();
    const tagBehavior2 = new TagBehavior([Tag.Tower]);
    tower2.addBehavior(timerBehavior2);
    tower2.addBehavior(towerBehavior2);
    tower2.addBehavior(tagBehavior2);

    
    const tower3 = new UpdateableNode("tower3", scene);
    tower3.position.y = 1.25;
    tower3.position.x = 10;
    tower3.position.z = -10;
    const timerBehavior3 = new TimerBehavior();
    tower3.addBehavior(timerBehavior3);
    tower3.addBehavior(new TowerBehavior(2.5, 100, ElementType.Air));
    tower3.addBehavior(new TagBehavior([Tag.Tower]));
    
    const tower4 = new UpdateableNode("tower4", scene);
    tower4.position.y = 1.25;
    tower4.position.x = -10;
    tower4.position.z = -10;
    const timerBehavior4 = new TimerBehavior();
    tower4.addBehavior(timerBehavior4);
    tower4.addBehavior(new TowerBehavior(2.5, 100, ElementType.Earth));
    tower4.addBehavior(new TagBehavior([Tag.Tower]));

    objects.push(tower);
    objects.push(tower2);
    objects.push(tower3);
    objects.push(tower4);
}

function testingLevel() {
    const waves: Array<Array<SpawnInfo>> = [];

    const waveSize = 5;

    for (let i = 0; i < 100; i++) {
        const wave = generateTestingWave(waveSize);

        waves.push(wave);
    }

    console.log(waves);

    const spawner = new UpdateableNode("WaveSpawner", scene);
    spawner.position.x = -20;
    const spawnerBehavior = new WaveSpawnerBehavior();
    spawnerBehavior.waveInfo = waves;
    const spawnerTimerBehavior = new TimerBehavior();
    spawner.addBehavior(spawnerTimerBehavior);
    spawner.addBehavior(spawnerBehavior);
    spawner.parent = gameSystem;

    const waterTower = new UpdateableNode("waterTower", scene);
    waterTower.position.x = 5;
    waterTower.position.y = 1.25;
    const waterTowerBehavior = new TowerBehavior(2.5, 100, ElementType.Water);
    const waterTowerTagBehavior = new TagBehavior([Tag.Tower]);
    const timerBehavior = new TimerBehavior();
    waterTower.addBehavior(timerBehavior);
    waterTower.addBehavior(waterTowerBehavior);
    waterTower.addBehavior(waterTowerTagBehavior);

    objects.push(waterTower);
}