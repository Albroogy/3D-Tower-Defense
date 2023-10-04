import EnemyBehavior from "../Behaviors/EnemyBehavior";
import { BehaviorName, Tag, TowerAbility } from "../Global";
import { TagBehavior } from "../Behaviors/TagBehavior";
import UpdateableNode from "../BabylonUpdateable/UpdateableNode";
import ElementalSystem from "./ElementSystem";
import ProjectileBehavior from "../Behaviors/ProjectileBehavior";
import HealthBarBehavior from "../Behaviors/HealthBarBehavior";

type Func = (object1: UpdateableNode, object2: UpdateableNode) => void;
type Registry = { [tag: string]: { [subtag: string]: Func } }; 

export default class CollisionSystem {
    public static registry: Registry = {
        [Tag.Projectile]: {
            [Tag.Enemy]: projectileEnemyCollision,

        },
    };

    public static checkObjectsColliding(obj1: UpdateableNode, obj2: UpdateableNode): boolean | void {
        obj1.computeWorldMatrix(true);
        obj2.computeWorldMatrix(true);
        const mesh1 = obj1.getChildMeshes()[0];
        const mesh2 = obj2.getChildMeshes()[0];
        if (mesh1 && mesh2) {
            mesh1.computeWorldMatrix(true);
            mesh2.computeWorldMatrix(true);
            if (mesh1.intersectsMesh(mesh2)) {
                this.matchPair(obj1, obj2);
            }
        }
    }
    public static matchPair(UpdateableNode1: UpdateableNode, UpdateableNode2: UpdateableNode){
        const tagComponent1 = UpdateableNode1.getBehaviorByName(BehaviorName.Tag) as TagBehavior;
        const tagComponent2 = UpdateableNode2.getBehaviorByName(BehaviorName.Tag) as TagBehavior;

        if (!tagComponent1 || !tagComponent2) {
            return;
        }
        // console.log("colliding");
        for (const tag1 of tagComponent1.tags){
            const firstTag = tag1;
            for (const tag2 of tagComponent2.tags){
                const secondTag = tag2;
                if (this.registry[firstTag] && this.registry[firstTag][secondTag]){
                    this.registry[firstTag][secondTag](UpdateableNode1, UpdateableNode2);
                }
                else if (this.registry[secondTag] && this.registry[secondTag][firstTag]){
                    this.registry[secondTag][firstTag](UpdateableNode2, UpdateableNode1);
                }
            }
        }  
    }
}

enum BarType { 
    Health,
    Armor 
}

function projectileEnemyCollision(projectile: UpdateableNode, enemy: UpdateableNode) {
    const enemyBehavior = enemy.getBehaviorByName(BehaviorName.Enemy) as EnemyBehavior;
    const healthBarBehavior = enemy.getBehaviorByName(BehaviorName.HealthBar) as HealthBarBehavior;
    const projectileBehavior = projectile.getBehaviorByName(BehaviorName.Projectile) as ProjectileBehavior;
    healthBarBehavior.reduceHealth(ElementalSystem.calculateDamage(1, projectileBehavior.element, enemyBehavior.element), BarType.Health);

    if (projectileBehavior.abilities.includes(TowerAbility.PiercingShots)) {
        if (projectileBehavior.shotsLeft >= 1) {
            projectileBehavior.shotsLeft -= 1;
            return;
        }
    }
    if (projectileBehavior.abilities.includes(TowerAbility.SplashMode)) {
        // make all enemies in a certain radius explode
    }
    if (projectileBehavior.abilities.includes(TowerAbility.Freeze)) {
        // enemyBehavior.effects.push(TowerAbility.Freeze);
        // Make this slow down the enemies for a certain time, instead of just adding freeze to effects.
    }
    
    projectile.dispose();
}

// Problem: Make it so that a single enemy and projectile only collide once.
