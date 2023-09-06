import { Vector3 } from "@babylonjs/core";
import { TagBehavior } from "./Behaviors/TagBehavior";
import { TimerBehavior } from "./Behaviors/TimerBehavior";
import TowerBehavior from "./Behaviors/TowerBehaviour";
import { BehaviorName, ElementType, objects, scene, Tag, TowerAbilitiesType, TowerAttribute, TowerAttributesType, TowerStatAbility} from "./Global";
import UpdateableNode from "./BabylonUpdateable/UpdateableNode";

export const TowerAbilityStats = {
    [TowerStatAbility.SniperMode]: {
        [TowerAttribute.AttackSpeed]: - 1,
        [TowerAttribute.Health]: 0,
        [TowerAttribute.Damage]: 0,
        [TowerAttribute.ArrowCount]: 0,
        [TowerAttribute.AttackRange]: 100
    },
    [TowerStatAbility.Quickfire]: {
        [TowerAttribute.AttackSpeed]: 1,
        [TowerAttribute.Health]: 0,
        [TowerAttribute.Damage]: 0,
        [TowerAttribute.ArrowCount]: 0,
        [TowerAttribute.AttackRange]: 0
    }
}

export class Card {
    public cost: number;
    public title: string;
    public description: string;
    public attributes: TowerAttributesType;
    public abilities: TowerAbilitiesType;

    constructor(cost: number, title: string, description: string, abilities: TowerAbilitiesType) {
        this.cost = cost;
        this.title = title;
        this.description = description;
        this.abilities = abilities;
    }

    public play(finalPos: Vector3) {
    
    }
}

export class UpgradeCard extends Card {
    constructor(cost: number, title: string, description: string, abilities: TowerAbilitiesType) {
        super(cost, title, description, abilities);
        const abilityStats = TowerAbilityStats[this.abilities[0]];

        if (abilityStats) {
            this.attributes = abilityStats;
        }
        console.log(abilityStats);
    }
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
        super(cost, title, description, abilities);

        this.elementType = elementType;
        this.attributes = attributes;
    }

    public play(finalPos: Vector3) {
        const tower = new UpdateableNode("TowerNode", scene);
        tower.position = finalPos;
        
        const timerBehavior = new TimerBehavior();
        const towerBehavior = new TowerBehavior(this.elementType, this.attributes, this.abilities);
        const tagBehavior = new TagBehavior([Tag.Tower]);
    
        tower.addBehavior(timerBehavior);
        tower.addBehavior(towerBehavior);
        tower.addBehavior(tagBehavior);
    
        objects.push(tower);
    }
}
