import { CardType, CardUI } from "../Behaviors/CardHandBehavior";
import { Card, TowerCard, UpgradeCard } from "../Cards";
import { ElementType, TowerAbility, TowerAttribute, TowerAttributesType } from "../Global";

// const fireCard = new Card(
//     CardType.Tower,
//     "Fire Tower",
//     "Damage: 2\nHealth: 3\nAbility: None",
//     "Does fire damage",
//     (eventData) => {

//     },
//     200,
//     300
// );

// const waterCard = new Card(
//     CardType.Tower,
//     "Water Tower",
//     "Damage: 2\nHealth: 3\nAbility: None",
//     "Does water damage",
//     (eventData) => {

//     },
//     200,
//     300
// );

// const earthCard = new Card(
//     CardType.Tower,
//     "Earth Tower",
//     "Damage: 2\nHealth: 3\nAbility: None",
//     "Does earth damage",
//     (eventData) => {

//     },
//     200,
//     300
// );

// const airCard = new Card(
//     CardType.Tower,
//     "Air Tower",
//     "Damage: 2\nHealth: 3\nAbility: None",
//     "Does air damage",
//     (eventData) => {

//     },
//     200,
//     300
// );

// const fastUpgradeCard = new Card(
//     CardType.Upgrade,
//     "Fast Upgrade",
//     "Damage: 2\nHealth: 3\nAbility: None",
//     "Fires quickly",
//     (eventData) => {
//         let cost = 5;
//         if (gold >= cost) {
//             CardData.Stats[TowerAttributes.AttackSpeed] = 20;
//             CardData.Type = fastUpgradeCard.cardType;
//             elementType = ElementType.Air;
//         }
//     },
//     200,
//     300
// );

// const piercingUpgradeCard = new Card(
//     CardType.Upgrade,
//     "Piercing Upgrade",
//     "Damage: 2\nHealth: 3\nAbility: None",
//     "Fires quickly",
//     (eventData) => {
//         let cost = 5;
//         if (gold >= cost) {
//             CardData.Type = piercingUpgradeCard.cardType;
//             CardData.Abilities.push(TowerAbilities.PiercingShots);
//             elementType = ElementType.Air;
//         }
//     },
//     200,
//     300
// );

let BaseCardStats: TowerAttributesType = {
    [TowerAttribute.AttackSpeed]: 2.5,
    [TowerAttribute.Health]: 100,
    [TowerAttribute.Damage]: 10,
    [TowerAttribute.ArrowCount]: 0,
    [TowerAttribute.AttackRange]: 100
}

const cardWidth: number = 200
const cardHeight: number = 300

const fireCard = new TowerCard(
    5,
    "Fire Tower",
    "Deals fire damage",
    BaseCardStats,
    [],
    ElementType.Fire
)

const fireCardUI = new CardUI(
    fireCard,
    cardWidth,
    cardHeight
)

const waterCard = new TowerCard(
    5,
    "Water Tower",
    "Deals water damage",
    BaseCardStats,
    [],
    ElementType.Water
)

const waterCardUI = new CardUI(
    waterCard,
    cardWidth,
    cardHeight
)

const earthCard = new TowerCard(
    5,
    "Earth Tower",
    "Deals earth damage",
    BaseCardStats,
    [],
    ElementType.Earth
);

const earthCardUI = new CardUI(
    earthCard,
    cardWidth,
    cardHeight
);

const airCard = new TowerCard(
    5,
    "Air Tower",
    "Deals air damage",
    BaseCardStats,
    [],
    ElementType.Air
);

const airCardUI = new CardUI(
    airCard,
    cardWidth,
    cardHeight
);

const fastUpgradeStats = {
    [TowerAttribute.AttackSpeed]: 2.5,
    [TowerAttribute.Health]: 0,
    [TowerAttribute.Damage]: 0,
    [TowerAttribute.ArrowCount]: 0,
    [TowerAttribute.AttackRange]: 0
}

const fastUpgradeCard = new UpgradeCard(
    5,
    "Quickfire Upgrade",
    "Shots fire faster",
    fastUpgradeStats,
    []
);

const piercingUpgradeCard = new UpgradeCard(
    5,
    "Piercing Upgrade",
    "Enables shots to pierce through enemies",
    {    [TowerAttribute.AttackSpeed]: 0,
        [TowerAttribute.Health]: 0,
        [TowerAttribute.Damage]: 0,
        [TowerAttribute.ArrowCount]: 0,
        [TowerAttribute.AttackRange]: 0},
    [TowerAbility.PiercingShots]
);

const piercingUpgradeCardUI = new CardUI(
    piercingUpgradeCard,
    cardWidth,
    cardHeight
);

const fastUpgradeCardUI = new CardUI(
    fastUpgradeCard,
    cardWidth,
    cardHeight
);

export const TowerCards = {
    "Fire Tower": fireCardUI,
    "Water Tower": waterCardUI,
    "Earth Tower": earthCardUI,
    "Air Tower": airCardUI,
}

export const UpgradeCards = {
    "Piercing Upgrade": piercingUpgradeCardUI,
    "Faster Upgrade": fastUpgradeCardUI
}