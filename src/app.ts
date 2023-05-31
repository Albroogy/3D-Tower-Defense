import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import "@babylonjs/loaders/glTF";
import { Engine, Scene, ArcRotateCamera, Vector3, HemisphericLight, MeshBuilder, StandardMaterial, Matrix, GroundMesh, Ray} from "@babylonjs/core";
import WaveSpawnerBehavior, { EnemyType, SpawnInfo } from "./Behaviors/WaveSpawnerBehavior";
import UpdateableNodeManager from "./UpdateableNodeManager";
import { TagBehavior } from "./Behaviors/TagBehavior";
import UpdateableNode from "./UpdateableNode";
import TowerBehavior from "./Behaviors/TowerBehaviour";
import { BehaviorName, objects, Tag, ElementType, getRandomEnumValue, ElementMaterial, ElementColor, OFFSET } from "./Gobal";
import CollisionSystem from "./Systems/CollisionSystem";
import { AdvancedDynamicTexture, Button, Control, Rectangle, TextBlock } from "@babylonjs/gui";
import { Card, CardHandBehavior } from "./Behaviors/CardHandBehavior";
import GameBehavior from "./Behaviors/GameBehavior";
import StateMachineBehavior from "./Behaviors/StateMachineBehavior";

const enemyParameterMap = {
    [EnemyType.Sphere]: { diameter: 2 },
    [EnemyType.Cube]: { width: 2, height: 2, depth: 2 },
    [EnemyType.Cylinder]: { height: 2, diameterTop: 1, diameterBottom: 1 },
    [EnemyType.Torus]: { diameter: 3, thickness: 0.5 },
    [EnemyType.TorusKnot]: { radius: 2, tube: 0.5, radialSegments: 16, tubularSegments: 100 },
    [EnemyType.Disc]: { radius: 2, tessellation: 20 },
};

const waveElements = {
    0: {
        [ElementType.Fire]: 0.7,
        [ElementType.Water]: 0.3,
        [ElementType.Air]: 0,
        [ElementType.Earth]: 0,
        [ElementType.Metal]: 0
    },
    10: {
        [ElementType.Fire]: 0.6,
        [ElementType.Water]: 0.4,
        [ElementType.Air]: 0,
        [ElementType.Earth]: 0,
        [ElementType.Metal]: 0
    },
    20: {
        [ElementType.Fire]: 0.5,
        [ElementType.Water]: 0.3,
        [ElementType.Air]: 0.1,
        [ElementType.Earth]: 0.05,
        [ElementType.Metal]: 0.05
    },
    30: {
        [ElementType.Fire]: 0.4,
        [ElementType.Water]: 0.3,
        [ElementType.Air]: 0.2,
        [ElementType.Earth]: 0.05,
        [ElementType.Metal]: 0.05
    },
    40: {
        [ElementType.Fire]: 0.3,
        [ElementType.Water]: 0.2,
        [ElementType.Air]: 0.15,
        [ElementType.Earth]: 0.2,
        [ElementType.Metal]: 0.15
    },
    50: {
        [ElementType.Fire]: 0.25,
        [ElementType.Water]: 0.25,
        [ElementType.Air]: 0.25,
        [ElementType.Earth]: 0.15,
        [ElementType.Metal]: 0.1
    },
    60: {
        [ElementType.Fire]: 0.2,
        [ElementType.Water]: 0.2,
        [ElementType.Air]: 0.1,
        [ElementType.Earth]: 0.15,
        [ElementType.Metal]: 0.35
    },
    70: {
        [ElementType.Fire]: 0.1,
        [ElementType.Water]: 0.1,
        [ElementType.Air]: 0.3,
        [ElementType.Earth]: 0.25,
        [ElementType.Metal]: 0.25
    },
    80: {
        [ElementType.Fire]: 0.1,
        [ElementType.Water]: 0.25,
        [ElementType.Air]: 0.25,
        [ElementType.Earth]: 0.2,
        [ElementType.Metal]: 0.2
    },
    90: {
        [ElementType.Fire]: 0.2,
        [ElementType.Water]: 0.15,
        [ElementType.Air]: 0.1,
        [ElementType.Earth]: 0.35,
        [ElementType.Metal]: 0.2
    },
    100: {
        [ElementType.Fire]: 0.15,
        [ElementType.Water]: 0.15,
        [ElementType.Air]: 0.25,
        [ElementType.Earth]: 0.25,
        [ElementType.Metal]: 0.2
    }
}

function generateRandomWave(waveLength: number, waveNumber: number): Array<SpawnInfo> {
    const wave: Array<SpawnInfo> = [];

    const elementCounts = calculateElementCounts(waveNumber, waveLength);
  
    for (let i = 1; i <= waveLength; i++) {
        const enemyType = getRandomEnumValue(EnemyType);

        let health: number;

        switch (enemyType) {
            case EnemyType.Sphere:
                health = 2;
                break;
            case EnemyType.Cube:
                health = 1;
                break;
            case EnemyType.Cylinder:
                health = 3;
                break;
            case EnemyType.Torus:
                health = 5;
                break;
            case EnemyType.TorusKnot:
                health = 15;
                break;
            case EnemyType.Disc:
                health = 10;
                break;
            default:
                health = 2;
                // console.log("DEFAULT");
        }

        let element = getEnemyElement(elementCounts, i);

        // console.log(element);

        const spawnInfo: SpawnInfo = {
            parameters: enemyParameterMap[enemyType],
            type: enemyType,
            health: health,
            element: element
        };
    
        wave.push(spawnInfo);
    }
  
    return wave;
}

type ElementCount = {
    elementType: string;
    elementCount: number;
};

function calculateElementCounts(waveIndex: number, totalEnemies: number): ElementCount[] {
    let nextWaveThreshold = Math.ceil(waveIndex / 10) * 10;
    let pastWaveThreshold = Math.floor(waveIndex / 10) * 10;

    if (nextWaveThreshold < 10) {
        nextWaveThreshold = 10;
    }

    const elements = [];

    for (const element of Object.keys(ElementType)) {
        if (!isNaN(element as any as number)) {
            continue;
        }

        elements.push(ElementType[element]);
    }

    const elementCounts = elements.map(elementType => {
        const elementPercentage = (waveIndex - pastWaveThreshold + OFFSET) * (waveElements[nextWaveThreshold][elementType] - waveElements[pastWaveThreshold][elementType]) / 10;
        // console.log((waveIndex - pastWaveThreshold + OFFSET), (waveElements[nextWaveThreshold][elementType]) / 10);
        const elementCount = Math.floor(totalEnemies * elementPercentage);
        return { elementType, elementCount};
    });

    return elementCounts;
}

function getEnemyElement(elementCounts: ElementCount[], enemyIndex: number): ElementType {
    let cumulativeCount = 0;
    for (const { elementType, elementCount } of elementCounts) {
        cumulativeCount += elementCount;
        if (enemyIndex < cumulativeCount) {
            return ElementType[elementType];
        }
    }
}


// create the canvas html element and attach it to the webpage
export const canvas = document.createElement("canvas");
canvas.style.width = "100%";
canvas.style.height = "100%";
canvas.id = "gameCanvas";
document.body.appendChild(canvas);

// initialize babylon scene and engine
export const engine = new Engine(canvas, true);
export const scene = new Scene(engine);
export let ground: GroundMesh | undefined;

class App {
    constructor() {
        for (const element of Object.keys(ElementType)) {
            if (!isNaN(element as any as number)) {
                continue;
            }
            ElementMaterial[ElementType[element]] = new StandardMaterial(`${element}-material`, scene);
            ElementMaterial[ElementType[element]].diffuseColor = ElementColor[ElementType[element]];
        }

        var camera: ArcRotateCamera = new ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 4, 10, Vector3.Zero(), scene);
        camera.attachControl(canvas, true);
        camera.position.y += 500;
        var light1: HemisphericLight = new HemisphericLight("light1", new Vector3(1, 1, 0), scene);

        ground = MeshBuilder.CreateGround("ground", {width:100, height:100}, scene);



        //const spawner = new Spawner("sphere", { diameter: 1 }, { x: 20, y: 10, z: 0 }, 1, scene, enemyMaterial); // spawn an enemy every second
        //spawner.start(); // start spawning enemies

        const sphereEnemy: SpawnInfo = {parameters: { diameter: 1 }, type: EnemyType.Sphere, health: 2, element: ElementType.Metal};
        const sphereEnemy2: SpawnInfo = {parameters: { diameter: 1 }, type: EnemyType.Sphere, health: 2, element: ElementType.Air};
        const cubeEnemy: SpawnInfo = {parameters: {size: 0.5}, type: EnemyType.Cube, health: 3, element: ElementType.Water};
        const cubeEnemy2: SpawnInfo = {parameters: {width: 0.5, depth: 0.5, height: 2.5},  type: EnemyType.Cube, health: 3, element: ElementType.Fire};

        const waves: Array<Array<SpawnInfo>> = [
        ]

        let waveSize = 0;

        for (let i = 0; i < 100; i++) {
            waveSize += 3;

            const wave = generateRandomWave(waveSize, i);

            waves.push(wave);
        }

        console.log(waves)

        const spawner2 = new UpdateableNode("waveSpawner", scene);
        spawner2.position.x = -20;
        const spawnerBehavior = new WaveSpawnerBehavior();
        spawnerBehavior.waveInfo = waves;
        spawner2.addBehavior(spawnerBehavior);

        const tower = new UpdateableNode("tower1", scene);
        tower.position.y = 1.25;
        tower.position.x = -10;
        tower.position.z = 10;
        const towerBehavior = new TowerBehavior(2.5, 100, ElementType.Fire);
        const tagBehavior = new TagBehavior([Tag.Tower]);
        tower.addBehavior(towerBehavior);
        tower.addBehavior(tagBehavior);


       //const tower2 = new UpdateableNode("tower2", scene);
       //tower2.position.y = 1.25;
       //tower2.position.x = 10;
       //tower2.position.z = 10;
       //const towerBehavior2 = new TowerBehavior(2.5, 100, ElementType.Water);
       //const tagBehavior2 = new TagBehavior([Tag.Tower]);
       //tower2.addBehavior(towerBehavior2);
       //tower2.addBehavior(tagBehavior2);

       //
       //const tower3 = new UpdateableNode("tower3", scene);
       //tower3.position.y = 1.25;
       //tower3.position.x = 10;
       //tower3.position.z = -10;
       //tower3.addBehavior(new TowerBehavior(2.5, 100, ElementType.Air));
       //tower3.addBehavior(new TagBehavior([Tag.Tower]));
       //
       //const tower4 = new UpdateableNode("tower4", scene);
       //tower4.position.y = 1.25;
       //tower4.position.x = -10;
       //tower4.position.z = -10;
       //tower4.addBehavior(new TowerBehavior(2.5, 100, ElementType.Earth));
       //tower4.addBehavior(new TagBehavior([Tag.Tower]));

        objects.push(tower);
        //objects.push(tower2);
        //objects.push(tower3);
        //objects.push(tower4);

        const GameSystem = new UpdateableNode("gameSystem", scene);

        // setTimeout(() => {
        //     const fireCard = new Card(
        //         "Fire Tower",
        //         "Damage: 2\nHealth: 3\nAbility: None",
        //         "Does fire damage",
        //         (eventData) => {
        //             canvas.addEventListener("pointermove", onPointerMove);
        //             canvas.addEventListener("pointerup", onPointerUp);
        //         },
        //         canvas.width/2 - 150, // positionX
        //         canvas.height/2 - 150, // positionY
        //         200, // width in pixels
        //         300 // height in pixels
        //     );
    
        //     const waterCard = new Card(
        //         "Water Tower",
        //         "Damage: 2\nHealth: 3\nAbility: None",
        //         "Does fire damage",
        //         (eventData) => {
        //             canvas.addEventListener("pointermove", onPointerMove);
        //             canvas.addEventListener("pointerup", onPointerUp);
        //         },
        //         canvas.width/2 + 250, // positionX
        //         canvas.height/2 - 150, // positionY
        //         200, // width in pixels
        //         300 // height in pixels
        //     );
    
        //     const cards = [fireCard, waterCard];
    
        //     const cardHand = new CardHandBehavior(cards);
        //     const gameBehavior = new GameBehavior();
    
        //     GameSystem.addBehavior(cardHand);
        //     GameSystem.addBehavior(gameBehavior);
        // }, 2000);


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
                const tag1 = object1.getBehaviorByName(BehaviorName.Tag) as TagBehavior;
                if (!tag1) {
                    continue;
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
            }
            //sphere.position.x += dt / 1000 * 5;
            scene.render();
        });
    }
}
new App();
  


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

function onPointerMove(eventData: PointerEvent) {
    const mouseX = eventData.clientX;
    const mouseY = eventData.clientY;

    // Update the card position
    // card.left = `${mouseX}px`;
    // card.top = `${mouseY}px`;
};

const onPointerUp = (elementType: ElementType, eventData: PointerEvent) => {
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
    finalPos.y = 1.25;
    const tower = new UpdateableNode("TowerNode", scene);
    tower.position = finalPos;
    const tagBehavior = new TagBehavior([Tag.Tower]);
    const towerBehavior = new TowerBehavior(2.5, 100, elementType);
    tower.addBehavior(towerBehavior);
    tower.addBehavior(tagBehavior);

    objects.push(tower);
};


const GameSystem = new UpdateableNode("gameSystem", scene);

const fireCard = new Card(
    "Fire Tower",
    "Damage: 2\nHealth: 3\nAbility: None",
    "Does fire damage",
    (eventData) => {
        canvas.addEventListener("pointermove", onPointerMove);
        const pointerUp = onPointerUp.bind(undefined, ElementType.Fire)
        canvas.addEventListener("pointerup", pointerUp);
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
        canvas.addEventListener("pointermove", onPointerMove);
        const pointerUp = onPointerUp.bind(undefined, ElementType.Water)
        canvas.addEventListener("pointerup", pointerUp);
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
        canvas.addEventListener("pointermove", onPointerMove);
        const pointerUp = onPointerUp.bind(undefined, ElementType.Earth)
        canvas.addEventListener("pointerup", pointerUp);
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
        canvas.addEventListener("pointermove", onPointerMove);
        const pointerUp = onPointerUp.bind(undefined, ElementType.Air)
        canvas.addEventListener("pointerup", pointerUp);
    },
    canvas.width/2 - 900, // positionX
    canvas.height/2 - 150, // positionY
    200, // width in pixels
    300 // height in pixels
);

const cards = [fireCard, waterCard, earthCard, airCard];

const stateMachineBehavior = new StateMachineBehavior();
GameSystem.addBehavior(stateMachineBehavior);

const cardHand = new CardHandBehavior(cards);
const gameBehavior = new GameBehavior();

GameSystem.addBehavior(cardHand);
GameSystem.addBehavior(gameBehavior);
