import { Space, TransformNode, Vector3 } from "@babylonjs/core";
import { BehaviorName, ElementType } from "../Gobal";
import UpdateableBehavior from "../UpdateableBehavior";
import UpdateableNode from "../UpdateableNode";

export default class EnemyBehavior extends UpdateableBehavior {
    public name = BehaviorName.Enemy;

    public speed: number;
    public element: ElementType;

    constructor(speed: number, element: ElementType, health: number) {
        super();
        this.speed = speed;
        this.element = element;
    }

    public attach(target: UpdateableNode): void {
        this._node = target;
    }

    public update(dt: number): void {
        const targetPosition = new Vector3(0, 0, 0);
        this._node.lookAt(targetPosition);
        const direction = targetPosition.subtract(this._node.getAbsolutePosition()).normalize();
        direction.y = 0;
        this._node.translate(direction, this.speed * dt, Space.WORLD);
    }
}
