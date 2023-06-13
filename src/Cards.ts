import { Matrix, Ray } from "@babylonjs/core";
import { ground } from "./app";
import { Card } from "./Behaviors/CardHandBehavior";
import { TagBehavior } from "./Behaviors/TagBehavior";
import { TimerBehavior } from "./Behaviors/TimerBehavior";
import TowerBehavior from "./Behaviors/TowerBehaviour";
import { addEventListenerCustom, canvas, ElementType, engine, objects, scene, Tag } from "./Global";
import UpdateableNode from "./UpdateableNode";

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

export const cards = [fireCard, waterCard, earthCard, airCard];


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