import { TowerCard, UpgradeCard } from "../Card";
import { ElementType, TowerAbility, TowerAttribute, TowerAttributesType, TowerStatAbility } from "../Global";

export const BaseCardStats: TowerAttributesType = {
    [TowerAttribute.AttackSpeed]: 2.5,
    [TowerAttribute.Health]: 100,
    [TowerAttribute.Damage]: 10,
    [TowerAttribute.ArrowCount]: 0,
    [TowerAttribute.AttackRange]: 100
}

export const fireCard = new TowerCard(
    1,
    "Fire Tower",
    "Deals fire damage",
    [],
    ElementType.Fire
)

export const waterCard = new TowerCard(
    1,
    "Water Tower",
    "Deals water damage",
    [],
    ElementType.Water
)

const earthCard = new TowerCard(
    1,
    "Earth Tower",
    "Deals earth damage",
    [],
    ElementType.Earth
);

const airCard = new TowerCard(
    1,
    "Air Tower",
    "Deals air damage",
    [],
    ElementType.Air
);

export const fastUpgradeCard = new UpgradeCard(
    1,
    "Quickfire Upgrade",
    "Shots fire faster",
    [TowerStatAbility.Quickfire]
);

export const piercingUpgradeCard = new UpgradeCard(
    1,
    "Piercing Upgrade",
    "Enables shots to pierce through enemies",
    [TowerAbility.PiercingShots]
);

export const sniperUpgradeCard = new UpgradeCard(
    1,
    "Sniper Upgrade",
    "Enables further range when attacking, with stronger shots but slower speed",
    [TowerStatAbility.SniperMode]
)

export const splashUpgradeCard = new UpgradeCard(
    1,
    "Splash Upgrade",
    "Arrows combust when they hit an enemy",
    [TowerAbility.SplashMode]
)

export const freezeUpgradeCard = new UpgradeCard(
    1,
    "Freeze Upgrade",
    "Arrows combust when they hit an enemy",
    [TowerAbility.Freeze]
)


export const towerCards = [fireCard, waterCard, earthCard, airCard];
export const upgradeCards = [fastUpgradeCard, piercingUpgradeCard, sniperUpgradeCard, splashUpgradeCard, freezeUpgradeCard];