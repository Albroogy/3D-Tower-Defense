import { Space, TransformNode, Vector3 } from "@babylonjs/core";
import { BehaviorName, ElementType } from "../Global";
import UpdateableBehavior from "../UpdateableBehavior";
import UpdateableNode from "../UpdateableNode";

export default class EnemyBehavior extends UpdateableBehavior {
    public name = BehaviorName.Enemy;

    public speed: number;
    public element: ElementType;
    
    public abilities: TowerAbilitiesType;

    constructor(speed: number, element: ElementType, health: number, abilities: TowerAbilitiesType) {
        super();
        this.abilities = abilities;
        this.speed = speed;
        this.element = element;
    }

    public attach(target: UpdateableNode): void {
        this._node = target;
    }

    // public update(dt: number): void {
    //     const targetPosition = new Vector3(0, 0, 0);
    //     this._node.lookAt(targetPosition);
    //     const direction = targetPosition.subtract(this._node.getAbsolutePosition()).normalize();
    //     direction.y = 0;
    //     this._node.translate(direction, this.speed * dt, Space.WORLD);
    // }
}
