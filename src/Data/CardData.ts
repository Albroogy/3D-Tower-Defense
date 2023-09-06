import { TowerCard, UpgradeCard } from "../Card";
import { ElementType, TowerAbility, TowerAttribute, TowerAttributesType, TowerStatAbility } from "../Global";

let BaseCardStats: TowerAttributesType = {
    [TowerAttribute.AttackSpeed]: 2.5,
    [TowerAttribute.Health]: 100,
    [TowerAttribute.Damage]: 10,
    [TowerAttribute.ArrowCount]: 0,
    [TowerAttribute.AttackRange]: 100
}

export const fireCard = new TowerCard(
    5,
    "Fire Tower",
    "Deals fire damage",
    BaseCardStats,
    [],
    ElementType.Fire
)

export const waterCard = new TowerCard(
    5,
    "Water Tower",
    "Deals water damage",
    BaseCardStats,
    [],
    ElementType.Water
)

const earthCard = new TowerCard(
    5,
    "Earth Tower",
    "Deals earth damage",
    BaseCardStats,
    [],
    ElementType.Earth
);

const airCard = new TowerCard(
    5,
    "Air Tower",
    "Deals air damage",
    BaseCardStats,
    [],
    ElementType.Air
);

const fastUpgradeStats = {
    [TowerAttribute.AttackSpeed]: 2.5,
    [TowerAttribute.Health]: 0,
    [TowerAttribute.Damage]: 0,
    [TowerAttribute.ArrowCount]: 0,
    [TowerAttribute.AttackRange]: 0
}

export const fastUpgradeCard = new UpgradeCard(
    5,
    "Quickfire Upgrade",
    "Shots fire faster",
    [TowerStatAbility.Quickfire]
);

export const piercingUpgradeCard = new UpgradeCard(
    5,
    "Piercing Upgrade",
    "Enables shots to pierce through enemies",
    [TowerAbility.PiercingShots]
);

export const sniperUpgradeCard = new UpgradeCard(
    5,
    "Sniper Upgrade",
    "Enables further range when attacking, with stronger shots but slower speed",
    [TowerStatAbility.SniperMode]
)

export const towerCards = [fireCard, waterCard, earthCard, airCard];
export const upgradeCards = [fastUpgradeCard, piercingUpgradeCard];