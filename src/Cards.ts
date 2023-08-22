import { Matrix, Ray, Vector3 } from "@babylonjs/core";
import { ground } from "./app";
import { ButtonBehavior } from "./Behaviors/ButtonBehavior";
import { Card, CardType} from "./Behaviors/CardHandBehavior";
import { TagBehavior } from "./Behaviors/TagBehavior";
import { TimerBehavior } from "./Behaviors/TimerBehavior";
import TowerBehavior from "./Behaviors/TowerBehaviour";
import { addEventListenerCustom, BehaviorName, canvas, ElementType, engine, gold, objects, scene, subtractGold, Tag, TowerAbilities, TowerAbilitiesType, TowerAttributes, TowerAttributesType } from "./Global";
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

/**
 * Creates a new card instance.
 * @param type - The type of the card (e.g., `CardType.Tower`).
 * @param title - The title of the card.
 * @param description - The description of the card.
 * @param tooltip - The tooltip of the card.
 * @param action - The action to be executed when the card is used.
 * @param positionX - The x-coordinate of the position of the card.
 * @param positionY - The y-coordinate of the position of the card.
 * @param width - The width of the card.
 * @param height - The height of the card.
 * @returns A new Card instance.
 */
function createCard(
    type: CardType,
    title: string,
    description: string,
    tooltip: string,
    action: (eventData: any) => void, // The type for eventData can be more specific if known
    width: number,
    height: number
): Card {
    return new Card(
        type,
        title,
        description,
        tooltip,
        action,
        width,
        height
    );
}

const startX = canvas.width / 2 - 150;  // Starting X position (example value)
const startY = canvas.height / 2 - 150; // Starting Y position (example value)
const offset = 250;  // Offset distance between each card on the canvas (can be adjusted).

function adjustCardPositions(cards: Card[]): void {
    cards.forEach((cardHolder: Card, index) => {
        cardHolder.setCardLocation((startX + index * offset), startY)
    });
}

const fireCard = createCard(
    CardType.Tower,
    "Fire Tower",
    "Damage: 2\nHealth: 3\nAbility: None",
    "Does fire damage",
    (eventData) => {
        let cost = 5;
        if (gold >= cost) {
            elementType = ElementType.Fire;
        }
    },
    200,
    300
);

const waterCard = createCard(
    CardType.Tower,
    "Water Tower",
    "Damage: 2\nHealth: 3\nAbility: None",
    "Does water damage",
    (eventData) => {
        let cost = 5;
        if (gold >= cost) {
            elementType = ElementType.Water;
        }
    },
    200,
    300
);

const earthCard = createCard(
    CardType.Tower,
    "Earth Tower",
    "Damage: 2\nHealth: 3\nAbility: None",
    "Does earth damage",
    (eventData) => {
        let cost = 5;
        if (gold >= cost) {
            elementType = ElementType.Earth;
        }
    },
    200,
    300
);

const airCard = createCard(
    CardType.Tower,
    "Air Tower",
    "Damage: 2\nHealth: 3\nAbility: None",
    "Does air damage",
    (eventData) => {
        let cost = 5;
        if (gold >= cost) {
            elementType = ElementType.Air;
        }
    },
    200,
    300
);

const fastUpgradeCard = createCard(
    CardType.Upgrade,
    "Fast Upgrade",
    "Damage: 2\nHealth: 3\nAbility: None",
    "Fires quickly",
    (eventData) => {
        let cost = 5;
        if (gold >= cost) {
            CardData.Stats[TowerAttributes.AttackSpeed] = 20;
            CardData.Type = fastUpgradeCard.cardType;
            elementType = ElementType.Air;
        }
    },
    200,
    300
);

const piercingUpgradeCard = createCard(
    CardType.Upgrade,
    "Piercing Upgrade",
    "Damage: 2\nHealth: 3\nAbility: None",
    "Fires quickly",
    (eventData) => {
        let cost = 5;
        if (gold >= cost) {
            CardData.Type = piercingUpgradeCard.cardType;
            CardData.Abilities.push(TowerAbilities.PiercingShots);
            elementType = ElementType.Air;
        }
    },
    200,
    300
);

const TowerCards = {
    "Fire Tower": fireCard,
    "Water Tower": waterCard,
    "Earth Tower": earthCard,
    "Air Tower": airCard,
}

const UpgradeCards = {
    "Piercing Upgrade": piercingUpgradeCard,
    "Faster Upgrade": fastUpgradeCard
}

function getRandomCards(count: number): Card[] {
    // Calculate the number of each type of card based on the distribution
    const towerCount = Math.round(0.6 * count);
    const upgradeCount = count - towerCount;

    // Helper function to get random cards from a dictionary
    function getRandomFromDict(dict: Record<string, Card>, num: number): Card[] {
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

    if (CardData.Type == CardType.Upgrade) {
        const towerRadius = 1.0; 

        for (const existingTower of objects) { 
            if (Vector3.Distance(existingTower.position, finalPos) < 2 * towerRadius) {
                console.log("The upgrade card is touching a tower");
                const towerBehavior = existingTower.getBehaviorByName(BehaviorName.Tower) as TowerBehavior;
                towerBehavior.stats = CardData.Stats;
                towerBehavior.abilities = CardData.Abilities;
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
    
        tower.addBehavior(timerBehavior);
        tower.addBehavior(towerBehavior);
        tower.addBehavior(tagBehavior);
    
        objects.push(tower);
    }

    elementType = null; 
};

function gold10() {
    subtractGold(10);
}

addEventListenerCustom("pointerup", onPointerUp);