import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import "@babylonjs/loaders/glTF";
import { Engine, Scene, ArcRotateCamera, Vector3, HemisphericLight, MeshBuilder, StandardMaterial, Matrix} from "@babylonjs/core";
import WaveSpawnerBehavior, { EnemyType, SpawnInfo } from "./Behavior/WaveSpawnerBehavior";
import UpdateableNodeManager from "./UpdateableNodeManager";
import { TagBehavior } from "./Behavior/TagBehavior";
import UpdateableNode from "./UpdateableNode";
import TowerBehavior from "./Behavior/TowerBehaviour";
import { BehaviorName, objects, Tag, ElementType, getRandomEnumValue, ElementMaterial, ElementColor } from "./Gobal";
import CollisionSystem from "./Systems/CollisionSystem";
import { AdvancedDynamicTexture, Button, Control, Rectangle, TextBlock } from "@babylonjs/gui";

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
                console.log("DEFAULT");
        }

        let element = getEnemyElement(elementCounts, i);

        console.log(element);

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
    const nextWaveThreshold = Math.ceil(waveIndex / 10) * 10;
    const pastWaveThreshold = Math.floor(waveIndex / 10) * 10;

    const elementCounts = Object.keys(ElementType).map(elementType => {
        const elementPercentage = (waveIndex - pastWaveThreshold)  * (waveElements[nextWaveThreshold][elementType] - waveElements[pastWaveThreshold][elementType]) / 10;
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
var canvas = document.createElement("canvas");
canvas.style.width = "100%";
canvas.style.height = "100%";
canvas.id = "gameCanvas";
document.body.appendChild(canvas);

// initialize babylon scene and engine
var engine = new Engine(canvas, true);
var scene = new Scene(engine);

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

        const ground = MeshBuilder.CreateGround("ground", {width:100, height:100}, scene);



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


        const tower2 = new UpdateableNode("tower2", scene);
        tower2.position.y = 1.25;
        tower2.position.x = 10;
        tower2.position.z = 10;
        const towerBehavior2 = new TowerBehavior(2.5, 100, ElementType.Water);
        const tagBehavior2 = new TagBehavior([Tag.Tower]);
        tower2.addBehavior(towerBehavior2);
        tower2.addBehavior(tagBehavior2);

        
        const tower3 = new UpdateableNode("tower3", scene);
        tower3.position.y = 1.25;
        tower3.position.x = 10;
        tower3.position.z = -10;
        tower3.addBehavior(new TowerBehavior(2.5, 100, ElementType.Air));
        tower3.addBehavior(new TagBehavior([Tag.Tower]));
        
        const tower4 = new UpdateableNode("tower4", scene);
        tower4.position.y = 1.25;
        tower4.position.x = -10;
        tower4.position.z = -10;
        tower4.addBehavior(new TowerBehavior(2.5, 100, ElementType.Earth));
        tower4.addBehavior(new TagBehavior([Tag.Tower]));

        objects.push(tower);
        objects.push(tower2);
        objects.push(tower3);
        objects.push(tower4);

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
                if (tag1.tags.includes(Tag.Projectile)) {
                    const tower = object1 as UpdateableNode;
                    for (const object2 of objects) {
                        const tag2 = object2.getBehaviorByName(BehaviorName.Tag) as TagBehavior;
                        if (tag2 != null) {
                            if (tag2.tags.includes(Tag.Enemy)) {
                                const enemy = object2 as UpdateableNode;
                                CollisionSystem.checkObjectsColliding(tower, enemy);
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

const cardsGUI = AdvancedDynamicTexture.CreateFullscreenUI("UI");

class CardUI {
    private guiTexture: AdvancedDynamicTexture;
    private card: Rectangle;

    constructor(
    title: string,
    content: string,
    buttonText: string,
    buttonAction: (eventData: any) => void,
    positionX: number,
    positionY: number,
    width: number,
    height: number
    ) {
    // Create the GUI texture
    this.guiTexture = AdvancedDynamicTexture.CreateFullscreenUI("UI");

    // Create the card rectangle
    this.card = new Rectangle();
    this.card.width = `${width}px`;
    this.card.height = `${height}px`;
    this.card.cornerRadius = 10;
    this.card.color = "white";
    this.card.thickness = 3;
    this.card.background = "linear-gradient(to bottom, #bbbbbb, #ffffff)";
    this.card.paddingBottom = "15px";
    this.card.paddingTop = "10px";
    this.card.left = `${positionX}px`;
    this.card.top = `${positionY}px`;
    this.guiTexture.addControl(this.card);

    // Create the title text block
    const titleBlock = new TextBlock();
    titleBlock.text = title;
    titleBlock.fontSize = "24px";
    titleBlock.color = "black";
    titleBlock.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
    titleBlock.top = 10;
    this.card.addControl(titleBlock);

    // Create the content text block
    const contentBlock = new TextBlock();
    contentBlock.text = content;
    contentBlock.fontSize = "18px";
    contentBlock.color = "black";
    contentBlock.textWrapping = true;
    contentBlock.top = 50;
    contentBlock.left = 5;
    contentBlock.width = 0.9;
    this.card.addControl(contentBlock);

    // Create the button
    const button = Button.CreateSimpleButton("button", buttonText);
    button.width = `${width}px`;
    button.height = `${height}px`;
    button.color = "transparent"; // Make the button text color transparent
    button.background = "transparent"; // Make the button background transparent
    button.cornerRadius = 5;
    button.thickness = 0;
    button.onPointerDownObservable.add(buttonAction);
    button.left = `${(width - button.widthInPixels) / 2}px`;
    button.top = `${(height - button.heightInPixels) / 2}px`;
    this.card.addControl(button);
    }
  }
  
  // Usage:
  const cardUI = new CardUI(
    "Fire Tower",
    "Damage: 2\nHealth: 3\nAbility: None",
    "Does fire damage",
    (eventData) => {
        canvas.addEventListener("pointermove", onPointerMove);
        canvas.addEventListener("pointerup", onPointerUp);
    },
    canvas.width/2 - 150, // positionX
    canvas.height/2 - 150, // positionY
    200, // width in pixels
    300 // height in pixels
  );
  


  
function onPointerMove(eventData: PointerEvent) {
    const mouseX = eventData.clientX;
    const mouseY = eventData.clientY;

    // Update the card position
    // card.left = `${mouseX}px`;
    // card.top = `${mouseY}px`;
};

const onPointerUp = (eventData: PointerEvent) => {
    // Get the mouse position relative to the canvas
    const mousePosition = new Vector3(scene.pointerX, scene.pointerY, 0.99);
    console.log(scene.pointerX, scene.pointerY)
    const pickedPosition = Vector3.Unproject(
        mousePosition,
        engine.getRenderWidth(),
        engine.getRenderHeight(),
        Matrix.Identity(),
        scene.getProjectionMatrix(),
        scene.activeCamera.getWorldMatrix()
    );
    // If the tower is clicked, generate a new UpdateableNode with TowerBehavior
    const tower = new UpdateableNode("TowerNode", scene);
    tower.position = pickedPosition;
    console.log(pickedPosition);
    const tagBehavior = new TagBehavior([Tag.Tower]);
    const towerBehavior = new TowerBehavior(2.5, 100, ElementType.Fire);
    tower.addBehavior(towerBehavior);
    tower.addBehavior(tagBehavior);

    objects.push(tower);
};