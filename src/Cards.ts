import { Matrix, Ray, Vector3 } from "@babylonjs/core";
import { ground } from "./app";
import { CardType, CardUI} from "./Behaviors/CardHandBehavior";
import { TagBehavior } from "./Behaviors/TagBehavior";
import { TimerBehavior } from "./Behaviors/TimerBehavior";
import TowerBehavior from "./Behaviors/TowerBehaviour";
import { TowerCards, UpgradeCards } from "./Data/CardData";
import { addEventListenerCustom, BehaviorName, canvas, ElementType, engine, objects, scene, Tag, TowerAbilitiesType, TowerAttribute, TowerAttributesType} from "./Global";
import UpdateableNode from "./UpdateableNode";

export class Card {
    public cost: number;
    public title: string;
    public description: string;
    public attributes: TowerAttributesType;
    public abilities: TowerAbilitiesType;

    constructor(cost: number, title: string, description: string, attributes: TowerAttributesType, abilities: TowerAbilitiesType) {
        this.cost = cost;
        this.title = title;
        this.description = description;
        this.attributes = attributes;
        this.abilities = abilities;
    }

    public play(finalPos: Vector3) {
    
    }
}

export class UpgradeCard extends Card {
    public play(finalPos: Vector3) {
        const towerRadius = 1.0; 

        for (const existingTower of objects) { 
            if (Vector3.Distance(existingTower.position, finalPos) < 2 * towerRadius) {
                console.log("The upgrade card is touching a tower");
                const towerBehavior = existingTower.getBehaviorByName(BehaviorName.Tower) as TowerBehavior;
                towerBehavior.stats = this.attributes;
                towerBehavior.abilities = this.abilities;
                console.log(towerBehavior);
            }
        }
    }
}

export class TowerCard extends Card {
    public elementType: ElementType;

    constructor(cost: number, title: string, description: string, attributes: TowerAttributesType, abilities: TowerAbilitiesType, elementType: ElementType) {
        super(cost, title, description, attributes, abilities);

        this.elementType = elementType;
    }

    public play(finalPos: Vector3) {
        const tower = new UpdateableNode("TowerNode", scene);
        tower.position = finalPos;
        
        const timerBehavior = new TimerBehavior();
        const towerBehavior = new TowerBehavior(elementType, this.attributes, this.abilities);
        const tagBehavior = new TagBehavior([Tag.Tower]);
    
        tower.addBehavior(timerBehavior);
        tower.addBehavior(towerBehavior);
        tower.addBehavior(tagBehavior);
    
        objects.push(tower);
    }
}

let CardStats: TowerAttributesType = {
    [TowerAttribute.AttackSpeed]: 2.5,
    [TowerAttribute.Health]: 0,
    [TowerAttribute.Damage]: 0,
    [TowerAttribute.ArrowCount]: 0,
    [TowerAttribute.AttackRange]: 100
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

const startX = canvas.width / 2 - 150;  // Starting X position (example value)
const startY = canvas.height / 2 - 150; // Starting Y position (example value)
const offset = 250;  // Offset distance between each card on the canvas (can be adjusted).

function adjustCardPositions(cards: CardUI[]): void {
    cards.forEach((cardHolder: CardUI, index) => {
        cardHolder.setCardLocation((startX + index * offset), startY)
    });
}



function getRandomCards(count: number): CardUI[] {
    // Calculate the number of each type of card based on the distribution
    const towerCount = Math.round(0.6 * count);
    const upgradeCount = count - towerCount;

    // Helper function to get random cards from a dictionary
    function getRandomFromDict(dict: Record<string, CardUI>, num: number): CardUI[] {
        const keys = Object.keys(dict);
        const shuffledKeys = keys.sort(() => 0.5 - Math.random());
        return shuffledKeys.slice(0, num).map(key => dict[key]);
    }

    // Get the specified number of random tower and upgrade cards
    const randomTowers = getRandomFromDict(TowerCards, towerCount);
    const randomUpgrades = getRandomFromDict(UpgradeCards, upgradeCount);

    // Combine and return the selected cards
    return [...randomTowers, ...randomUpgrades];
}


export const cards = getRandomCards(5);
adjustCardPositions(cards);


/**
 * This function is triggered on pointer up event. It determines if a card has been selected, 
 * if yes it creates a tower of the selected element type at the point where the pointer was lifted.
 * If no card was selected, it does nothing.
 * 
 * @param {PointerEvent} eventData - The event data from the pointer up event.
 */
const onPointerUp = (eventData: PointerEvent) => {
    if (!CardUI.activelyDraggedCard) {
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

    CardUI.activelyDraggedCard.play(finalPos);
    CardUI.activelyDraggedCard = null;
};


addEventListenerCustom("pointerup", onPointerUp);