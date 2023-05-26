import EnemyBehavior from "../Behaviors/EnemyBehavior";
import { BehaviorName, objects, Tag } from "../Gobal";
import { TagBehavior } from "../Behaviors/TagBehavior";
import TowerBehavior from "../Behaviors/TowerBehaviour";
import UpdateableNode from "../UpdateableNode";
import ElementalSystem from "./ElementalSystem";
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
        const mesh1 = obj1.getChildMeshes()[0];
        const mesh2 = obj2.getChildMeshes()[0];
        if (mesh1 && mesh2) {
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

function projectileEnemyCollision(projectile: UpdateableNode, enemy: UpdateableNode) {
    const enemyBehavior = enemy.getBehaviorByName(BehaviorName.Enemy) as EnemyBehavior;
    const healthBarBehavior = enemy.getBehaviorByName(BehaviorName.HealthBar) as HealthBarBehavior;
    const projectileBehavior = projectile.getBehaviorByName(BehaviorName.Projectile) as ProjectileBehavior;
    healthBarBehavior.reduceHealth(ElementalSystem.calculateDamage(1, projectileBehavior.element, enemyBehavior.element), 0);
    projectile.dispose();
    // objects.splice(objects.indexOf(enemy), 1);
}