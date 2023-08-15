import { Matrix, Ray, Vector3 } from "@babylonjs/core";
import { ground } from "./app";
import { ButtonBehavior } from "./Behaviors/ButtonBehavior";
import { Card, CardType} from "./Behaviors/CardHandBehavior";
import { TagBehavior } from "./Behaviors/TagBehavior";
import { TimerBehavior } from "./Behaviors/TimerBehavior";
import TowerBehavior from "./Behaviors/TowerBehaviour";
import { addEventListenerCustom, BehaviorName, canvas, ElementType, engine, gold, objects, scene, subtractGold, Tag, TowerAbilitiesType, TowerAttributes, TowerAttributesType } from "./Global";
import UpdateableNode from "./UpdateableNode";

let CardStats: TowerAttributesType = {
    [TowerAttributes.AttackSpeed]: 2.5,
    [TowerAttributes.Health]: 0,
    [TowerAttributes.Damage]: 0,
    [TowerAttributes.ArrowCount]: 0,
    [TowerAttributes.AttackRange]: 100
}

let abilitiesData: TowerAbilitiesType = []

let elementType: ElementType | null = null;
let cost: number | null = null;

type CardDataType = {
    Stats: TowerAttributesType | null;
    Abilities: TowerAbilitiesType | null;
    ElementType: ElementType | null;
    Type: CardType | null;
}

let CardData: CardDataType = {
    Stats: CardStats,
    Abilities: abilitiesData,
    ElementType: null,
    Type: null,
};

const fireCard = new Card(
    CardType.Tower,
    "Fire Tower",
    "Damage: 2\nHealth: 3\nAbility: None",
    "Does fire damage",
    (eventData) => {
        cost = 5
        if (gold >= cost) {
            elementType = ElementType.Fire;
        }
    },
    canvas.width/2 - 150, // positionX
    canvas.height/2 - 150, // positionY
    200, // width in pixels
    300 // height in pixels,
    
);

const waterCard = new Card(
    CardType.Tower,
    "Water Tower",
    "Damage: 2\nHealth: 3\nAbility: None",
    "Does water damage",
    (eventData) => {
        cost = 5
        if (gold >= cost) {
            elementType = ElementType.Water;
        }
    },
    canvas.width/2 - 400, // positionX
    canvas.height/2 - 150, // positionY
    200, // width in pixels
    300 // height in pixels
);

const earthCard = new Card(
    CardType.Tower,
    "Earth Tower",
    "Damage: 2\nHealth: 3\nAbility: None",
    "Does earth damage",
    (eventData) => {
        cost = 5
        if (gold >= cost) {
            elementType = ElementType.Earth;
        }
    },
    canvas.width/2 - 650, // positionX
    canvas.height/2 - 150, // positionY
    200, // width in pixels
    300 // height in pixels
);

const airCard = new Card(
    CardType.Tower,
    "Air Tower",
    "Damage: 2\nHealth: 3\nAbility: None",
    "Does air damage",
    (eventData) => {
        cost = 5
        if (gold >= cost) {
            elementType = ElementType.Air;
        }
    },
    canvas.width/2 - 900, // positionX
    canvas.height/2 - 150, // positionY
    200, // width in pixels
    300 // height in pixels
);

const fastUpgradeCard = new Card(
    CardType.Upgrade,
    "Fast Tower",
    "Damage: 2\nHealth: 3\nAbility: None",
    "Fires quickly",
    (eventData) => {
        cost = 5
        if (gold >= cost) {
            CardData.Stats[TowerAttributes.AttackSpeed] = 20;
            CardData.Type = fastUpgradeCard.cardType;
            elementType = ElementType.Air;
        }
    },
    canvas.width/2 - 1150, // positionX
    canvas.height/2 - 150, // positionY
    200, // width in pixels
    300 // height in pixels
);

const piercingUpgradeCard = new Card(
    CardType.Upgrade,
    "Fast Tower",
    "Damage: 2\nHealth: 3\nAbility: None",
    "Fires quickly",
    (eventData) => {
        cost = 5
        if (gold >= cost) {
            CardData.Type = fastUpgradeCard.cardType;
            CardData.Abilities.push({})
        }
    },
    canvas.width/2 - 1150, // positionX
    canvas.height/2 - 150, // positionY
    200, // width in pixels
    300 // height in pixels
);

export const cards = [fireCard, waterCard, earthCard, airCard, fastUpgradeCard];

/**
 * This function is triggered on pointer up event. It determines if a card has been selected, 
 * if yes it creates a tower of the selected element type at the point where the pointer was lifted.
 * If no card was selected, it does nothing.
 * 
 * @param {PointerEvent} eventData - The event data from the pointer up event.
 */
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

    // Temporary method of determing if a card is an upgrade card, since the code for the actual method isn't working

    if (CardData.Type == CardType.Upgrade) {
        const towerRadius = 1.0; 

        for (const existingTower of objects) { 
            if (Vector3.Distance(existingTower.position, finalPos) < 2 * towerRadius) {
                console.log("The upgrade card is touching a tower");
                const towerBehavior = existingTower.getBehaviorByName(BehaviorName.Tower) as TowerBehavior;
                towerBehavior.stats.attackSpeed = CardData.Stats[TowerAttributes.AttackSpeed];
                console.log(towerBehavior);
            }
        }
    } else {
        finalPos.y = 1.25;
        const tower = new UpdateableNode("TowerNode", scene);
        tower.position = finalPos;
        
        const timerBehavior = new TimerBehavior();
        const towerBehavior = new TowerBehavior(elementType, CardData.Stats, CardData.Abilities);
        const tagBehavior = new TagBehavior([Tag.Tower]);
        const buttonBehavior = new ButtonBehavior(100, 100, gold10);
    
        tower.addBehavior(timerBehavior);
        tower.addBehavior(towerBehavior);
        tower.addBehavior(tagBehavior);
        tower.addBehavior(buttonBehavior);
    
        objects.push(tower);
    }

    elementType = null; 
};

function gold10() {
    subtractGold(10);
}

addEventListenerCustom("pointerup", onPointerUp);