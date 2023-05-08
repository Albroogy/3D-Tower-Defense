import EnemyBehavior from "../Behavior/EnemyBehavior";
import { BehaviorName, Tag } from "../Gobal";
import { TagBehavior } from "../Behavior/TagBehavior";
import TowerBehavior from "../Behavior/TowerBehaviour";
import UpdateableNode from "../UpdateableNode";
import ElementalSystem from "./ElementalSystem";
import ProjectileBehavior from "../Behavior/ProjectileBehavior";

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
    // const towerBehavior = projectile.parent.getBehaviorByName(BehaviorName.Tower) as TowerBehavior;
    // towerBehavior.target = null;
    projectile.dispose();
    const enemyBehavior = enemy.getBehaviorByName(BehaviorName.Enemy) as EnemyBehavior;
    const projectileBehavior = projectile.getBehaviorByName(BehaviorName.Projectile) as ProjectileBehavior;
    enemyBehavior.reduceHealth(ElementalSystem.calculateDamage(1, projectileBehavior.element, enemyBehavior.element));
}